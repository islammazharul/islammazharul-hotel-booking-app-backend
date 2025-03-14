// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import config from '../config';

const JWT_SECRET = config.jwt_secret as string; // Replace with a strong secret key
const JWT_EXPIRES_IN = '1d';

// Generate a JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Verify a JWT token
export const verifyToken = (token: string): jwt.JwtPayload => {
  return jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
};
