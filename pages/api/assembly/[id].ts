import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const assemblyId = req.query.id
  const {name, country, id} = req.body
    // DELETE
    if (req.method === 'DELETE') {
        const assembly = await prisma.assembly.delete({
            where: { id: Number(assemblyId) }
        })
        res.json(assembly)
    } 
    // UPDATE
    else if (req.method === 'PUT') {
      const assembly = await prisma.assembly.update({
        where: { id: Number(assemblyId) },
        data: {
          name,
          country
        }
      })
      res.status(200).json({ message: 'Note updated' })
    } 
    else {
        console.log("Note could not be modified")
        res.status(400).json({ message: "Note could not be modified" })
    }
}
