import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken'

import { body } from "express-validator";
import { User } from "../models/user";
import { PasswordService } from "../services/password";
import { validateRequest, BadReqeustError } from "@sgticking235/common";

const router = express.Router();

router.post(
    "/api/users/signin",
    [
        body('email')
            .isEmail()
            .withMessage('email must be valid'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage("passsword reqeiured")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user)
            throw new BadReqeustError("Bad user / password");

        const passswordMatch = await PasswordService.compare(user.password, password);
        if (!passswordMatch)
            throw new BadReqeustError("Bad userssss / password");

        const userJwt = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_KEY!);
        req.session = { jwt: userJwt };

        res.status(200).send(user);
    });

export { router as signinRouter };