import { BadReqeustError, NotAuthorizedError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@sgticking235/common';
import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import { Order } from '../models/order';
import { stripe } from '../stripe';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
    '/api/payments',
    requireAuth,
    [
        body('token').notEmpty(),
        body('orderId').notEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const order = await Order.findById(req.body.orderId);
        if (!order)
            throw new NotFoundError();
        if (order.userId !== req.currentUser!.id)
            throw new NotAuthorizedError();
        if (order.status === OrderStatus.Cancelled)
            throw new BadReqeustError('cancled');

        const charge = await stripe.charges.create({
            currency: 'usd',
            amount: order.price * 100,
            source: req.body.token
        });

        const payment = Payment.build({
            orderId: order.id,
            stripeId: charge.id
        })
        await payment.save();

        await new PaymentCreatedPublisher(natsWrapper.client).publish({
            id: payment.id,
            orderId: payment.orderId,
            stripeId: payment.stripeId
        })

        res.status(201)
            .send(payment);
    });

export { router as createPaymentsRouter }