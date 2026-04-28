import passport from 'passport';
import { Request, Response, NextFunction } from 'express';

function requireAuth(req: Request, res: Response, next: NextFunction) {
    return passport.authenticate('jwt', { session: false })(req, res, next);
}

export { requireAuth };
