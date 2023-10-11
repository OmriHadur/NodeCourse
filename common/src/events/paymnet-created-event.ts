import { Subjects } from "./subjects";

export interface PaymnetCreatedEvent {
    subject: Subjects.PaymentCreated,
    data: {
        id: string;
        orderId: string;
        stripeId: string;
    };
}