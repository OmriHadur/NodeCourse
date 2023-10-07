import nats, { Message } from 'node-nats-streaming'
import { randomBytes } from 'crypto';

console.clear();
const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), { url: 'http://localhost:4222' });
stan.on('connect', () => {
    console.log('listener connected');

    stan.on('close', () => {
        console.log('close');
        process.exit();
    });
    const options = stan
        .subscriptionOptions()
        .setManualAckMode(true)
        .setDeliverAllAvailable()
        .setDurableName('sub');

    const subcription = stan.subscribe('ticket:created', 'listerQG', options);
    subcription.on('message', (msg: Message) => {
        const data = msg.getData();
        if (typeof data == 'string') {
            console.log(`got ${msg.getSequence()} with data ${data}`);
        }
        msg.ack();
    });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());