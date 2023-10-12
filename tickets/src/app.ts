import express from "express";
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from "cookie-session";

import { curentUser, errorhandler, NotFoundError } from "@sgticking235/common";
import { createTicket } from "./routes/new";
import { showTicketRouter } from "./routes/show";
import { indexTicketsRouter } from "./routes";
import { updateTicketRouter } from "./routes/update";

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: false
    }));

app.use(curentUser);
app.use(createTicket);
app.use(showTicketRouter);
app.use(indexTicketsRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorhandler);

export { app };