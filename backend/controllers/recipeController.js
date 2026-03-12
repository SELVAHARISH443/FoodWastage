const axios = require('axios');
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

// Map TheMealDB response to internal format
const mapMealDBToRecipe = (meal) => {
    const ingredients = [];

    // Helper to convert fractions to decimals for easier scaling
    const fractionToDecimal = (str) => {
        if (!str) return str;
        const matches = str.match(/(\d+)\/(\d+)/);
        if (matches) {
            return (parseInt(matches[1]) / parseInt(matches[2])).toString();
        }
        return str;
    };

    for (let i = 1; i <= 20; i++) {
        const name = meal[`strIngredient${i}`];
        let measure = meal[`strMeasure${i}`];
        if (name && name.trim()) {
            // Try to extract numeric part and unit from measure
            // TheMealDB measures are messy, e.g., "1/2 cup", "2 tbs", "to taste"
            measure = fractionToDecimal(measure?.trim());

            ingredients.push({
                name: name.trim(),
                quantity: measure || '1',
                unit: ''
            });
        }
    }

    return {
        _id: `mealdb-${meal.idMeal}`,
        name: meal.strMeal,
        baseServings: 1,
        ingredients
    };
};

// Get recipe by name
const getRecipeByName = async (req, res) => {
    const { name } = req.params;
    try {
        // 1. Try local DB
        let recipe = await Recipe.findOne({ name: new RegExp(`^${name}$`, 'i') }).select('-__v');

        if (recipe) {
            return res.json(recipe);
        }

        // 2. Fallback to TheMealDB
        console.log(`Fallback to TheMealDB for: ${name}`);
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`);

        if (response.data && response.data.meals && response.data.meals.length > 0) {
            const meal = response.data.meals[0];
            recipe = mapMealDBToRecipe(meal);
            return res.json(recipe);
        }

        res.status(404).json({ message: 'Recipe not found locally or in external database' });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
};

module.exports = {
    getAllRecipes,
    getRecipeByName
};
