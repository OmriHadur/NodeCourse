
import mongoose from "mongoose";
import request from 'supertest'
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from 'jsonwebtoken'
import { app } from "../app";

declare global {
    var signin: () => string[];
}

let mongo: any;
beforeAll(async () => {
    process.env.JWT_KEY = 'asdf';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();
    await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections)
        await collection.deleteMany({});

})

afterAll(async () => {
    if (mongo)
        await mongo.stop();
    await mongoose.connection.close();
});

global.signin = () => {
    const payload = {
        id: 'avaba',
        email: "avav@af.com"
    };
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const sessionJson = JSON.stringify({ jwt: token });
    const base64 = Buffer.from(sessionJson).toString('base64');
    return [`session=${base64}`];
}