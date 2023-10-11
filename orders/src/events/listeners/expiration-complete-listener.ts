import { Message } from "node-nats-streaming";
import { ExpirationCompleteEvent, Listener, NotFoundError, OrderStatus, Subjects } from "@sgticking235/common";
import { queueGroupName } from "./queu-group-name";
import { Order } from "../../models/order";
import { OrderCancelledublisher } from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
    queueGroupName: string = queueGroupName;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {

        const order = await Order.findById(data.orderId);
        if (!order)
            throw new NotFoundError();
        if (order.status != OrderStatus.Complate) {
            order.status = OrderStatus.Cancelled;
            await order.save();

            await new OrderCancelledublisher(natsWrapper.client).publish({
                id: order.id,
                version: order.version,
                ticket: { id: order.ticket.id }
            });
        }
        msg.ack();
    }
}