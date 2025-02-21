import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import Hotel from '../models/hotel.model';
import { HotelType } from '../types/hotel.type';

const router = express.Router();

// /api/my-bookings
router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId: req.userId } },
    });

    const results = hotels.map((hotel: any) => {
      const userBookings = hotel.bookings.filter(
        (booking: any) => booking.userId === req.userId,
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });

    res.status(200).send(results);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Unable to fetch bookings' });
  }
});

export const HotelBookingRoutes = router;
