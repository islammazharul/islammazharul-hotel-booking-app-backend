import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';
import catchAsync from '../utils/catchAsync';

// const validateRequest = (schema: AnyZodObject) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     console.log('req', req.body);
//     const schemaa = await schema.parseAsync(
//       req.body,
//       // cookies: req.cookies,
//     );
//     console.log('schemaa', schemaa);

//     next();
//   });
// };

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log('Raw req.body:', req.body);
      // console.log('Files:', req.files);

      // Parse form-data fields
      const parsedBody = { ...req.body };

      // If req.body contains JSON strings, parse them
      Object.keys(parsedBody).forEach((key) => {
        try {
          parsedBody[key] = JSON.parse(parsedBody[key]);
        } catch {
          // Leave as is if not JSON
        }
      });

      // console.log('Parsed req.body:', parsedBody);

      // Validate the parsed body against the schema
      const validatedData = await schema.parseAsync(parsedBody);
      // console.log('Validated data:', validatedData);

      // Attach validated data to req for further use
      req.body = validatedData;

      next();
    } catch (error) {
      res.status(400).json({ message: 'Validation failed', errors: error });
    }
  };
};

export default validateRequest;
