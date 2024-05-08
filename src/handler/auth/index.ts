import express from 'express'
import { PrismaClient } from '@prisma/client'
import { login } from './auth.handler'

const app = express()

export const authHandler = (prisma: PrismaClient) => {
  app.post('/login', (req, res) => login(req, res, prisma))
  // app.post('/', getAllJobs)
  // app.post('/summary', getAllJobs)

  return app
}
