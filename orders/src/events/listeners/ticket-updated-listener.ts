import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { Listener, Subjects, TicketUpdatedEvent } from "@sgticking235/common";
import { queueGroupName } from "./queu-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
        const ticket = await Ticket.findByEvent(data);
        if (!ticket)
            throw new Error('no ticket');
        ticket.title = data.title;
        ticket.price = data.price;
        await ticket.save();
        msg.ack();
    }
}