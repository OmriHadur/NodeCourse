import express, { Request, Response } from 'express'
import { NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sgticking235/common';
import { Order } from '../models/order';
import { OrderCancelledublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
    '/api/oders/:id',
    requireAuth,
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const order = await Order.findById(id).populate('ticket');
        if (!order)
            throw new NotFoundError();
        if (order.userId !== req.currentUser!.id)
            throw new NotAuthorizedError();
        if (order.status == OrderStatus.Complate)
            throw new NotAuthorizedError();
        order.status = OrderStatus.Cancelled;
        await order.save();
        new OrderCancelledublisher(natsWrapper.client).publish({
            id: id,
            version: order.version,
            ticket: { id: order.ticket.id }
        });
        res.status(204).send(order);
    });

export { router as deleteOrderRouter }