import mongoose from "mongoose";
import { OrderStatus } from '@sgticking235/common'
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
    id: string;
    version: number;
    price: number;
    userId: string;
    status: OrderStatus;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
    version: number;
    price: number;
    userId: string;
    status: OrderStatus;
}

const OrderScheme = new mongoose.Schema(
    {
        userId: {
            type: String,
            require: true
        },
        status: {
            type: String,
            require: true
        },
        price: {
            type: Number,
            require: true
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            }
        }
    }
);

OrderScheme.set('versionKey', 'version');
OrderScheme.plugin(updateIfCurrentPlugin);

OrderScheme.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        _id : attrs.id,
        price : attrs.price,
        userId : attrs.userId,
        status : attrs.status
    });
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderScheme);

export { Order }