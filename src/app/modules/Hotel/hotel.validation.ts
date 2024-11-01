import { z } from 'zod';

const BookingTypeValidation = z.object({
  _id: z.string().uuid(),
  userId: z.string().uuid(),
  firstName: z.string().min(1, 'Name cannot be empty'),
  lastName: z.string().min(1, 'Name cannot be empty'),
  email: z.string().email().min(1, 'Name cannot be empty'),
  adultCount: z.number().nonnegative('Adult count cannot be negative').int(),
  childCount: z.number().nonnegative('Adult count cannot be negative').int(),
  checkIn: z.date(),
  checkOut: z.date(),
  totalCost: z.number().nonnegative('Price per night cannot be negative'),
});

const hotelValidationSchema = z.object({
  _id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1, 'Name cannot be empty'),
  city: z.string().min(1, 'City cannot be empty'),
  country: z.string().min(1, 'Country cannot be empty'),
  description: z.string().min(1, 'Description cannot be empty'),
  type: z.string().min(1, 'Type cannot be empty'),
  adultCount: z.number().nonnegative('Adult count cannot be negative').int(),
  childCount: z.number().nonnegative('Child count cannot be negative').int(),
  facilities: z.array(z.string()).min(1, 'At least one facility is required'),
  pricePerNight: z.number().nonnegative('Price per night cannot be negative'),
  starRating: z
    .number()
    .min(0, 'Star rating cannot be negative')
    .max(5, 'Star rating cannot exceed 5'),
  imageUrls: z
    .array(z.string().url())
    .min(1, 'At least one image URL is required'),
  lastUpdated: z.date(),
  bookings: z.array(BookingTypeValidation).optional(),
});

export const hotelValidation = {
  hotelValidationSchema,
};

// Example usage
// const exampleData = {
//   _id: "123e4567-e89b-12d3-a456-426614174000",
//   userId: "123e4567-e89b-12d3-a456-426614174001",
//   name: "Cozy Cabin",
//   city: "Aspen",
//   country: "USA",
//   description: "A cozy cabin in the mountains.",
//   type: "Cabin",
//   adultCount: 2,
//   childCount: 1,
//   facilities: ["Wi-Fi", "Hot tub"],
//   pricePerNight: 150,
//   starRating: 4,
//   imageUrls: ["http://example.com/image1.jpg", "http://example.com/image2.jpg"],
//   lastUpdated: new Date(),
//   bookings: [], // Example bookings data
// };

// // Validate example data
// try {
//   schema.parse(exampleData);
//   console.log("Validation succeeded!");
// } catch (e) {
//   console.error("Validation failed:", e.errors);
// }
