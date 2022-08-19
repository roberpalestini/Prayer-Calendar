import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const personId = req.query.id
  const {name, email, note, homePhone, cellPhone, country, state, city, addressOne, addressTwo} = req.body
    // DELETE
    if (req.method === 'DELETE') {
        const person = await prisma.person.delete({
            where: { id: Number(personId) }
        })
        res.json(person)
    } 
    // UPDATE
    else if (req.method === 'PUT') {
      const person = await prisma.person.update({
        where: { id: Number(personId) },
        data: {
          name, email, note, homePhone, cellPhone, country, state, city, addressOne, addressTwo
        }
      })
      res.status(200).json({ message: 'Note updated' })
    } 
    else {
        console.log("Note could not be modified")
        res.status(400).json({ message: "Note could not be modified" })
    }
}
