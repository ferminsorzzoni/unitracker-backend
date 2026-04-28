import { User } from '../../prisma/generated/prisma/client.js';

type PublicUserDTO = Pick<User, 'id' | 'role'>;

type CreateUserDTO = {
    email: string;
    password?: string;
    name: string;
    googleId?: string;
};

export { PublicUserDTO, CreateUserDTO };
