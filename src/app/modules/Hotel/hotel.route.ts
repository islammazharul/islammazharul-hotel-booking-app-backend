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

router.get('/search', hotelController.searchHotel);
router.get('/', hotelController.getAllHotel);
router.get('/:id', hotelController.getAllHotel);
router.get('/', hotelController.getMyBookingHotel);
export const hotelRoutes = router;
