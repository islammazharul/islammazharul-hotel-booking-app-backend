/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import verifyToken from '../middleware/auth';
import validateRequest from '../middleware/validateRequest';
import { hotelValidation } from '../validations/hotel.validation';
import { sendImageToCloudinary, upload } from '../utils/sendImageToCloudinary';
import { HotelType } from '../types/hotel.type';
import Hotel from '../models/hotel.model';

const router = express.Router();
router.post(
  '/',
  verifyToken,
  upload.array('imageFiles', 6),
  validateRequest(hotelValidation.hotelValidationSchema),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const imageFiles = req.files as Express.Multer.File[];
      const newHotel: HotelType = req.body;

      const imageUrls = await sendImageToCloudinary(imageFiles);

      newHotel.imageUrls = imageUrls;
      newHotel.lastUpdated = new Date();
      newHotel.userId = req.userId;

      const hotel = new Hotel(newHotel);
      await hotel.save();
      // console.log('hotel', hotel);

      res.status(201).send(hotel);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong';
      return res.status(500).json({ message: errMsg });
    }
  },
);

router.get(
  '/',
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const hotels = await Hotel.find({ userId: req.userId });
      res.json(hotels);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Error fetching hotels';
      return res.status(500).json({ message: errMsg });
    }
  },
);

router.get(
  '/:id',
  verifyToken,
  async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id.toString(); /* find hotel id */
    // console.log(id);
    try {
      const hotel = await Hotel.findOne({
        _id: id,
        userId: req.userId,
      });
      //   console.log(hotel);
      return res.json(hotel);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Error fetching hotels';
      return res.status(500).json({ message: errMsg });
    }
  },
);

router.put(
  '/:hotelId',
  verifyToken,
  upload.array('imageFiles'),
  validateRequest(hotelValidation.hotelValidationSchema),
  async (req: Request, res: Response): Promise<any> => {
    try {
      const updatedHotel: HotelType = req.body;
      updatedHotel.lastUpdated = new Date();
      const hotel = await Hotel.findOneAndUpdate(
        {
          _id: req.params.hotelId,
          userId: req.userId,
        },
        updatedHotel,
        { new: true },
      );
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      const files = req.files as Express.Multer.File[];
      const updatedImageUrls = await sendImageToCloudinary(files);

      hotel.imageUrls = [
        ...updatedImageUrls,
        ...(updatedHotel.imageUrls || []),
      ];

      await hotel.save();
      res.status(2001).json(hotel);
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong';
      return res.status(500).json({ message: errMsg });
    }
  },
);

export const MyHotelRoutes = router;
