import request from "supertest";
import { app } from "../../app";

it('update a ticket 401',
    async () => {
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', global.signin())
            .send({
                title: "aa",
                price: 4
            })
            .expect(201);

        await request(app)
            .put('/api/tickets/' + response.body.id)
            .set('Cookie', global.signin())
            .send({
                title: "aa",
                price: 4
            })
            .expect(401);
    });

it('update a ticket',
    async () => {
        const cookie = global.signin();
        const response = await request(app)
            .post('/api/tickets')
            .set('Cookie', cookie)
            .send({
                title: "aa",
                price: 4
            })
            .expect(201);

        const updateResponse = await request(app)
            .put('/api/tickets/' + response.body.id)
            .set('Cookie', cookie)
            .send({
                title: "bb",
                price: 5
            })
            .expect(200);

        expect(updateResponse.body.title).toEqual("bb");
        expect(updateResponse.body.price).toEqual(5);
    });