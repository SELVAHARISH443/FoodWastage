const mongoose = require('mongoose');

const connectOpts = {
    bufferCommands: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    // Prefer IPv4; some Vercel ↔ Atlas setups fail on IPv6-only resolution
    family: 4,
};

/**
 * Cached connection for Vercel serverless. Reconnects if the socket was dropped.
 */
async function connectDB() {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
    }

    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // Connection closed or failed — do not reuse a stale resolved promise
    if (mongoose.connection.readyState === 0) {
        global.__mongoosePromise = null;
    }

    if (!global.__mongoosePromise) {
        global.__mongoosePromise = mongoose.connect(mongoURI, connectOpts);
    }

    try {
        await global.__mongoosePromise;
    } catch (err) {
        global.__mongoosePromise = null;
        throw err;
    }

    if (mongoose.connection.readyState !== 1) {
        global.__mongoosePromise = null;
        throw new Error('MongoDB did not reach connected state');
    }

    return mongoose.connection;
}

module.exports = connectDB;
