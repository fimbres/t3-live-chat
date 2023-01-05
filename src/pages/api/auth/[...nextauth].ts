import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { customAlphabet } from "nanoid";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 10);

export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, user }) {
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: {
          label: "Username",
          type: "text",
          placeholder: "Enter your username"
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password"
        }
      },
      async authorize(credentials, _) {
        const user = { id: nanoId(), name: credentials?.name, password: credentials?.password }
  
        if (user) {
          return user
        } else {
          return null
        }
      }
    })
  ],
  secret: env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt"
  }
};

export default NextAuth(authOptions);
