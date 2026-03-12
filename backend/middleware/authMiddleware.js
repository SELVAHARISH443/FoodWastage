const jwt = require('jsonwebtoken');

// Demo users for token validation in demo mode
const DEMO_USERS = {
    'chef@foodwastage.com': { name: 'Chef User', role: 'chef' },
    'surplus@foodwastage.com': { name: 'Surplus Manager', role: 'surplus' },
    'viewer@foodwastage.com': { name: 'Viewer User', role: 'viewer' }
};

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided'
            });
        }

        // Verify and decode JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.userId = decoded.userId;

        // Demo mode: accept any valid JWT token with decoded userId
        // In production, would verify user exists in database
        if (DEMO_USERS[req.userId]) {
            req.user = {
                id: req.userId,
                name: DEMO_USERS[req.userId].name,
                email: req.userId,
                role: DEMO_USERS[req.userId].role
            };
        } else {
            // Token is valid but user not in demo list - still allow (could be from another session)
            req.user = {
                id: req.userId,
                name: 'User',
                email: req.userId,
                role: 'viewer'
            };
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        res.status(401).json({
            success: false,
            message: 'Invalid token',
            error: error.message
        });
    }
};

module.exports = authMiddleware;
