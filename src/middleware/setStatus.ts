import { Request, Response, NextFunction } from 'express';

function setStatus(code: number) {
    return function (req: Request, res: Response, next: NextFunction) {
        res.status(code);
        return next();
    };
}

export { setStatus };
