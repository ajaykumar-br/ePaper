import { verifyToken } from '../config/jwt.js';
import { MESSAGES, STATUS_CODES } from '../constants/index.js';

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(STATUS_CODES.UNAUTHORIZED).json({
            error: MESSAGES.ACCESS_TOKEN_REQUIRED
        });
    }

    try {
        const user = verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        return res.status(STATUS_CODES.FORBIDDEN).json({
            error: MESSAGES.INVALID_TOKEN
        });
    }
};
