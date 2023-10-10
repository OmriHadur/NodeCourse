import { BadReqeustError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sgticking235/common';
import express, { Request, Response } from 'express'
import { Order } from '../models/order';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { Ticket } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/orders',
    requireAuth,
    [
        body('ticketId')
            .notEmpty()
            .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
            .withMessage('ticker id')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const ticketId = req.body.ticketId;
        const ticket = await Ticket.findById(ticketId);

        if (!ticket)
            throw new NotFoundError();
        if (await ticket.isReserved())
            throw new BadReqeustError('existingOrder');

        const expration = new Date();
        expration.setSeconds(expration.getSeconds() + 15 * 60);

        const order = Order.build({
            status: OrderStatus.Created,
            ticket: ticket,
            userId: req.currentUser!.id,
            expriresAt: expration
        });

        await order.save();

        new OrderCreatedPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            status: order.status,
            expiredAt: order.expriresAt.toISOString(),
            userId: order.userId,
            ticket: {
                id: order.ticket.id,
                price: order.ticket.price
            },
        });
        res.status(201).send(order);
    });

export { router as createOrder }