const Recipe = require('../models/Recipe');

// Get all recipes
const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().select('-__v');
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
};

// Get recipe by name
const getRecipeByName = async (req, res) => {
    try {
        const recipe = await Recipe.findOne({ name: req.params.name }).select('-__v');

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        res.json(recipe);
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
};

module.exports = {
    getAllRecipes,
    getRecipeByName
};
