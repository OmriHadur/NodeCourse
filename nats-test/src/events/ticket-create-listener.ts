import nats from 'node-nats-streaming';
import { Listener } from './base-listener';
import { TicketCreatedEvent } from './ticket-created-event';
import { Subjects } from './subjects';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
    queueGroupName = "payment-sercice";
    onMessage(data: TicketCreatedEvent['data'], msg: nats.Message): void {
        console.log(data);
        msg.ack();
    }
}