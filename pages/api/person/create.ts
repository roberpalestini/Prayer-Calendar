import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | any>,
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401);
    res.end();
  } else {
    const {
      name,
      email,
      note,
      homePhone,
      cellPhone,
      country,
      state,
      city,
      addressOne,
      addressTwo,
    } = req.body;

    try {
      // CREATE
      await prisma.person.create({
        data: {
          name,
          email,
          note,
          homePhone,
          cellPhone,
          country,
          state,
          city,
          addressOne,
          addressTwo,
        },
      });
      res.status(200).json({ message: 'Person added' });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }
}
