import express, { NextFunction, Request, Response } from 'express';
import { hotelController } from './hotel.controller';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/',
  upload.array('imageFiles', 6),
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    next();
    hotelController.createHotel;
  },
);
export const hotelRoutes = router;
