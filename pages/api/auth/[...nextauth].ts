import { NextApiHandler } from 'next';
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';

// import prisma from '../../../lib/prisma';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
  // async signIn({ user, account, profile, email, credentials }) {
  //   if (user.approved === 1) {
  //     return true
  //   } else {
  //     // Return false to display a default error message
  //     // return false
  //     // Or you can return a URL to redirect to:
  //     return '/unauthorized'
  //   }
  // }
  // },
  //   async jwt({ token }) {
  //     token.userRole = "admin"
  //     return token
  //   },
  }
};
