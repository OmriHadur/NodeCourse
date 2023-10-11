
import { Publisher, Subjects, ExpirationCompleteEvent } from '@sgticking235/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}