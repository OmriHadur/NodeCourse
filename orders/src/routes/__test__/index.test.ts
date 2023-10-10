import request from "supertest";
import { Ticket } from "../../models/ticket";
import { app } from "../../app";
import mongoose from "mongoose";

const buildTicket = async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 1,
        price: 1,
        title: 'title'
    });
    await ticket.save();
    return ticket;
}

const createOrder = async (user: string[], ticketId: string) => {
    const order = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({ ticketId: ticketId })
        .expect(201);
    return order.body;
}

it('order all', async () => {
    const ticket1 = await buildTicket();
    const ticket2 = await buildTicket();
    const ticket3 = await buildTicket();
    console.log(ticket1.id);
    const userOne = global.signin();
    const userTwo = global.signin();

    const order1 = await createOrder(userOne, ticket1.id);
    const order2 = await createOrder(userOne, ticket2.id);
    await createOrder(userTwo, ticket3.id);

    const ordersResponse = await request(app)
        .get('/api/orders')
        .set('Cookie', userOne)
        .send({})
        .expect(200);
    const orders = ordersResponse.body;

    expect(orders[0]).toEqual(order1);
    expect(orders[1]).toEqual(order2);
    expect(orders.length).toBe(2);
});