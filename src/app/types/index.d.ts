// src/types/express/index.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request } from 'express';

declare module 'express' {
  interface Request {
    userId?: string; // Add the userId property
  }
}
