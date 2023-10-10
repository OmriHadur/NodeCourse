
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import jwt from 'jsonwebtoken'

declare global {
    var signin: () => string[];
}

jest.mock('../nats-wrapper');

let mongo: any;
beforeAll(async () => {
    jest.clearAllMocks();
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
        id: new mongoose.Types.ObjectId().toHexString(),
        email: "avav@af.com"
    };
    const token = jwt.sign(payload, process.env.JWT_KEY!);
    const sessionJson = JSON.stringify({ jwt: token });
    const base64 = Buffer.from(sessionJson).toString('base64');
    return [`session=${base64}`];
}