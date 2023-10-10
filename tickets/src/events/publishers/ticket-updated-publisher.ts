
import { Publisher, Subjects, TicketUpdatedEvent } from '@sgticking235/common'

export class TicketUpdateublisher extends Publisher<TicketUpdatedEvent>{
    readonly subject = Subjects.TicketUpdated;
}