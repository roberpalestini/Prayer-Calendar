import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {name, website, email, emailTwo, details, phone, cellPhone, country, state, city, addressOne, addressTwo} = req.body

  try {
    // CREATE
    await prisma.ministry.create({
      data: {
        name, website, email, emailTwo, details, phone, cellPhone, country, state, city, addressOne, addressTwo
      }
    })
    res.status(200).json({ message: 'Ministry added' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error })
  }
}
