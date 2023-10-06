import mongoose from "mongoose";

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
    price: string;
    userId: string;
}

const TicketScheme = new mongoose.Schema(
    {
        title: {
            type: String,
            require: true
        },
        price: {
            type: String,
            require: true
        },
        userId: {
            type: String,
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

TicketScheme.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', TicketScheme);

export { Ticket }