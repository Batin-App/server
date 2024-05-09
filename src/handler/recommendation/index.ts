import express from 'express'
import { PrismaClient } from '@prisma/client'
import { recommendActivity } from './recommendation.handler'

const app = express()

export const recommendationHandler = (prisma: PrismaClient) => {
  app.get('/', (_, res) => recommendActivity(res, prisma))

  return app
}
