import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser';
const app: Application = express();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

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

export default app;
