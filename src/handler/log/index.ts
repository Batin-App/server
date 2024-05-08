import express from 'express'
import { PrismaClient } from '@prisma/client'
import { saveLog } from './log.handler'
// import {getLogs} from "./log.handler";

const app = express()

export const logHandler = (prisma: PrismaClient) => {
  // app.get('/', (req, res) => getLogs(req, res, prisma))
  app.post('/', (req, res) => saveLog(req, res, prisma))
  // app.post('/summary', getAllJobs)

  return app
}
