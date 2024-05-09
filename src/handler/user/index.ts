import express from 'express'
import { PrismaClient } from '@prisma/client'
import { getUser, update } from './user.handler'
import { authMiddleware } from '../commons/middleware/auth.middleware'

const app = express()

export const userHandler = (prisma: PrismaClient) => {
  app.post('/update', authMiddleware, (req, res) => update(req, res, prisma))
  app.get('/', authMiddleware,(_, res) => getUser(res, prisma))

  return app
}
