import nats from 'node-nats-streaming'
import { TicketCreatedPublisher } from './events/ticket-created-publisher';

console.clear();
const stan = nats.connect('ticketing', 'abc', { url: 'http://localhost:4222' });
stan.on('connect', async () => {
    console.log('publisher connected');

    const data = {
        id: 'asa',
        title: 'ava',
        price: 2
    };
    await new TicketCreatedPublisher(stan).publish(data);
});