/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import validateRequest from '../middleware/validateRequest';
import { UserValidation } from '../validations/user.validation';
import verifyToken from '../middleware/auth';
const router = express.Router();

router.get(
  '/me',
  verifyToken,
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
  validateRequest(UserValidation.userValidationSchema),
  async (req: Request, res: Response): Promise<any | undefined> => {
    try {
      let user = await User.findOne({
        email: req.body.email,
      });

      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User(req.body);
      await user.save();

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_ACCESS_SECRET as string,
        {
          expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
        },
      );

      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        maxAge: 86400000,
      });
      return res.status(200).send({ message: 'User registered OK' });
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong';
      return res.status(500).json({ message: errMsg });
    }
  },
);

export const UserRoutes = router;
