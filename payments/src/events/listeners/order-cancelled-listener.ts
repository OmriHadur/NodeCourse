import { Listener, NotFoundError, OrderCancelledEvent, OrderStatus, Subjects } from "@sgticking235/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queu-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        });
        if (!order)
            throw new NotFoundError();
        order.status = OrderStatus.Cancelled;
        await order.save();
        msg.ack();
    }
}