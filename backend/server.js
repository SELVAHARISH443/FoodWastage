const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const recipeRoutes = require('./routes/recipeRoutes');
const surplusRoutes = require('./routes/surplusRoutes');

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

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error.message);
        process.exit(1);
    }
};

connectDB();

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Food Wastage Reduction API',
        version: '1.0.0',
        endpoints: {
            recipes: '/api/recipes',
            surplus: '/api/surplus'
        }
    });
});

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
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
});
