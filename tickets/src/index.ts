import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";
import { OrderCreatedListener } from "./events/listeners/order-created-listener";

if (!process.env.JWT_KEY)
    throw new Error('JWT_KEY missing');

if (!process.env.MONGO_URL)
    throw new Error('MONGO_URL missing');

if (!process.env.NATS_CLIENT_ID)
    throw new Error('NATS_CLIENT_ID missing');

if (!process.env.NATS_URL)
    throw new Error('NATS_URL missing');

if (!process.env.NATS_CLUSTER_ID)
    throw new Error('NATS_CLUSTER_ID missing');

const start = async () => {
    await natsWrapper.connect(
        process.env.NATS_CLUSTER_ID!,
        process.env.NATS_CLIENT_ID!,
        process.env.NATS_URL!
    );
    natsWrapper.client.on('close', () => {
        console.log('close');
        process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new OrderCancelledListener(natsWrapper.client).listen();
    new OrderCreatedListener(natsWrapper.client).listen();

    try {
        await mongoose.connect(process.env.MONGO_URL!);
    } catch (error) {
        console.log(error);
    }

    app.listen(3000, () => {
        console.log("listining on port 3000...");
    });
}

start();