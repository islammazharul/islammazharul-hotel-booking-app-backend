import mongoose, { Schema } from 'mongoose';
import { ITicket } from '../types/ticket.type';

const TicketSchema = new Schema<ITicket>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['open', 'pending', 'resolved'],
      default: 'open',
    },
  },
  { timestamps: true },
);

const Ticket = mongoose.model<ITicket>('Ticket', TicketSchema);
export default Ticket;
