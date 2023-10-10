import mongoose from "mongoose";
import { OrderStatus } from '@sgticking235/common'
import { TicketDoc } from "./ticket";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    expriresAt: Date;
    ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
    userId: string;
    status: OrderStatus;
    expriresAt: Date;
    ticket: TicketDoc;
    version: number;
}

const OrderScheme = new mongoose.Schema(
    {
        userId: {
            type: String,
            require: true
        },
        status: {
            type: String,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created
        },
        expriresAt: {
            type: mongoose.Schema.Types.Date,
            require: true
        },
        ticket: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

OrderScheme.set('versionKey', 'version');
OrderScheme.plugin(updateIfCurrentPlugin);

OrderScheme.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderScheme);

export { Order, OrderStatus }