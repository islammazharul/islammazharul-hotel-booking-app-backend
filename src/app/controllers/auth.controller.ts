/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { validateRequest } from '../middleware/validateRequest';
import { loginValidationSchema } from '../validations/user.validation';
import cors from 'cors';
import { generateToken } from '../utils/jwt';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', async (req: Request, res: Response): Promise<any> => {
  try {
    const validateData = validateRequest(loginValidationSchema, req.body);
    const user = await User.findOne({ email: validateData.email }).select(
      '+password',
    );
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const password = validateData?.password;
    const hashedPassword = user?.password;

    // Check for undefined or null
    if (!password || !hashedPassword) {
      throw new Error('Both plainTextPassword and hashedPassword are required');
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString());

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      maxAge: 86400000,
      sameSite: 'strict',
    });
    return res
      .status(200)
      .json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server error', error });
  }
});

router.get(
  '/validate-token',
  authMiddleware,
  cors({ origin: process.env.FRONTEND_URL as string }),
  (req: Request, res: Response) => {
    res
      .status(200)
      .send({ message: 'You are authenticated', userId: req.userId });
  },
);

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logout successful' });
});

export const AuthRoutes = router;
