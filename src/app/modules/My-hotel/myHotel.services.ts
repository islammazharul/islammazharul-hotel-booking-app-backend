import AppError from '../../errors/AppError';
import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { HotelType } from '../Hotel/hotel.interface';
import Hotel from '../Hotel/hotel.model';

const createHotelIntoDb = async (files: any, payload: HotelType) => {
  // console.log(files, payload);
  try {
    const newHotel: Partial<HotelType> = payload;
    const imageUrls = await sendImageToCloudinary(files);
    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = payload.userId;
    const hotel = await Hotel.create([newHotel]);
    if (!hotel.length) {
      throw new AppError(401, 'Failed to create hotel');
    }
    // console.log('Hotelllll', hotel);
    return hotel;
  } catch (error: any) {
    throw new Error(error);
  }
};

const getMyHotelsFromDb = async (userId: string) => {
  try {
    const hotels = await Hotel.find({ userId });
    return hotels;
  } catch (error: any) {
    throw new Error(error);
  }
};

const getMySingleHotelFromDb = async (id: string, userId: string) => {
  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId,
    });
    return hotel;
  } catch (error: any) {
    throw new Error(error);
  }
};

const updateMySingleHotelIntoDb = async (
  files: any,
  updatedHotel: HotelType,
  userId: string,
  hotelId: string,
) => {
  try {
    updatedHotel.lastUpdated = new Date();
    const hotel = await Hotel.findByIdAndUpdate(
      {
        _id: hotelId,
        userId,
      },
      updatedHotel,
      { new: true },
    );
    if (!hotel) {
      throw new AppError(400, 'Hotel not found');
    }

    const updatedImageUrls = await sendImageToCloudinary(files);

    hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];
    const newUpdateHotel = await Hotel.create(hotel);
    return newUpdateHotel;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const MyHotelServices = {
  createHotelIntoDb,
  getMyHotelsFromDb,
  getMySingleHotelFromDb,
  updateMySingleHotelIntoDb,
};
