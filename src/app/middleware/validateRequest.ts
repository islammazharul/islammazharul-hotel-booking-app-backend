import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Parse form-data fields
      const parsedBody = { ...req.body };

      // If req.body contains JSON strings, parse them
      Object.keys(parsedBody).forEach((key) => {
        try {
          parsedBody[key] = JSON.parse(parsedBody[key]);
        } catch (error) {
          res.status(400).json({ message: 'Validation failed', errors: error });
        }
      });

      // Validate the parsed body against the schema
      const validatedData = await schema.parseAsync(parsedBody);

      // Attach validated data to req for further use
      req.body = validatedData;

      next();
    } catch (error) {
      res.status(400).json({ message: 'Validation failed', errors: error });
    }
  };
};

export default validateRequest;
