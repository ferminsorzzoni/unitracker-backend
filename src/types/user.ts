type Role = 'USER' | 'ADMIN';
interface User {
    id: string;
    role: Role;
}

export { Role, User };
