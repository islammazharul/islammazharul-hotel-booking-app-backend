import { sendImageToCloudinary } from '../../utils/sendImageToCloudinary';
import { HotelSearchResponse, HotelType } from './hotel.interface';
import Hotel from './hotel.model';
import { searchQueryBuilder } from './hotel.utils';

const createHotelIntoDb = async (files: any, payload: HotelType) => {
  const newHotel: Partial<HotelType> = {};
  const imageUrls = await sendImageToCloudinary(files);
  newHotel.imageUrls = imageUrls;
  newHotel.lastUpdated = new Date();
  newHotel.userId = payload.userId;
  try {
    const hotel = new Hotel(newHotel);
    await hotel.save();
  } catch (error: any) {
    console.log(error.message);
  }
};

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
  } catch (error) {
    console.log('error', error);
  }
};
export const hotelServices = {
  createHotelIntoDb,
  searchHotelFromDb,
};
