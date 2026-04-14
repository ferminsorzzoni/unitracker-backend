import { Router } from "express";
import { googleController, loginController, registerController, googleCallbackController, refreshAccessController } from "./auth.controller.js";

const authRouter = Router();

authRouter.get("/", async (req, res, next) => {
    try {
        return res.status(200).json({ ok: true });
    } catch(error) {
        return next(error);
    }
});
authRouter.post("/refresh", refreshAccessController)
authRouter.post("/register", registerController);
authRouter.post("login", loginController);
authRouter.get("/google", googleController);
authRouter.get("/google/callback", googleCallbackController)

export default authRouter;