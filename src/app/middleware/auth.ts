import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<any> | undefined => {
  const token = req.cookies['auth_token'];
  if (!token) {
    // return res.status(401).json({ message: 'unauthorized' });
    res.status(401).json({
      error: 'unauthorized',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string);
    req.userId = (decoded as JwtPayload).userId;
    next();
  } catch (error) {
    // return res.status(401).json({ message: 'unauthorized' });
    res.status(401).json({
      error: 'unauthorized',
    });
    return;
  }
};

export default verifyToken;
