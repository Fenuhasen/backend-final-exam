import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'secret';

export function createToken(userId: number, role: string) {
    return jwt.sign(
        { userId, role },
        SECRET,
        { expiresIn: '1h' }
    );
}

export function verifyToken(token: string) {
    return jwt.verify(token, SECRET);
}