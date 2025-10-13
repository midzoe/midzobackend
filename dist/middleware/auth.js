import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
        const user = await UserModel.findById(decoded.userId);
        if (!user) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }
};
export const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
            const user = await UserModel.findById(decoded.userId);
            req.user = user;
        }
        catch (error) {
            // Token invalid, but we don't block the request
        }
    }
    next();
};
//# sourceMappingURL=auth.js.map