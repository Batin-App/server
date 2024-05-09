import { Express } from 'express'
import { PrismaClient } from '@prisma/client'
import { authHandler } from './auth'
import bodyParser from 'body-parser'
import { userHandler } from './user'
import { logHandler } from './log'
import { authMiddleware } from './commons/middleware/auth.middleware'
import { recommendationHandler } from './recommendation'

const initHandler = (app: Express, prisma: PrismaClient) => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/auth', authHandler(prisma))
  app.use('/user', authMiddleware, userHandler(prisma))
  app.use('/logs', authMiddleware, logHandler(prisma))
  app.use('/recommendations', authMiddleware, recommendationHandler(prisma))
}

export default initHandler
