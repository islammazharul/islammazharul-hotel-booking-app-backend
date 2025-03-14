/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import Ticket from '../models/ticket.model';

const router = express.Router();

router.post(
  '/create',
  async (req: Request, res: Response): Promise<any | undefined> => {
    try {
      const { name, email, phone, message } = req.body;

      if (!name || !email || !phone || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newTicket = new Ticket({ name, email, phone, message });

      await newTicket.save();

      res.status(201).json({ message: 'Support ticket created successfully' });
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong';
      return res.status(500).json({ message: errMsg });
    }
  },
);

router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    const errMsg =
      error instanceof Error ? error.message : 'Something went wrong';
    return res.status(500).json({ message: errMsg });
  }
});

router.patch(
  '/update/:id',
  async (req: Request, res: Response): Promise<any | undefined> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const ticket = await Ticket.findByIdAndUpdate(
        { id },
        { status },
        { new: true },
      );
      res.json({ message: 'Ticket updated successfully', ticket });
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'Something went wrong';
      return res.status(500).json({ message: errMsg });
    }
  },
);

export const TicketRoutes = router;
