import { Listener, NotFoundError, OrderCancelledEvent, OrderCreatedEvent, OrderStatus, Subjects } from "@sgticking235/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queu-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdateublisher } from "../publishers/ticket-updated-publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket)
            throw new NotFoundError();
        ticket.orderId = undefined;
        await ticket.save();
        await new TicketUpdateublisher(this.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId,
            orderId: ticket.orderId
        })
        msg.ack();
    }

}