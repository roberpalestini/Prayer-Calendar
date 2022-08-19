import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const ministryId = req.query.id
  const {name, website, email, emailTwo, details, phone, cellPhone, country, state, city, addressOne, addressTwo, id} = req.body
    // DELETE
    if (req.method === 'DELETE') {
        const ministry = await prisma.ministry.delete({
            where: { id: Number(ministryId) }
        })
        res.json(ministry)
    }
    // UPDATE
    else if (req.method === 'PUT') {
      const ministry = await prisma.ministry.update({
        where: { id: Number(ministryId) },
        data: {
          name, website, email, emailTwo, details, phone, cellPhone, country, state, city, addressOne, addressTwo
        }
      })
      res.status(200).json({ message: 'Ministry updated' })
    } 
    else {
        console.log("Ministry could not be modified")
        res.status(400).json({ message: "Ministry could not be modified" })
    }
}
