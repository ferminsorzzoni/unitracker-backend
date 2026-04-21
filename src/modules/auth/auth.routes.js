import { Router } from "express";
import { googleController, loginController, logoutController, registerController, googleCallbackController, refreshAccessController } from "./auth.controller.js";

const authRouter = Router();

authRouter.post("/refresh", refreshAccessController)
authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.post("/logout", logoutController)
authRouter.get("/google", googleController);
authRouter.get("/google/callback", googleCallbackController)

export default authRouter;