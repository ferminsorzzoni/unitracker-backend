import { User } from '../../prisma/generated/prisma/client.js';
import { Role } from '../../types/user.js';

type PublicUserDTO = Pick<User, 'id' | 'email' | 'role'>;

type CreateUserDTO = {
    email: string;
    password?: string;
    name: string;
    googleId?: string;
    role?: Role;
};

export { PublicUserDTO, CreateUserDTO };
