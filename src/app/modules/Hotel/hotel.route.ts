import express from 'express';
import { hotelController } from './hotel.controller';

import auth from '../../middleware/auth';
import Hotel from './hotel.model';

const router = express.Router();

router.get('/', hotelController.searchHotel);
router.get('/', hotelController.getAllHotel);
router.get('/:id', hotelController.getSingleHotel);
router.get('/', hotelController.getMyBookingHotel);

// payment api
router.post('/:hotelId/bookings/payment-intent', hotelController.paymentIntent);
router.post('/:hotelId/bookings', hotelController.bookingIntent);
export const hotelRoutes = router;
