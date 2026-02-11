// Quick test script to debug surplus food creation
const mongoose = require('mongoose');
require('dotenv').config();

const SurplusFood = require('./models/SurplusFood');

async function testSurplusCreation() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Test data
        const testData = {
            dishName: 'Test Biryani',
            quantity: 5,
            location: 'Test Kitchen',
            notes: 'Test notes',
            expiresIn: 4,
            provider: 'Test Chef',
            contact: '+91 1234567890'
        };

        console.log('Creating surplus with data:', testData);

        const surplus = new SurplusFood(testData);
        console.log('Surplus object created:', surplus);

        await surplus.save();
        console.log('✅ Surplus saved successfully!');
        console.log('Saved surplus:', surplus);

        // Close connection
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        process.exit(1);
    }
}

testSurplusCreation();
