import Queue, { Job } from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complate-publisher";
import { natsWrapper } from "../nats-wrapper";


interface Payload {
    orderId: string;
}

const expirationQeueu = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
});

expirationQeueu.process(async (job: Job<Payload>) => {
    const orderId = job.data.orderId;
    console.log('job of ' + orderId);
    await new ExpirationCompletePublisher(natsWrapper.client).publish({
        orderId: orderId
    });
});

export { expirationQeueu };
