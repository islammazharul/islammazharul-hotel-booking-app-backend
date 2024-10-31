import config from '../config';
import AppError from '../errors/AppError';
import { User } from '../modules/User/user.model';
import catchAsync from '../utils/catchAsync';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    // checking if the token is missing
    if (!token) {
      throw new AppError(401, 'You are not authorized!');
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;

    const { email } = decoded;

    // checking if the user is exist
    const user = await User.isUserExistsByCustomId(email);

    if (!user) {
      throw new AppError(404, 'This user is not found !');
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
