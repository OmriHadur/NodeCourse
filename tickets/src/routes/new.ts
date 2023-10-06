import { requireAuth, validateRequest } from '@sgticking235/common';
import express, { Request, Response } from 'express'
import { body } from 'express-validator';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.post(
    '/api/tickets',
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
        const { title, price } = req.body;

        const ticket = Ticket.build({
            title,
            price,
            userId: req.currentUser!.id
        });
        await ticket.save();
        res.sendStatus(201);
    });

export { router as createTicket }