import mongoose from "mongoose";

interface PaymentAttrs {
    orderId: string,
    stripeId: string
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): PaymentDoc;
}

interface PaymentDoc extends mongoose.Document {
    orderId: string,
    stripeId: string
}

const PaymentScheme = new mongoose.Schema(
    {
        orderId: {
            type: String,
            require: true
        },
        stripeId: {
            type: String,
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

PaymentScheme.statics.build = (attrs: PaymentAttrs) => {
    return new Payment(attrs);
}

const Payment = mongoose.model<PaymentDoc, PaymentModel>('Payment', PaymentScheme);

export { Payment }