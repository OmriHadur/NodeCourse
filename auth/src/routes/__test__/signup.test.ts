import request from 'supertest'
import { app } from '../../app'


it('returns 201 on succfull signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
});

it('returns error on bad password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com"
        })
        .expect(400);
});

it('dup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(400);
});


it('cookie', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: "password"
        })
        .expect(201);
    expect(response.get('Set-Cookie')).toBeDefined();
});
