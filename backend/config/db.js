const mongoose = require('mongoose');

/**
 * Cached connection for Vercel serverless: reuse across invocations, avoid
 * multiple connects and ensure handlers run only after mongoose is ready.
 */
async function connectDB() {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    if (!global.__mongoosePromise) {
        global.__mongoosePromise = mongoose.connect(mongoURI, {
            bufferCommands: false,
            maxPoolSize: 10,
        });
    }

    try {
        await global.__mongoosePromise;
        return mongoose.connection;
    } catch (err) {
        global.__mongoosePromise = null;
        throw err;
    }
}

module.exports = connectDB;
