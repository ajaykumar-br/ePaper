import jwt from 'jsonwebtoken';

// JWT secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

export const generateToken = (payload, expiresIn = '7d') => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

export { JWT_SECRET };
