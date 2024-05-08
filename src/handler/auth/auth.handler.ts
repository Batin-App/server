import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { createCipheriv, randomBytes } from 'crypto'
import { add } from 'date-fns'

export const getLogs = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  res.json({
    message: 'test',
  })
}

export const login = async (
  req: Request,
  res: Response,
  prisma: PrismaClient
) => {
  const { email, password } = req.body
  if (!email && !password) {
    res.status(400).json({
      message: 'Email & password is required!',
    })
    return
  }

  if (!email) {
    res.status(400).json({
      message: 'Email is required!',
    })
    return
  }

  if (!password) {
    res.status(400).json({
      message: 'Password is required!',
    })
    return
  }

  try {
    const { password: passwordHash, id } = await prisma.user.findUniqueOrThrow({
      where: {
        email: email as string,
      },
      select: {
        id: true,
        password: true,
      },
    })

    if (!(await bcrypt.compare(password, passwordHash))) {
      res.status(401).json({
        message: "Email or password didn't match!",
      })
      return
    }

    const { token, vector } = generateToken(id)
    await prisma.session.create({
      data: {
        token,
        vector,
        userId: id,
        expiredAt: add(new Date(Date.now()), { days: 7 }),
      },
    })

    res.status(200).json({
      token,
    })
    return
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        res.status(404).json({
          message: 'User is not registered!',
        })
        return
      }
    }
    console.error(error)
    res.status(500).json({
      message: 'Something went wrong on our side!',
    })
    return
  }
}

export const generateToken = (id: string) => {
  const key = process.env.APP_SECRET || 'secret'
  const iv = randomBytes(16)

  const cipher = createCipheriv('aes-256-gcm', key, iv)
  let encrypted = cipher.update(id)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  return { token: encrypted.toString('hex'), vector: iv.toString('hex') }
}