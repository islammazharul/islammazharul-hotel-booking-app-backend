/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import Hotel from '../models/hotel.model';
import {
  BookingType,
  HotelSearchResponse,
  ReviewType,
} from '../types/hotel.type';
import { authMiddleware } from '../middleware/authMiddleware';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const router = express.Router();

router.get('/search', async (req: Request, res: Response): Promise<any> => {
  try {
    const query = constructSearchQuery(req.query);

    let sortOptions = {};
    switch (req.query.sortOption) {
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
    const pageNumber = parseInt(
      req.query.page ? req.query.page.toString() : '1',
    );
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

    res.json(response);
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : 'Something went wrong';
    return res.status(500).json({ message: errMsg });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const hotels = await Hotel.find().sort('-lastUpdated');
    res.json(hotels);
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : 'Error fetching hotel';
    res.status(500).json({ message: errMsg });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findById(id);
    res.json(hotel);
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : 'Error fetching hotel';
    res.status(500).json({ message: errMsg });
  }
});

router.post(
  '/:hotelId/bookings/payment-intent',
  authMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(400).json({ message: 'Hotel not found' });
    }

    const totalCost = hotel.pricePerNight * numberOfNights;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: 'usd',
      metadata: {
        hotelId,
        userId: req.userId as string,
      },
    });

    if (!paymentIntent.client_secret) {
      return res.status(500).json({ message: 'Error creating payment intent' });
    }

    const response = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };

    res.send(response);
  },
);

router.post(
  '/:hotelId/bookings',
  authMiddleware,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const paymentIntentId = req.body.paymentIntentId;

      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId as string,
      );

      if (!paymentIntent) {
        return res.status(400).json({ message: 'payment intent not found' });
      }

      if (
        paymentIntent.metadata.hotelId !== req.params.hotelId ||
        paymentIntent.metadata.userId !== req.userId
      ) {
        return res.status(400).json({ message: 'payment intent mismatch' });
      }

      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({
          message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
        });
      }

      const newBooking: BookingType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findOneAndUpdate(
        { _id: req.params.hotelId },
        {
          $push: { bookings: newBooking },
        },
      );

      if (!hotel) {
        return res.status(400).json({ message: 'hotel not found' });
      }

      await hotel.save();
      res.status(200).send();
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong';
      return res.status(500).json({ message: errMsg });
    }
  },
);

router.post(
  '/:hotelId/reviews',
  async (req: Request, res: Response): Promise<any> => {
    try {
      const newReview: ReviewType = {
        ...req.body,
        userId: req.userId,
      };

      const hotel = await Hotel.findById(
        { _id: req.params.hotelId },
        {
          $push: { reviews: newReview },
        },
      );

      if (!hotel) {
        return res.status(400).json({ message: 'hotel not found' });
      }

      await hotel.save();
      return res.status(200).send();
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong';
      return res.status(500).json({ message: errMsg });
    }
  },
);

const constructSearchQuery = (queryParams: any) => {
  const constructedQuery: Record<string, unknown> = {};

  if (queryParams.destination) {
    constructedQuery.$or = [
      { city: new RegExp(queryParams.destination, 'i') },
      { country: new RegExp(queryParams.destination, 'i') },
    ];
  }

  if (queryParams.adultCount) {
    constructedQuery.adultCount = {
      $gte: parseInt(queryParams.adultCount),
    };
  }

  if (queryParams.childCount) {
    constructedQuery.childCount = {
      $gte: parseInt(queryParams.childCount),
    };
  }

  if (queryParams.facilities) {
    constructedQuery.facilities = {
      $all: Array.isArray(queryParams.facilities)
        ? queryParams.facilities
        : [queryParams.facilities],
    };
  }

  if (queryParams.types) {
    constructedQuery.type = {
      $in: Array.isArray(queryParams.types)
        ? queryParams.types
        : [queryParams.types],
    };
  }

  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => parseInt(star))
      : parseInt(queryParams.stars);

    constructedQuery.starRating = { $in: starRatings };
  }

  if (queryParams.maxPrice) {
    constructedQuery.pricePerNight = {
      $lte: parseInt(queryParams.maxPrice).toString(),
    };
  }

  return constructedQuery;
};

export const HotelRoutes = router;
