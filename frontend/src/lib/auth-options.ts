import NextAuth, { NextAuthOptions } from "next-auth";
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
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
    async jwt({ token, user, account }) {
      // Google OAuth sign-in: call backend to find-or-create user and get backend JWT
      if (account?.provider === "google" && user) {
        try {
          const url = `${BACKEND_URL}/auth/google`;
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: user.email,
              fullName: user.name,
              roles: ["USER"],
            }),
          });
          const data = await res.json();

          if (data.success) {
            token.id = data.data.user.id.toString();
            token.roles = data.data.user.roles;
            token.accessToken = data.data.access_token;
            token.ownerProfile = data.data.user.ownerProfile;
          }
        } catch (error) {
          console.error("Google OAuth backend call failed:", error);
        }
      }
      // Credentials sign-in
      else if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.accessToken = user.token;
        token.ownerProfile = user.ownerProfile;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.roles = token.roles;
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
