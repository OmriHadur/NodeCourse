import express from "express";
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from "cookie-session";

import { curentUser, errorhandler, NotFoundError } from "@sgticking235/common";
import { createPaymentsRouter } from "./routes/new";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false
    }));

app.use(curentUser);
app.use(createPaymentsRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorhandler);

export { app };