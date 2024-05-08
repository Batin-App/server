import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'

export const saveLog = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  const { date, activity } = req.body
  if (!date && !activity) {
    res.status(400).json({
      message: 'Date & activity is required!',
    })
    return
  }

  if (!date) {
    res.status(400).json({
      message: 'Date is required!',
    })
    return
  }

  if (!activity) {
    res.status(400).json({
      message: 'Activity is required!',
    })
    return
  }

  const { userId } = res.locals
  try {
    await prisma.$transaction(
      async (tx) => {
        await tx.log.upsert({
          where: {
            date,
          },
          update: {
            userId,
          },
          create: {
            date,
            userId,
          },
        })

        await tx.activity.create({
          data: {
            date,
            description: activity,
          },
        })
      },
      {
        timeout: 3000,
      }
    )
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Something went wrong on our side!',
    })
    return
  }

  res.status(201).json({
    message: 'Successfully saved activity!',
  })
}
