import express from 'express';
import { AuthControllers } from './auth.controllers';

const router = express.Router();

router.post('/login', AuthControllers.loginUser);

router.post(
  '/refresh-token',
  // validateRequest(AuthValidation.refreshTokenValidationSchema),
  AuthControllers.refreshToken,
);

export const authRoutes = router;
