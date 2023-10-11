import { Message } from "node-nats-streaming";
import { Listener, NotFoundError, OrderStatus, PaymnetCreatedEvent, Subjects } from "@sgticking235/common";
import { queueGroupName } from "./queu-group-name";
import { Order } from "../../models/order";

export class PaymnetCreatedListener extends Listener<PaymnetCreatedEvent>{
    readonly subject = Subjects.PaymentCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: PaymnetCreatedEvent['data'], msg: Message): Promise<void> {

        const order = await Order.findById(data.orderId);
        if (!order)
            throw new NotFoundError();
        order.status = OrderStatus.Complate;
        await order.save();
        msg.ack();
    }
}