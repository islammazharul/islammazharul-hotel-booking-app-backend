/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import { User } from '../models/user.model';
import { registerValidationSchema } from '../validations/user.validation';
import { validateRequest } from '../middleware/validateRequest';
import { authMiddleware } from '../middleware/authMiddleware';
import { generateToken } from '../utils/jwt';
const router = express.Router();

router.get(
  '/me',
  authMiddleware,
  async (req: Request, res: Response): Promise<any | undefined> => {
    const userId = req.userId;

    try {
      const user = await User.findById(userId).select('-password');
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong';
      return res.status(500).json({ message: errMsg });
    }
  },
);

router.post(
  '/register',
  async (req: Request, res: Response): Promise<any | undefined> => {
    try {
      const validateData = validateRequest(registerValidationSchema, req.body);

      const existingUser = await User.findOne({ email: validateData.email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const user = new User({
        firstName: validateData.firstName,
        lastName: validateData.lastName,
        email: validateData.email,
        password: validateData.password,
      });
      await user.save();

      const token = generateToken(user._id.toString());

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        maxAge: 86400000,
        sameSite: 'strict',
      });

      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error', error });
    }
  },
);

export const UserRoutes = router;
