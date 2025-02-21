import express from 'express';
import { UserRoutes } from '../controllers/user.controller';
import { AuthRoutes } from '../controllers/auth.controller';
import { MyHotelRoutes } from '../controllers/my-hotel.controller';
import { HotelRoutes } from '../controllers/hotel.controller';
import { HotelBookingRoutes } from '../controllers/hotel-booking.controller';
import { TicketRoutes } from '../controllers/ticket.controller';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/hotels',
    route: HotelRoutes,
  },
  {
    path: '/my-hotels',
    route: MyHotelRoutes,
  },
  {
    path: '/my-bookings',
    route: HotelBookingRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/ticket',
    route: TicketRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
