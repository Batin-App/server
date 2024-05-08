import { Express } from 'express'
import { PrismaClient } from '@prisma/client'
import { authHandler } from './auth'
import bodyParser from 'body-parser'

const initHandler = (app: Express, prisma: PrismaClient) => {
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.use('/auth', authHandler(prisma))
}

export default initHandler
