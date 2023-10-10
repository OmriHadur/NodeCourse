
import { Publisher, Subjects, TicketCreatedEvent } from '@sgticking235/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    readonly subject = Subjects.TicketCreated;

}