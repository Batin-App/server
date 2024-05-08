import { PrismaClient } from '@prisma/client'
import { NextFunction, Request, Response } from 'express'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { createDecipheriv } from 'node:crypto'

const prisma = new PrismaClient()

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers
  if (!authorization) {
    res.status(401).json({
      message: 'Unauthorized Request!',
    })
    return
  }

  const headerPayload = authorization.split(' ')
  if (!authorization.startsWith('Bearer') || headerPayload.length < 2) {
    res.status(401).json({
      message: 'Invalid Signature!',
    })
    return
  }

  try {
    const token = headerPayload[1]
    await prisma.session.findFirstOrThrow({
      where: {
        token,
        expiredAt: {
          gt: new Date(Date.now()),
        },
      },
      include: {
        user: true,
      },
    })

    const userId = decryptToken(token)

    prisma.user.findUniqueOrThrow({
      where: {
        id: userId,
      },
    })

    res.locals.userId = userId

    next()
  } catch (error) {
    console.error(error)
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({
          message: 'Invalid Session!',
        })
        return
      }
    }
    if (error instanceof Error && error.message === 'Invalid Signature!') {
      res.status(400).json({
        message: error.message,
      })
      return
    }

    res.status(500).json({
      message: 'Something went wrong on our side!',
    })
    return
  }
}

const decryptToken = (token: string) => {
  const key = process.env.APP_SECRET || 'b3a2f71d0b99dc24d5784a8c88599f07'

  const rawToken = token.split('$$')
  if (rawToken.length < 3) {
    throw Error('Invalid Signature!')
  }
  const [encryptedText, tag, iv] = rawToken

  const decipher = createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'))
  decipher.setAuthTag(Buffer.from(tag, 'hex'))

  let userId = decipher.update(encryptedText, 'hex', 'utf8')
  userId += decipher.final('utf8')

  return userId
}
