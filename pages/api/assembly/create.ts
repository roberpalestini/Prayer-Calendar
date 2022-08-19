import type { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from "../../../lib/prisma"

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const {name, country, state, city, addressOne, addressTwo, schedule} = req.body

  try {
    // CREATE
    await prisma.assembly.create({
      data: {
        name, country, state, city, addressOne, addressTwo, schedule
      }
    })
    res.status(200).json({ message: 'Assembly added' })
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: error })
  }
}
