import express from "express";
import jwt from 'jsonwebtoken'

const router = express.Router();

router.get("/api/users/currentuser",
    async (req, res) => {
        var payload = null;
        try {
            if (req.session?.jwt)
                payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
        } catch (error) { }
        return res.send({ currentUser: payload })
    });

export { router as currentUserRouter };