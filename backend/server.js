const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

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
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(o => o.trim());

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        // Allow explicitly configured origins
        if (allowedOrigins.includes(origin)) return callback(null, true);
        // Allow any Vercel deployment (*.vercel.app) for preview deployments
        if (origin.endsWith('.vercel.app')) return callback(null, true);
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

// MongoDB Connection
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }
        await mongoose.connect(mongoURI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.warn('⚠️ MongoDB Connection Error:', error.message);
        if (process.env.NODE_ENV !== 'production') {
            console.log('⚠️ Running in DEMO MODE - some features may be limited');
        } else {
            console.error('❌ Critical: MongoDB connection failed in production!');
            process.exit(1);
        }
    }
};

connectDB();

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
