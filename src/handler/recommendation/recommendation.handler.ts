import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
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

  const activities = await prisma.activity.findMany({
    where: {
      date: {
        lte: now,
        gte: sub(now, { days: 7 }),
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

    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: `Give a list of recommended activities to do when i'm feeling ${emotion}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    })

    console.log()

    res
      .status(200)
      .json({ recommendedActivities: response.choices[0].message.content })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Something went wrong on our side!',
    })
  }
}
