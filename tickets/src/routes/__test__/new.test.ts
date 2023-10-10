import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it('create a ticket',
    async () => {
        await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title: "aa",
                price: 4
            })
            .expect(201);
        const tickets = await Ticket.find({});
        expect(tickets.length).toBe(1);
        expect(natsWrapper.client.publish).toBeCalled();
    });