<<<<<<< HEAD
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authService } from "@/services/auth.service";

const authOptions: NextAuthOptions = {
  providers: [
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
    async jwt({ token, user }) {
      if (user) {
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
=======
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-options";
>>>>>>> 821dd2f36a3aae1a74b9c704c7c326f9edd9c637

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
