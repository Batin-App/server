import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import axios from 'axios'
import { PredictionResponseInterface } from './interface'
import { EMOTION_CLASSES } from './constant'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'

export const getLogs = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  const date = new Date((req.query.date as string) || Date.now()).toISOString()
  const { userId } = res.locals

  const activities = await prisma.activity.findMany({
    where: {
      log: {
        userId,
        date,
      },
    },
  })

  res.status(200).json(activities)
}

export const getLogSummary = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  const { date } = req.query
  const { userId } = res.locals

  if (!date) {
    res.status(400).json({
      message: 'Please provide the date of log!',
    })
    return
  }

  try {
    const logDate = new Date(date as string).toISOString()
    const log = await prisma.log.findUniqueOrThrow({
      where: {
        userId_date: {
          userId,
          date: logDate,
        },
      },
    })

    const activities = await prisma.activity.findMany({
      where: {
        logId: log.id,
      },
    })

    const summedActivity = activities.map(({ description }) => description)
    const predictionInput = summedActivity.join(' and ')
    const {
      data: { predicted_class, probabilities },
    } = await axios.post<PredictionResponseInterface>(
      `${process.env.MODEL_API_URL}`,
      {
        text: predictionInput,
      }
    )

    const response = {
      predictedClass: predicted_class,
      predictedEmotion: EMOTION_CLASSES[predicted_class],
    }

    await prisma.logEmotion.create({
      data: {
        logId: log.id,
        predictionInput,
        probabilities: JSON.stringify(probabilities),
        ...response,
      },
    })

    res.status(200).json(response)
  } catch (error) {
    console.error(error)
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({
          message: "You didn't log any activity on that date yet!",
        })
        return
      }
    }
    res.status(500).json({
      message: 'Something went wrong on our side!',
    })
  }
}

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
        const log = await tx.log.upsert({
          where: {
            userId_date: {
              userId,
              date,
            },
          },
          update: {
            userId,
          },
          create: {
            date,
            userId,
          },
          select: {
            id: true,
          },
        })

        await tx.activity.create({
          data: {
            logId: log.id,
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
