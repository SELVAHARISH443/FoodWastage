const jwt = require('jsonwebtoken');
const User = require('../models/User');

function isDuplicateKeyError(err) {
    if (!err) return false;
    if (err.code === 11000 || err.code === 11001) return true;
    if (err.name === 'MongoServerError' && err.code === 11000) return true;
    return false;
}

function isDbUnavailableError(err) {
    if (!err) return false;
    const n = err.name || '';
    if (n === 'MongoServerSelectionError' || n === 'MongoNetworkError' || n === 'MongoNotConnectedError') {
        return true;
    }
    const msg = String(err.message || '');
    return /ECONNREFUSED|ENOTFOUND|ETIMEDOUT|SSL|socket|network|closed/i.test(msg);
}

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId: String(userId) }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d'
    });
};

// Register User
exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone, location, organization } = req.body || {};

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password, and role are required'
            });
        }

        const trimmedEmail = String(email).trim().toLowerCase();

        const userExists = await User.findOne({ email: trimmedEmail });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        const user = await User.create({
            name: String(name).trim(),
            email: trimmedEmail,
            password,
            role,
            phone: phone != null ? String(phone).trim() : '',
            location: location != null ? String(location).trim() : '',
            organization: organization != null ? String(organization).trim() : ''
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            token: generateToken(user._id),
            user: {
                id: user._id, name: user.name, email: user.email, role: user.role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);

        if (error.name === 'ValidationError') {
            const first = Object.values(error.errors || {})[0];
            return res.status(400).json({
                success: false,
                message: first?.message || 'Invalid registration data'
            });
        }

        if (isDuplicateKeyError(error)) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email already exists'
            });
        }

        if (isDbUnavailableError(error)) {
            return res.status(503).json({
                success: false,
                message: 'Database temporarily unavailable. Check MONGODB_URI and Atlas network access.',
                code: 'DB_UNAVAILABLE'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error during registration',
            code: 'REGISTER_FAILED',
            error: process.env.NODE_ENV === 'production' ? undefined : error.message
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone || '',
                location: user.location || '',
                organization: user.organization || ''
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        if (isDbUnavailableError(error)) {
            return res.status(503).json({
                success: false,
                message: 'Database temporarily unavailable. Check MONGODB_URI and Atlas network access.',
                code: 'DB_UNAVAILABLE'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user',
            error: error.message
        });
    }
};

// Get all users (for admin)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({
            success: true,
            count: users.length,
            users: users.map(u => ({
                id: u._id,
                name: u.name,
                email: u.email,
                role: u.role
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

// Google OAuth Login
exports.googleLogin = async (req, res) => {
    try {
        let { email, name, googleToken } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Google email is required'
            });
        }

        let decodedEmail = String(email).trim().toLowerCase();
        let decodedName = name || decodedEmail.split('@')[0];

        // Optional token verification when Firebase Admin is configured
        if (googleToken && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
            const admin = require('../config/firebase');
            try {
                const decodedToken = await admin.auth().verifyIdToken(googleToken);
                decodedEmail = String(decodedToken.email || decodedEmail).trim().toLowerCase();
                decodedName = decodedToken.name || decodedEmail.split('@')[0];
            } catch (verifyError) {
                console.error('Firebase token verification failed:', verifyError.message);
                if (process.env.NODE_ENV !== 'development') {
                    return res.status(401).json({ success: false, message: 'Invalid Google token' });
                }
            }
        }

        let user = await User.findOne({ email: decodedEmail });

        if (!user) {
            // Register new user from Google
            user = await User.create({
                name: decodedName,
                email: decodedEmail,
                password: Math.random().toString(36).slice(-10), // Random secure password since they login with Google
                role: 'viewer'
            });
        }

        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Logged in with Google successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during Google login',
            error: error.message
        });
    }
};
