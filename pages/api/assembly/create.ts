import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401);
    res.end();
  } else {
    const {
      name,
      country,
      state,
      city,
      zip,
      addressOne,
      addressTwo,
      schedule,
      contacts,
    } = req.body;

    try {
      // CREATE
      const assembly = await prisma.assembly.create({
        data: {
          name,
          country,
          state,
          city,
          zip,
          addressOne,
          addressTwo,
          schedule,
          contacts,
        },
      });
      console.log(assembly);
      res.status(200).json(assembly);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }
}
