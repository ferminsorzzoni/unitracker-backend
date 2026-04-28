import { Role } from '../../types/user.js';

function isAdmin(role: Role) {
    return role === 'ADMIN';
}

export { isAdmin };
