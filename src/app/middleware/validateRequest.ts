import { z, ZodError } from 'zod';

export const validateRequest = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): T => {
  try {
    // Validate the data against the schema
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      // Throw a custom error with validation details
      throw new Error(
        `Validation failed: ${error.errors.map((e) => e.message).join(', ')}`,
      );
    }
    throw error; // Re-throw other errors
  }
};
