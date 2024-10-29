import express from 'express';
import { UserRoutes } from '../modules/User/user.route';
import { hotelRoutes } from '../modules/Hotel/hotel.route';

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
    path: '/my-bookings',
    route: hotelRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
