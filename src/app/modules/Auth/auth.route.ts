import express from 'express';
import { AuthControllers } from './auth.controllers';

const router = express.Router();

router.post('/login', AuthControllers.loginUser);

export const authRoutes = router;
