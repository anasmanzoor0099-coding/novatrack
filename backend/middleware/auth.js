/* ============================================
   AUTH MIDDLEWARE
   Protects routes — verifies JWT token
   ============================================ */

const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized — no token provided',
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Not authorized — invalid token',
        });
    }
};

module.exports = { protect };