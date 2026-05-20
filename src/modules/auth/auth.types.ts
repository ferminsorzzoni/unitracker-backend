import type { User } from '../../generated/prisma/index.js';
import type { Role } from '../../types/user.js';

type PublicUserDTO = Pick<User, 'id' | 'email' | 'role'>;

type CreateUserDTO = {
    email: string;
    password?: string;
    name: string;
    googleId?: string;
    role?: Role;
};

export { PublicUserDTO, CreateUserDTO };
