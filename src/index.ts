import express, { Express } from 'express'
import dotenv from 'dotenv'
import initHandler from './handler'
import { PrismaClient } from '@prisma/client'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000
const prisma = new PrismaClient()

const createServer = async () => {

  initHandler(app, prisma)

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
  })
}

createServer()
