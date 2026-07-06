import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { authService } from "@/services/auth.service";

const BACKEND_URL =
  process.env.INTERNAL_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8000/api";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        try {
          const data = await authService.login({
            email: credentials.email,
            password: credentials.password,
          });

          if (data && data.data && (data.data.token || data.data.access_token)) {
            return {
              id: data.data.user.id.toString(),
              email: data.data.user.email,
              name: data.data.user.fullName,
              roles: data.data.user.roles,
              ownerProfile: data.data.user.ownerProfile,
              token: data.data.token || data.data.access_token,
            };
          }

          return null;
        } catch (error: any) {
          const apiMessage = error.response?.data?.message || error.message;
          throw new Error(apiMessage);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // ── Handle session update from /api/auth/google-finalize ──────────────
      if (trigger === "update" && session?.finalizedGoogle) {
        token.googlePending = false;
        token.googleEmail = undefined;
        token.googleName = undefined;
        token.id = session.finalizedGoogle.id;
        token.roles = session.finalizedGoogle.roles;
        token.accessToken = session.finalizedGoogle.accessToken;
        token.ownerProfile = session.finalizedGoogle.ownerProfile;
        return token;
      }

      // ── Google OAuth sign-in ──────────────────────────────────────────────
      if (account?.provider === "google" && user) {
        try {
          // Step 1: Check if this Google account already has a backend account
          const checkRes = await fetch(`${BACKEND_URL}/auth/google/check`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: user.email }),
          });

          if (checkRes.ok) {
            const checkData = await checkRes.json();

            if (checkData.exists) {
              // ── Returning user: sign them in directly, skip interstitial ──
              const loginRes = await fetch(`${BACKEND_URL}/auth/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  email: user.email,
                  fullName: user.name,
                  roles: ["USER"], // backend ignores this for existing users
                }),
              });
              const loginData = await loginRes.json();
              if (loginData.success) {
                token.googlePending = false;
                token.id = loginData.data.user.id.toString();
                token.roles = loginData.data.user.roles;
                token.accessToken = loginData.data.access_token;
                token.ownerProfile = loginData.data.user.ownerProfile;
              }
              return token;
            }

            // ── New user (exists = false): needs role selection ──
            token.googlePending = true;
            token.googleEmail = user.email ?? undefined;
            token.googleName = user.name ?? undefined;
            return token;
          }
        } catch {
          // Check endpoint unavailable (e.g. backend not yet restarted)
        }

        // ── Fallback: check endpoint unreachable → call /auth/google directly ──
        // This preserves the old safe behaviour for returning users and
        // creates new accounts with the default USER role as a safe fallback.
        try {
          const fallbackRes = await fetch(`${BACKEND_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              fullName: user.name,
              roles: ["USER"],
            }),
          });
          const fallbackData = await fallbackRes.json();
          if (fallbackData.success) {
            token.id = fallbackData.data.user.id.toString();
            token.roles = fallbackData.data.user.roles;
            token.accessToken = fallbackData.data.access_token;
            token.ownerProfile = fallbackData.data.user.ownerProfile;
          }
        } catch (error) {
          console.error("Google OAuth backend call failed:", error);
        }
        return token;
      }

      // ── Credentials sign-in ───────────────────────────────────────────────
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.accessToken = user.token;
        token.ownerProfile = user.ownerProfile;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.googlePending) {
        // Expose pending state so the role-select page can read it
        session.googlePending = true;
        session.googleEmail = token.googleEmail;
        session.googleName = token.googleName;
        // Clear user-level data so guarded pages don't accidentally let them through
        if (session.user) {
          session.user.id = "";
          session.user.roles = [];
        }
      } else if (session.user) {
        session.user.id = token.id ?? "";
        session.user.roles = token.roles ?? [];
        session.accessToken = token.accessToken;
        session.user.ownerProfile = token.ownerProfile;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "super-secret-default-key-for-dev",
};
