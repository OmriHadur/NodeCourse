import express, { Request, Response } from 'express'
import { NotAuthorizedError, NotFoundError } from '@sgticking235/common';
import { Order } from '../models/order';

const router = express.Router();

router.get(
    '/api/orders/:id',
    async (req: Request, res: Response) => {
        const id = req.params.id;
        const order = await Order.findById(id).populate('ticket');
        if (!order)
            throw new NotFoundError();
        if (order.userId !== req.currentUser!.id)
            throw new NotAuthorizedError();
        res.send(order);
    });

export { router as showOrderRouter }