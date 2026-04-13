import { Router } from "express";

const authRouter = Router();

authRouter.get("/", async (req, res, next) => {
    try {
        return res.status(200).json({ ok: true });
    } catch(error) {
        return next(error);
    }
});

export default authRouter;