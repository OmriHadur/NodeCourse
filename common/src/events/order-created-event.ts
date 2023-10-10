import { Subjects } from "./subjects";
import { OrderStatus } from "./types/order-status";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated,
    data: {
        id: string,
        version: number,
        status: OrderStatus,
        expiredAt: string
        ticket: {
            id: string,
            price: number
        },
        userId: string
    };
}