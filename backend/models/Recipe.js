const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    }
}, { _id: false });

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    baseServings: {
        type: Number,
        required: true,
        min: 1
    },
    ingredients: [ingredientSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
