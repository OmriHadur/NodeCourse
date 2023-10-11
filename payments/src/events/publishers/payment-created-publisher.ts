
import { PaymnetCreatedEvent, Publisher, Subjects } from '@sgticking235/common'

export class PaymentCreatedPublisher extends Publisher<PaymnetCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;

}