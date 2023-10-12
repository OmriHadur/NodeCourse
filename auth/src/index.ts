import mongoose from "mongoose";

import { app } from "./app";

if (!process.env.JWT_KEY)
    throw new Error('JWT_KEY missing');

if (!process.env.MONGO_URL)
    throw new Error('MONGO_URL missing');

const start = async () => {
    console.log('a');
    try {
        await mongoose.connect(process.env.MONGO_URL!);
    } catch (error) {
        console.log(error);
    }

    app.listen(3000, () => {
        console.log("listining on port 3000...");
    });
}

start();