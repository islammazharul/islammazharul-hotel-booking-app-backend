import express, { NextFunction, Request, Response } from 'express';
import Hotel from '../Hotel/hotel.model';
import { MyHotelControllers } from './myHotel.controllers';
import { upload } from '../../utils/sendImageToCloudinary';
import validateRequest from '../../middleware/validateRequest';
import { hotelValidation } from '../Hotel/hotel.validation';

const router = express.Router();
// my-hotel api
router.post(
  '/create-hotel',
  upload.array('imageFiles', 6),
  async (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    // console.log(req.body);
    next();
  },
  validateRequest(hotelValidation.hotelValidationSchema),
  MyHotelControllers.createHotel,
);

router.get('/', MyHotelControllers.getMyHotels);
router.get('/:id', MyHotelControllers.getMySingleHotel);
router.put(
  '/:hotelId',
  upload.array('imageFiles'),
  MyHotelControllers.updateMySingleHotel,
);

export const MyHotelRoute = router;
