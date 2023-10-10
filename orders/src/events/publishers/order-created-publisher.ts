
import { Publisher, Subjects, OrderCreatedEvent } from '@sgticking235/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;

}