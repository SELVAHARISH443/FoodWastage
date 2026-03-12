const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const recipeRoutes = require('./routes/recipeRoutes');
const surplusRoutes = require('./routes/surplusRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// MongoDB Connection (optional - demo mode works without it)
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.warn('⚠️ MongoDB Connection Error:', error.message);
        console.log('⚠️ Running in DEMO MODE - using hardcoded credentials, some features unavailable');
    }
};

connectDB();

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Food Wastage Reduction API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            recipes: '/api/recipes',
            surplus: '/api/surplus'
        }
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/surplus', surplusRoutes);

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT);
}

module.exports = app;
