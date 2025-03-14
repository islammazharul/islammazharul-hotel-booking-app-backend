import { z } from 'zod';

export const registerValidationSchema = z.object({
  firstName: z
    .string({ invalid_type_error: 'First name must be string' })
    .min(1),
  lastName: z.string({ invalid_type_error: 'Last name must be string' }).min(1),
  email: z
    .string({
      invalid_type_error: 'Email must be string',
    })
    .email(),

  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password can not be more than 20 characters' }),
});

export type RegisterInput = z.infer<typeof registerValidationSchema>;

export const loginValidationSchema = z.object({
  email: z
    .string({
      invalid_type_error: 'Email must be string',
    })
    .email(),

  password: z
    .string({
      invalid_type_error: 'Password must be string',
    })
    .max(20, { message: 'Password can not be more than 20 characters' }),
});

export type LoginInput = z.infer<typeof loginValidationSchema>;
