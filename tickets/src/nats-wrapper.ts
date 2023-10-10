
import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
    private _client?: Stan;

    get client() {
        if (!this._client)
            throw new Error('not connected');
        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusterId, clientId, { url });

        this.client.on('close', () => {
            console.log('close');
            process.exit();
        });
        process.on('SIGINT', () => this.client.close());
        process.on('SIGTERM', () => this.client.close());

        return new Promise((resolve, reject) => {
            this.client.on('connect', () => {
                console.log('connected to nats');
                resolve();
            });
            this.client.on('error', (err) => reject(err));
        });
    }
}

export const natsWrapper = new NatsWrapper();