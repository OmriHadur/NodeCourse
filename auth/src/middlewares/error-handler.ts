import { NextFunction, Request, Response } from 'express'
import { CustomError } from '../errors/custom-error';

export const errorhandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof CustomError)
        return res.status(err.statusCode).send({ erros: err.serilizeErrors() });
    return res.status(400).send({ error: [{ message: "general errror" }] });
}