import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
}

interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
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
        },
        userId: {
            type: String,
            require: true
        },
        orderId: {
            type: String
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

TicketScheme.set('versionKey', 'version');
TicketScheme.plugin(updateIfCurrentPlugin);

TicketScheme.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketScheme);

export { Ticket }