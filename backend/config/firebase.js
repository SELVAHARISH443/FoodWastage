const admin = require('firebase-admin');

// Ensure you have FIREBASE_SERVICE_ACCOUNT_KEY in your backend .env
// This should be the JSON stringified version of your service account key file
let serviceAccount;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        // Sometimes stringified .env values have literal '\n' that need to be parsed
        if (serviceAccount.private_key) {
            serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
        }
    } else {
        console.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_KEY not found in .env. Firebase Admin will not be able to verify tokens.');
    }
} catch (error) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error.message);
}

if (serviceAccount) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('✅ Firebase Admin SDK initialized');
    } catch (error) {
        console.warn('⚠️ Firebase initialization failed (this is normal if using a placeholder key). Server will still start, but Google tokens cannot be verified:', error.message);
    }
}

module.exports = admin;
