import { NextApiRequest, NextApiResponse } from 'next';
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
    const nameContact = req.body;
    try {
      const result = await prisma?.person.findMany({
        where: {
          OR: [
            {
              name: {
                contains: nameContact,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: nameContact,
                mode: 'insensitive',
              },
            },
          ],
        },
        select: {
          name: true,
          email: true,
          id: true,
        },
      });
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error });
    }
  }
}
