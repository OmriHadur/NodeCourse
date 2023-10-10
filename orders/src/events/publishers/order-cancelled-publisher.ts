
import { Publisher, Subjects, OrderCancelledEvent } from '@sgticking235/common'

export class OrderCancelledublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;

}