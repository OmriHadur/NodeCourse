import request from 'supertest'
import { app } from '../../app'

it('curent user', async () => {
    const cookie = await global.signin();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send({})
        .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com')
})

it('curent user is null', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send({})
        .expect(200);

    expect(response.body.currentUser).toBeNull()
})