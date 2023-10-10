import { Listener, NotFoundError, OrderCreatedEvent, OrderStatus, Subjects } from "@sgticking235/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queu-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdateublisher } from "../publishers/ticket-updated-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket)
            throw new NotFoundError();
        ticket.orderId = data.id;
        await ticket.save();
        new TicketUpdateublisher(natsWrapper.client).publish({
            id: ticket.id,
            version: ticket.version,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        })
        msg.ack();
    }

}