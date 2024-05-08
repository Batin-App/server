import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express'

export const update = async (
    req: Request,
    res: Response,
    prisma: PrismaClient
  ) => {
    const { email, birthDate, gender } = req.body;
    const { userId } = res.locals

    try {    
      if (!!email) {
        const existingUserWithEmail = await prisma.user.findUnique({
          where: { email }
        });
  
        if (!!existingUserWithEmail) {
            res.status(409).json({ message: 'Email is already in use' });
            return
        }
      }
  
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(email ? { email } : {}),
          ...(birthDate ? { birthDate: new Date(birthDate) } : {}),
          ...(gender ? { gender } : {})
        }
      });
      
      
      res.status(200).json({ user: updatedUser });
      return
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
      return
    }
  };
  