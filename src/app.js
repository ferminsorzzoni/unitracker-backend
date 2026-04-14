import express from "express";
import cors from "cors";
import helmet from "helmet";
import passport from "passport";
import cookieParser from "cookie-parser";
import "./config/passport.js";
import authRoutes from "./modules/auth/auth.routes.js";

const app = express();

app.use(helmet());
app.use(cors({
}));
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);

export default app;