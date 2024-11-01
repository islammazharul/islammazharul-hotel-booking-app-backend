import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HotelType } from '../Hotel/hotel.interface';
import { MyHotelServices } from './myHotel.services';

const createHotel = catchAsync(async (req, res) => {
  const imageFiles = req.files as Express.Multer.File[];
  const newHotel: HotelType = req.body;
  // console.log(imageFiles, newHotel);
  const result = await MyHotelServices.createHotelIntoDb(imageFiles, newHotel);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hotel is created successfully',
    data: result,
  });
});

const getMyHotels = catchAsync(async (req, res) => {
  const { userId } = req.userId;
  console.log(userId);
  const result = await MyHotelServices.getMyHotelsFromDb(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hotel is retrieved successfully',
    data: result,
  });
});

const getMySingleHotel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.userId;
  const result = await MyHotelServices.getMySingleHotelFromDb(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hotel is retrieved successfully',
    data: result,
  });
});

const updateMySingleHotel = catchAsync(async (req, res) => {
  const imageFiles = req.files as Express.Multer.File[];
  const updatedHotel: HotelType = req.body;
  const { userId } = req.userId;
  const { hotelId } = req.params;

  const result = await MyHotelServices.updateMySingleHotelIntoDb(
    imageFiles,
    updatedHotel,
    userId,
    hotelId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hotel updated successfully',
    data: result,
  });
});

export const MyHotelControllers = {
  createHotel,
  getMyHotels,
  getMySingleHotel,
  updateMySingleHotel,
};
