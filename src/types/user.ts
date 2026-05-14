type Role = 'USER' | 'ADMIN';
interface User {
    id: string;
    email: string;
    role: Role;
}

export { Role, User };
