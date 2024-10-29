import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HotelType } from './hotel.interface';
import { hotelServices } from './hotel.services';
// import httpStatus from 'http-status';

const createHotel = catchAsync(async (req, res) => {
  const imageFiles = req.files as Express.Multer.File[];
  const newHotel: HotelType = req.body;
  const result = await hotelServices.createHotelIntoDb(imageFiles, newHotel);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hotel is created successfully',
    data: result,
  });
});

const searchHotel = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await hotelServices.searchHotelFromDb(query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hotel is retrieved successfully',
    data: result,
  });
});
export const hotelController = {
  createHotel,
  searchHotel,
};
