import express, { Request, Response } from "express";
import jwt from 'jsonwebtoken'

import { body } from "express-validator";
import { User } from "../models/user";
import { validateRequest, BadReqeustError } from "@sgticking235/common";

const router = express.Router();

router.post(
    "/api/users/signup",
    [
        body('email')
            .isEmail()
            .withMessage('email must be valid'),
        body('password')
            .trim()
            .isLength({ min: 4, max: 20 })
            .withMessage("passsword 4-20")
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser)
            throw new BadReqeustError("Email in use");
        const user = User.build({ email, password });
        await user.save();

        const userJwt = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_KEY!);
        req.session = { jwt: userJwt };

        res.status(201).send(user);
    });

export { router as signupRouter };