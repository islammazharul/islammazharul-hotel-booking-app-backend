/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import Hotel from '../models/hotel.model';
import { BookingType, HotelType } from '../types/hotel.type';

const router = express.Router();

// /api/my-bookings
router.get(
  '/',
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const hotels = await Hotel.find({
        bookings: { $elemMatch: { userId: req.userId } },
      });

      const results = hotels.map((hotel: any) => {
        const userBookings = hotel.bookings.filter(
          (booking: BookingType) => booking.userId === req.userId,
        );

        const hotelWithUserBookings: HotelType = {
          ...hotel.toObject(),
          bookings: userBookings,
        };

        return hotelWithUserBookings;
      });

      res.status(200).send(results);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Unable to fetch bookings', errors: error });
    }
  },
);

export const HotelBookingRoutes = router;
