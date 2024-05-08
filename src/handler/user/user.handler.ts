import { PrismaClient } from "@prisma/client";
import { Request, Response } from 'express'

export const update = async (
    req: Request,
    res: Response,
    prisma: PrismaClient
  ) => {
    const { currentEmail, newEmail, birthDate, gender } = req.body;
  
    try {
      if (!currentEmail) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      const existingUser = await prisma.user.findUnique({
        where: { email: currentEmail }
      });
  
      if (!existingUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (newEmail && newEmail !== currentEmail) {
        const existingUserWithEmail = await prisma.user.findUnique({
          where: { email: newEmail }
        });
  
        if (existingUserWithEmail) {
          return res.status(409).json({ message: 'Email is already in use' });
        }
      }
  
      const updatedUser = await prisma.user.update({
        where: { email: currentEmail },
        data: {
          email: newEmail || existingUser.email,
          birthDate: birthDate ? new Date(birthDate) : existingUser.birthDate,
          gender: gender || existingUser.gender
        }
      });
  
      return res.status(200).json({ user: updatedUser });
    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  