import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

export default function errorHandler(
    err: AppError,
    req: Request,
    res: Response,
    _next: NextFunction,
) {
    const status = err.status || 500;
    return res.status(status).json({ error: err.message });
}
