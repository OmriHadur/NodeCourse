import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";
import { Listener, Subjects, TicketCreatedEvent } from "@sgticking235/common";
import { queueGroupName } from "./queu-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const ticket = Ticket.build({
            id: data.id,
            version: data.version,
            title: data.title,
            price: data.price
        });
        await ticket.save();
        msg.ack();
    }
}