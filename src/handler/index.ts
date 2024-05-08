import { Express } from 'express'
import { PrismaClient } from '@prisma/client'
import { authHandler } from './auth'
import bodyParser from 'body-parser'
import { userHandler } from './user'
import { logHandler } from './log'
import { authMiddleware } from './commons/middleware/auth.middleware'

const initHandler = (app: Express, prisma: PrismaClient) => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/auth', authHandler(prisma))
  app.use('/user', userHandler(prisma))
  app.use('/logs', authMiddleware, logHandler(prisma))
}

export default initHandler
