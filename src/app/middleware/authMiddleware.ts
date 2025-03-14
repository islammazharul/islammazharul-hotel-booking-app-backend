// import { NextFunction, Request, Response } from 'express';
// import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

// const verifyToken = (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ): Promise<any> | undefined => {
//   const token = req.cookies['auth_token'];
//   console.log(token);
//   if (!token) {
//     res.status(401).json({ message: 'unauthorized' });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
//     req.userId = (decoded as JwtPayload).userId;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: 'unauthorized', errors: error });
//     return;
//   }
// };

// const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const token = req.cookies['auth_token'];
//     if (!token) {
//       return res.status(401).json({ message: 'No token provided' });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
//     req.userId = (decoded as { userId: string }).userId;
//     next();
//   } catch (error) {
//     console.error('JWT Verification Failed:', error);
//     return res.status(401).json({ message: 'Invalid or expired token' });
//   }
// };

// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> | undefined => {
  const token = req.cookies.token;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId; // Attach user ID to the request object
    next();
  } catch (error) {
    res
      .status(401)
      .json({ message: 'Unauthorized: Invalid token', errors: error });
    return;
  }
};

// export default authMiddleware;
