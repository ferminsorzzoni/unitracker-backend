import 'express';

type Role = "USER" | "ADMIN";
interface User {
    id: string;
    role: Role;
}

declare global {
    namespace Express {
        interface Request {
            user?: User;
        }
    }
}

export { Role, User };
