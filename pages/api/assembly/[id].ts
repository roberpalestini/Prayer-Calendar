import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { unstable_getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401);
    res.end();
  } else {
    const assemblyId = req.query.id;
    const {
      name,
      country,
      state,
      city,
      zip,
      addressOne,
      addressTwo,
      schedule,
      id,
      contacts,
    } = req.body;
    console.log(contacts);
    // DELETE
    if (req.method === 'DELETE') {
      const assembly = await prisma.assembly.delete({
        where: { id: Number(assemblyId) },
      });
      res.json(assembly);
    }
    // UPDATE
    else if (req.method === 'PUT') {
      // const contactsList = await prisma.person.findMany({
      //   where:{ id:{in : contacts }}
      // })

      const assembly = await prisma.assembly.update({
        where: { id: Number(assemblyId) },
        data: {
          name,
          country,
          state,
          city,
          zip,
          addressOne,
          addressTwo,
          schedule,
          contacts: { connect: contacts.map((conId) => ({ id: conId })) },
        },
      });
      res.status(200).json({ message: 'Note updated' });
    } else {
      console.log('Note could not be modified');
      res.status(400).json({ message: 'Note could not be modified' });
    }
  }
}
