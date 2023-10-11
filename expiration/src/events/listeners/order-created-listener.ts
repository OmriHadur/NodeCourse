import { Listener, OrderCreatedEvent, Subjects } from "@sgticking235/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queu-group-name";
import { expirationQeueu } from "../../queue/expiration-qeueu";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const delay = new Date(data.expiredAt).getTime() - new Date().getTime();
        console.log("delay: " + delay);
        
        await expirationQeueu.add({
            orderId: data.id
        }, {
            delay: delay
        });
        msg.ack();
    }
}