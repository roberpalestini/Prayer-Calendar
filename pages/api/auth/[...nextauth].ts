import { NextApiHandler } from 'next';

import Providers from 'next-auth/providers';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GitHubProvider from 'next-auth/providers/github';
import NextAuth, { NextAuthOptions } from 'next-auth';

// import prisma from '../../../lib/prisma';

// const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
// export default authHandler;
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  // const options = {
  providers: [
    GitHubProvider({
      id: 'github',
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (account.providerAccountId === '17788706') {
        return true;
      } else {
        // Return false to display a default error message
        // return false
        // Or you can return a URL to redirect to:
        return false;
      }
    },
    // callbacks: {
    //   async jwt({ token }) {
    //     token.userRole = 'admin';
    //     return token;
    //   },
    // },
  },
};

export default NextAuth(authOptions);
