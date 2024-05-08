import express from 'express'
import { PrismaClient } from '@prisma/client'
import { update } from './user.handler'

const app = express()

export const userHandler = (prisma: PrismaClient) => {
  app.post('/update', (req, res) => update(req, res, prisma))

  return app
}
