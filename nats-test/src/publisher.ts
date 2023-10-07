import nats from 'node-nats-streaming'
console.clear();
const stan = nats.connect('ticketing', 'abc', { url: 'http://localhost:4222' });
stan.on('connect', () => {
    console.log('publisher connected');

    stan.on('close', () => {
        console.log('close');
        process.exit();
    });
    
    const data = JSON.stringify({
        id: 'asa',
        title: 'ava',
        price: 2
    });
    stan.publish('ticket:created', data, () => console.log('published'));
})


process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());