import { Message, Stan } from "node-nats-streaming";
import { Event } from "./event";

export abstract class Listener<T extends Event> {

    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;

    private client: Stan;
    protected actWait = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subscriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setManualAckMode(true)
            .setAckWait(this.actWait)
            .setDeliverAllAvailable()
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subcription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());
        subcription.on('message', (msg: Message) => {
            console.log(`Message recive ${this.subject} / ${this.queueGroupName}`);
            const data = this.parseMessage(msg);
            this.onMessage(data, msg);
        });
    }


    parseMessage(msg: Message) {
        const data = msg.getData();
        return (typeof data == 'string')
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }
}