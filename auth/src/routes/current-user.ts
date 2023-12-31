import { curentUser } from "@sgticking235/common";
import express from "express";

const router = express.Router();

router.get("/api/users/currentuser", curentUser,
    async (req, res) => {
        return res.send({ currentUser: req.currentUser || null })
    });

export { router as currentUserRouter };