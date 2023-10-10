import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it('show 404',
    async () => {
        const id = new mongoose.Types.ObjectId().toHexString();
        await request(app)
            .get(`/api/tickets/${id}`)
            .send()
            .expect(404);
    });

it('show',
    async () => {
        const title = "title";
        const price = 10;

        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title: title,
                price: price
            })
            .expect(201);
        const ticketId = response.body.id;
        var getResponse = await request(app)
            .get('/api/tickets/' + ticketId)
            .send()
            .expect(200);

        expect(getResponse.body.title).toEqual(title);
        expect(getResponse.body.price).toEqual(price);
    });