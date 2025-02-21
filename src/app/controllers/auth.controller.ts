import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import verifyToken from '../middleware/auth';

const router = express.Router();

router.post(
  '/login',

  async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const hashedPassword = user?.password;
      //   console.log(password, hashedPassword);

      // Check for undefined or null
      if (!password || !hashedPassword) {
        throw new Error(
          'Both plainTextPassword and hashedPassword are required',
        );
      }

      const isMatch = await bcrypt.compare(password, hashedPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

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
      res.status(200).json({ userId: user._id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  },
);

router.get('/validate-token', verifyToken, (req: Request, res: Response) => {
  res.status(200).send({ userId: req.userId });
});

router.post('/logout', (req: Request, res: Response) => {
  res.cookie('auth_token', '', {
    expires: new Date(0),
  });
  res.send();
});

export const AuthRoutes = router;
