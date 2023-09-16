import mongoose from "mongoose";

import { app } from "./app";

if (!process.env.JWT_KEY)
    throw new Error('JWT_KEY missing');

const start = async () => {
    try {
        await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    } catch (error) {
        console.log(error);
    }

    app.listen(3000, () => {
        console.log("listining on port 3000...");
    });
}

start();