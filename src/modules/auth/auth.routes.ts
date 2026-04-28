import { Router } from 'express';
import {
    googleCallbackHandler,
    googleHandler,
    loginHandler,
    logoutHandler,
    refreshAccessHandler,
    registerHandler,
} from './auth.controller.js';

const authRouter = Router();

authRouter.post('/refresh', refreshAccessHandler);
authRouter.post('/register', registerHandler);
authRouter.post('/login', loginHandler);
authRouter.post('/logout', logoutHandler);
authRouter.get('/google', googleHandler);
authRouter.get('/google/callback', googleCallbackHandler);

export default authRouter;
