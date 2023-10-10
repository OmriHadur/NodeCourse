import express from "express";
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from "cookie-session";

import { curentUser, errorhandler, NotFoundError } from "@sgticking235/common";
import { createOrder } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { indexOrdersRouter } from "./routes";
import { deleteOrderRouter } from "./routes/delete";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    }));

app.use(curentUser);
app.use(createOrder);
app.use(showOrderRouter);
app.use(indexOrdersRouter);
app.use(deleteOrderRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorhandler);

export { app };