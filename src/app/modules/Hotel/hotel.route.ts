import express, { NextFunction, Request, Response } from 'express';
import { hotelController } from './hotel.controller';
import { upload } from '../../utils/sendImageToCloudinary';
import auth from '../../middleware/auth';

const router = express.Router();

router.post(
  '/create-hotel',
  auth(),
  upload.array('imageFiles', 6),
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    // console.log(req.body);
    next();
  },
  hotelController.createHotel,
);

router.get('/', hotelController.searchHotel);
router.get('/', hotelController.getAllHotel);
router.get('/:id', auth(), hotelController.getSingleHotel);
router.get('/', hotelController.getMyBookingHotel);

router.post('/:hotelId/bookings/payment-intent', hotelController.paymentIntent);
router.post('/:hotelId/bookings', hotelController.bookingIntent);
export const hotelRoutes = router;
