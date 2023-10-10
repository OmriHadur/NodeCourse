import express, { Request, Response } from 'express'
import { Ticket } from '../models/ticket';
import { NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@sgticking235/common';
import { body } from 'express-validator';
import { TicketUpdateublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.put(
    '/api/tickets/:id',
    requireAuth,
    [
        body('title')
            .notEmpty()
            .withMessage('Title is req'),
        body('price')
            .isFloat({ gt: 0 })
            .withMessage('price greate then 0')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const ticket = await Ticket.findById(id);
        if (!ticket)
            throw new NotFoundError();
        if (ticket.userId !== req.currentUser!.id)
            throw new NotAuthorizedError();
        const { title, price } = req.body;
        ticket.title = title;
        ticket.price = price;
        await ticket.save();

        await new TicketUpdateublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        });

        res.send(ticket);
    });

export { router as updateTicketRouter }