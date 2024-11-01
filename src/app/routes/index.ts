import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { hotelRoutes } from '../modules/Hotel/hotel.route';
import { authRoutes } from '../modules/Auth/auth.route';
import { MyHotelRoute } from '../modules/My-hotel/myHotel.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/hotels',
    route: hotelRoutes,
  },
  {
    path: '/',
    route: MyHotelRoute,
  },
  {
    path: '/my-bookings',
    route: hotelRoutes,
  },
  {
    path: '/auth',
    route: authRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
