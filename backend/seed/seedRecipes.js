const mongoose = require('mongoose');
const Recipe = require('../models/Recipe');
require('dotenv').config();

const recipes = [
    {
        name: "Vegetable Biryani",
        baseServings: 4,
        ingredients: [
            { name: "Basmati Rice", quantity: "2", unit: "cups" },
            { name: "Mixed Vegetables", quantity: "3", unit: "cups" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Yogurt", quantity: "1", unit: "cup" },
            { name: "Cooking Oil", quantity: "4", unit: "tbsp" },
            { name: "Biryani Masala", quantity: "2", unit: "tbsp" },
        ],
    },
    {
        name: "Dal Tadka",
        baseServings: 4,
        ingredients: [
            { name: "Toor Dal", quantity: "1.5", unit: "cups" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Onions", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "4", unit: "cloves" },
            { name: "Ghee", quantity: "3", unit: "tbsp" },
            { name: "Cumin Seeds", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Pasta Alfredo",
        baseServings: 4,
        ingredients: [
            { name: "Pasta", quantity: "400", unit: "g" },
            { name: "Heavy Cream", quantity: "1.5", unit: "cups" },
            { name: "Parmesan Cheese", quantity: "1", unit: "cup" },
            { name: "Butter", quantity: "3", unit: "tbsp" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Salt & Pepper", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Fried Rice",
        baseServings: 4,
        ingredients: [
            { name: "Cooked Rice", quantity: "4", unit: "cups" },
            { name: "Mixed Vegetables", quantity: "2", unit: "cups" },
            { name: "Eggs", quantity: "3", unit: "pcs" },
            { name: "Soy Sauce", quantity: "3", unit: "tbsp" },
            { name: "Cooking Oil", quantity: "3", unit: "tbsp" },
            { name: "Spring Onions", quantity: "4", unit: "stalks" },
        ],
    },
    {
        name: "Chapati with Paneer",
        baseServings: 4,
        ingredients: [
            { name: "Whole Wheat Flour", quantity: "3", unit: "cups" },
            { name: "Paneer", quantity: "300", unit: "g" },
            { name: "Tomatoes", quantity: "3", unit: "medium" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Spices Mix", quantity: "2", unit: "tbsp" },
            { name: "Oil / Ghee", quantity: "4", unit: "tbsp" },
        ],
    },
];

const seedRecipes = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Clear existing recipes
        await Recipe.deleteMany({});
        console.log('🗑️  Cleared existing recipes');

        // Insert new recipes
        await Recipe.insertMany(recipes);
        console.log('✅ Successfully seeded recipes');

        // Close connection
        await mongoose.connection.close();
        console.log('👋 Database connection closed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding recipes:', error);
        process.exit(1);
    }
};

seedRecipes();
