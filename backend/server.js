const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const recipeRoutes = require('./routes/recipeRoutes');
const surplusRoutes = require('./routes/surplusRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Security Middleware
app.use(helmet());

// Performance Middleware
app.use(compression());

// Logging Middleware
const logFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(logFormat));

// CORS
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map(o => o.trim().replace(/\/$/, ''));

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        
        // Clean origin (remove trailing slash) strictly for matching
        const cleanOrigin = origin.replace(/\/$/, '');
        
        // Allow explicitly configured origins
        if (allowedOrigins.includes(cleanOrigin)) return callback(null, true);
        
        // Allow any Vercel deployment (*.vercel.app) for preview deployments
        if (cleanOrigin.endsWith('.vercel.app')) return callback(null, true);
        
        callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB is ready before API handlers (required for Vercel serverless)
app.use('/api', async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        return res.status(503).json({
            success: false,
            message: 'Database unavailable. Check MONGODB_URI and network access.',
        });
    }
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'server live',
        status: 'Online',
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/surplus', surplusRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(`[${new Date().toISOString()}] Error:`, err.stack);
    res.status(statusCode).json({
        success: false,
        message: 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Run locally only
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running locally on port ${PORT}`);
    });
}

module.exports = app;
