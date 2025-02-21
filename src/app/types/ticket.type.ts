import { Document } from 'mongoose';

export interface ITicket extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'open' | 'pending' | 'resolved';
  createdAt: Date;
}
