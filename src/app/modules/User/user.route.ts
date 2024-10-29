import express, { NextFunction, Request, Response } from 'express';
import { UserControllers } from './user.controller';

const router = express.Router();

router.post(
  '/create-user',

  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(JSON.stringify(req.body));

    next();
  },
  //   validateRequest(createStudentValidationSchema),
  UserControllers.createUser,
);

export const UserRoutes = router;
