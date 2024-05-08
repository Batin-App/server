import { Express } from 'express'
import { PrismaClient } from '@prisma/client'
import { authHandler } from './auth'
import bodyParser from 'body-parser'
import { userHandler } from './user'

const initHandler = (app: Express, prisma: PrismaClient) => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/auth', authHandler(prisma))
  app.use('/user', userHandler(prisma))
}

export default initHandler
