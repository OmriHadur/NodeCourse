import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { Order, OrderStatus } from "./order";

interface TicketAttrs {
    id: string;
    title: string;
    price: number;
    version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
    findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>
}

const TicketScheme = new mongoose.Schema(
    {
        title: {
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
                delete ret.__v;
            }
        }
    }
);

TicketScheme.set('versionKey', 'version');
TicketScheme.plugin(updateIfCurrentPlugin);

TicketScheme.statics.build = (attrs: TicketAttrs) => {
    return new Ticket({
        _id: attrs.id,
        title: attrs.title,
        price: attrs.price
    });
}

TicketScheme.statics.findByEvent = (event: { id: string, version: number }) => {
    return Ticket.findOne({
        _id: event.id,
        version: event.version - 1
    });
};

TicketScheme.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complate]
        }
    });
    return !!existingOrder;
};
const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketScheme);

export { Ticket, TicketDoc }