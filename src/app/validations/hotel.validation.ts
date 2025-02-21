import { z } from 'zod';

const BookingTypeValidation = z.object({
  _id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  firstName: z.string().min(1, 'Name cannot be empty').optional(),
  lastName: z.string().min(1, 'Name cannot be empty').optional(),
  email: z.string().email().min(1, 'Name cannot be empty').optional(),
  adultCount: z
    .number()
    .nonnegative('Adult count cannot be negative')
    .int()
    .optional(),
  childCount: z
    .number()
    .nonnegative('Adult count cannot be negative')
    .int()
    .optional(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
  totalCost: z
    .number()
    .nonnegative('Price per night cannot be negative')
    .optional(),
});

const ReviewTypeValidation = z.object({
  _id: z.string().optional(),
  userId: z.string().optional(),
  rating: z.number().min(1).optional(),
  message: z.string().optional(),
});

export const hotelValidationSchema = z.object({
  _id: z.string().uuid().optional(),
  userId: z.string().uuid().optional(),
  name: z.string().min(1, 'Name cannot be empty').optional(),
  city: z.string().min(1, 'City cannot be empty').optional(),
  country: z.string().min(1, 'Country cannot be empty').optional(),
  description: z.string().min(1, 'Description cannot be empty').optional(),
  type: z.string().min(1, 'Type cannot be empty').optional(),
  adultCount: z
    .number()
    .nonnegative('Adult count cannot be negative')
    .int()
    .optional(),
  childCount: z
    .number()
    .nonnegative('Child count cannot be negative')
    .int()
    .optional(),
  facilities: z
    .array(z.string())
    .min(1, 'At least one facility is required')
    .optional(),
  pricePerNight: z
    .number()
    .nonnegative('Price per night cannot be negative')
    .optional(),
  reviews: z.array(ReviewTypeValidation).optional(),
  imageUrls: z
    .array(z.string().url())
    .min(1, 'At least one image URL is required')
    .optional(),
  lastUpdated: z.date().optional(),
  bookings: z.array(BookingTypeValidation).optional(),
});

export const hotelValidation = {
  hotelValidationSchema,
};
