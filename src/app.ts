import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import { v2 as cloudinary } from 'cloudinary';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notFound';
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// application routes
app.use('/api', router);

app.get('/', async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Hotel booking app is running',
  });
});

app.use(globalErrorHandler as any);

//Not Found
app.use(notFound as any);

export default app;
