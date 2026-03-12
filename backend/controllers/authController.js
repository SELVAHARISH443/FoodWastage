const jwt = require('jsonwebtoken');
const admin = require('../config/firebase');

// Demo mode: hardcoded credentials for testing (no MongoDB required)
const DEMO_USERS = {
    'chef@foodwastage.com': {
        name: 'Chef User',
        email: 'chef@foodwastage.com',
        password: 'chef123',
        role: 'chef'
    },
    'surplus@foodwastage.com': {
        name: 'Surplus Manager',
        email: 'surplus@foodwastage.com',
        password: 'surplus123',
        role: 'surplus'
    },
    'viewer@foodwastage.com': {
        name: 'Viewer User',
        email: 'viewer@foodwastage.com',
        password: 'viewer123',
        role: 'viewer'
    },
    'admin@foodwastage.com': {
        name: 'Admin User',
        email: 'admin@foodwastage.com',
        password: 'admin123',
        role: 'admin'
    }
};

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '7d'
    });
};

// Register User (Demo mode - returns error with upgrade message)
exports.register = async (req, res) => {
    try {
        return res.status(503).json({
            success: false,
            message: 'Registration currently disabled (demo mode). Use existing credentials to login.',
            demoUsers: Object.values(DEMO_USERS).map(u => ({ email: u.email, password: u.password, role: u.role }))
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during registration',
            error: error.message
        });
    }
};

// Login User (Demo mode - validates against hardcoded credentials)
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Check demo credentials
        const demoUser = DEMO_USERS[email];

        if (!demoUser || demoUser.password !== password) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                hint: 'Demo mode: Check AUTH_GUIDE.md for valid credentials'
            });
        }

        // Generate token
        const token = generateToken(email);

        console.log(`✅ Demo login successful for ${email} (${demoUser.role})`);

        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
                id: email,
                name: demoUser.name,
                email: demoUser.email,
                role: demoUser.role,
                phone: '',
                location: '',
                organization: ''
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during login',
            error: error.message
        });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            user: {
                id: req.userId,
                name: 'Demo User',
                email: req.userId,
                role: 'viewer'
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
        return res.status(200).json({
            success: true,
            count: Object.keys(DEMO_USERS).length,
            users: Object.values(DEMO_USERS).map(u => ({
                id: u.email,
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

// Google OAuth Login (Bypass Verification for Demo Mode)
exports.googleLogin = async (req, res) => {
    try {
        const { email, name, googleToken } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Google email is required'
            });
        }

        try {
            let decodedEmail = email;
            let decodedName = name || email.split('@')[0];

            // Try to verify token if Firebase Admin is initialized
            const admin = require('../config/firebase');
            if (admin && googleToken) {
                try {
                    const decodedToken = await admin.auth().verifyIdToken(googleToken);
                    decodedEmail = decodedToken.email;
                    decodedName = decodedToken.name || decodedEmail.split('@')[0];
                } catch (verifyError) {
                    console.error('Firebase token verification failed:', verifyError.message);
                    // Only fallback to trusting the body if we are in development mode
                    if (process.env.NODE_ENV !== 'development') {
                        return res.status(401).json({
                            success: false,
                            message: 'Invalid Google token'
                        });
                    }
                }
            } else if (process.env.NODE_ENV !== 'development') {
                // If not in development, we MUST have verification
                return res.status(500).json({
                    success: false,
                    message: 'Authentication service not configured'
                });
            }

            if (!decodedEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Could not get email from Google account'
                });
            }

            const token = generateToken(decodedEmail);

            // Create user object from Google profile
            const user = {
                id: decodedEmail,
                name: decodedName,
                email: decodedEmail,
                role: 'viewer', // Default role for Google sign-up
                phone: '',
                location: '',
                organization: ''
            };

            console.log(`✅ Google login successful (bypass) for ${decodedEmail}`);

            res.status(200).json({
                success: true,
                message: 'Logged in with Google successfully',
                token,
                user
            });
        } catch (error) {
            console.error('Google token verification error:', error);
            return res.status(401).json({
                success: false,
                message: 'Failed to verify Google token'
            });
        }
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            success: false,
            message: 'Error during Google login',
            error: error.message
        });
    }
};
