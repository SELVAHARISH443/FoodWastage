const express = require('express');
const router = express.Router();
const { getAllRecipes, getRecipeByName } = require('../controllers/recipeController');

// GET /api/recipes - Get all recipes
router.get('/', getAllRecipes);

// GET /api/recipes/:name - Get recipe by name
router.get('/:name', getRecipeByName);

module.exports = router;
