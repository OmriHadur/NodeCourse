import express from "express";
import { curentUser } from "../middlewares/currenct-user";
const router = express.Router();

router.get("/api/users/currentuser", curentUser,
    async (req, res) => {
        return res.send({ currentUser: req.currentUser || null })
    });

export { router as currentUserRouter };