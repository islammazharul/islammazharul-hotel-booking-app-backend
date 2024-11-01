import Stripe from 'stripe';
import AppError from '../../errors/AppError';
import { BookingType, HotelSearchResponse, HotelType } from './hotel.interface';
import Hotel from './hotel.model';
import { searchQueryBuilder } from './hotel.utils';
const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

const searchHotelFromDb = async (payload: any) => {
  try {
    const query = searchQueryBuilder(payload);

    let sortOptions = {};
    switch (query.sortOption) {
      case 'starRating':
        sortOptions = { starRating: -1 };
        break;
      case 'pricePerNightAsc':
        sortOptions = { pricePerNight: 1 };
        break;
      case 'pricePerNightDesc':
        sortOptions = { pricePerNight: -1 };
        break;
    }

    const pageSize = 5;
    const pageNumber = parseInt(query.page ? query.page.toString() : '1');
    const skip = (pageNumber - 1) * pageSize;

    const hotels = await Hotel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize);

    const total = await Hotel.countDocuments(query);

    const response: HotelSearchResponse = {
      data: hotels,
      pagination: {
        total,
        page: pageNumber,
        pages: Math.ceil(total / pageSize),
      },
    };

    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

const getAllHotelFromDb = async () => {
  try {
    const hotels = await Hotel.find().sort('-lastUpdated');
    return hotels;
  } catch (error: any) {
    throw new Error(error);
  }
};

const getSingleHotelFromDb = async (id: string) => {
  try {
    const result = await Hotel.findById(id);
    return result;
  } catch (error: any) {
    throw new Error(error);
  }
};

const getMyBookingHotelFromDb = async (userId: string) => {
  try {
    const hotels = await Hotel.find({
      bookings: { $elemMatch: { userId } },
    });

    const results = hotels.map((hotel: any) => {
      const userBookings = hotel.bookings.filter(
        (booking: any) => booking.userId === userId,
      );

      const hotelWithUserBookings: HotelType = {
        ...hotel.toObject(),
        bookings: userBookings,
      };

      return hotelWithUserBookings;
    });
    return results;
  } catch (error: any) {
    throw new Error(error);
  }
};

const paymentIntentIntoDb = async (
  numberOfNights: number,
  hotelId: string,
  userId: string,
) => {
  const hotel = await Hotel.findById(hotelId);
  if (!hotel || null) {
    throw new AppError(404, 'Hotel not found');
  }

  const totalCost = hotel.pricePerNight * numberOfNights;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalCost * 100,
    currency: 'usd',
    metadata: {
      hotelId,
      userId,
    },
  });
  if (!paymentIntent.client_secret) {
    throw new AppError(500, 'Error creating payment intent');
  }
  const response = {
    paymentIntentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret.toString(),
    totalCost,
  };
  return response;
};

const bookingIntentIntoDb = async (
  // paymentIntentId: string,
  userId: string,
  hotelId: string,
  body: any,
) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      body.paymentIntentId as string,
    );
    if (!paymentIntent) {
      throw new AppError(400, 'payment intent not found');
    }
    if (
      paymentIntent.metadata.hotelId !== hotelId ||
      paymentIntent.metadata.userId !== userId
    ) {
      throw new AppError(400, 'payment intent mismatch');
    }
    if (paymentIntent.status !== 'succeeded') {
      throw new AppError(
        400,
        `payment intent not succeeded. Status: ${paymentIntent.status}`,
      );
    }
    const newBooking: BookingType = {
      ...body,
      userId,
    };

    const bookingUpdate = await Hotel.findOneAndUpdate(
      { _id: hotelId },
      {
        $push: { bookings: newBooking },
      },
    );

    if (!bookingUpdate) {
      throw new AppError(400, 'hotel not found');
    }

    const hotel = await Hotel.create(bookingUpdate);

    // console.log('Hotelllll', hotel);
    return hotel;
  } catch (error: any) {
    throw new Error(error);
  }
};
export const hotelServices = {
  searchHotelFromDb,
  getAllHotelFromDb,
  getSingleHotelFromDb,
  getMyBookingHotelFromDb,
  paymentIntentIntoDb,
  bookingIntentIntoDb,
};
