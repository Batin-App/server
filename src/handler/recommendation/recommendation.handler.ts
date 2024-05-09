import { PrismaClient } from '@prisma/client'
import { Response } from 'express'
import OpenAI from 'openai'
import { sub } from 'date-fns'
import axios from 'axios'
import { PredictionResponseInterface } from '../log/interface'
import { EMOTION_CLASSES } from '../log/constant'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const recommendActivity = async (
  res: Response,
  prisma: PrismaClient
) => {
  const now = new Date(Date.now())
  const userId: string = res.locals.userId

  const activities = await prisma.activity.findMany({
    where: {
      log: {
        userId,
        date: {
          lte: now,
          gte: sub(now, { days: 7 }),
        },
      },
    },
    select: {
      description: true,
    },
  })

  const summedActivities = activities
    .map(({ description }) => description)
    .join(' and ')

  try {
    const {
      data: { predicted_class },
    } = await axios.post<PredictionResponseInterface>(
      `${process.env.MODEL_API_URL}`,
      {
        text: summedActivities,
      }
    )

    const emotion = EMOTION_CLASSES[predicted_class]

    if (predicted_class < 2) {
      res.status(200).json({
        recommendedActivities: `You're feeling ${emotion}, keep it up!`,
      })
      return
    }

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Give a list of recommended activities to do to relieve my ${emotion}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    })

    const recommendedActivities = response.choices[0].message.content

    if (!recommendedActivities) {
      throw Error()
    }

    await prisma.recommendation.create({
      data: {
        activities: recommendedActivities,
        emotion,
        userId,
      },
    })

    res.status(200).json({ recommendedActivities })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Something went wrong on our side!',
    })
  }
}
