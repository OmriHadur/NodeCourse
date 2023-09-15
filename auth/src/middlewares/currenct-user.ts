import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'

interface UserPayload {
    id: string,
    email: string
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const curentUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.session?.jwt)
            req.currentUser = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload;
    } catch (error) { }
    next();
}