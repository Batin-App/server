import express from 'express'
import { PrismaClient } from '@prisma/client'
// import {getLogs} from "./log.handler";

const app = express()

export const logHandler = (prisma: PrismaClient) => {
  // app.get('/', (req, res) => getLogs(req, res, prisma))
  // app.post('/', getAllJobs)
  // app.post('/summary', getAllJobs)

  return app
}
