import { Listener, OrderCreatedEvent, Subjects } from "@sgticking235/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queu-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const order = Order.build({
            id: data.id,
            userId: data.userId,
            price: data.ticket.price,
            status: data.status,
            version: data.version,
        })
        await order.save();
        msg.ack();
    }

}