import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HotelType } from './hotel.interface';
import { hotelServices } from './hotel.services';
// import httpStatus from 'http-status';

const createHotel = catchAsync(async (req, res) => {
  const imageFiles = req.files as Express.Multer.File[];
  const newHotel: HotelType = req.body;
  // console.log(imageFiles, newHotel);
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
    message: 'Hotel is retrieved successfully...',
    data: result,
  });
});

const getAllHotel = catchAsync(async (req, res) => {
  // const data = req.query;
  const result = await hotelServices.getAllHotelFromDb();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hotel is retrieved successfully',
    data: result,
  });
});

const getSingleHotel = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await hotelServices.getSingleHotelFromDb(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hotel is retrieved successfully',
    data: result,
  });
});

const getMyBookingHotel = catchAsync(async (req, res) => {
  const { userId } = req.params;
  const result = await hotelServices.getMyBookingHotelFromDb(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Hotel is retrieved successfully',
    data: result,
  });
});

const paymentIntent = catchAsync(async (req, res) => {
  const { numberOfNights, userId } = req.body;
  const hotelId = req.params.hotelId;
  const result = await hotelServices.paymentIntentIntoDb(
    numberOfNights,
    hotelId,
    userId,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Payment intent successfully',
    data: result,
  });
});

const bookingIntent = catchAsync(async (req, res) => {
  const { paymentIntentId, userId } = req.body;
  const hotelId = req.params.hotelId;
  const body = req.body;
  const result = await hotelServices.bookingIntentIntoDb(
    paymentIntentId,
    userId,
    hotelId,
    body,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Booking intent successfully',
    data: result,
  });
});
export const hotelController = {
  createHotel,
  searchHotel,
  getAllHotel,
  getSingleHotel,
  getMyBookingHotel,
  paymentIntent,
  bookingIntent,
};
