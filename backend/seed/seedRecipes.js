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
    {
        name: "Chicken Curry",
        baseServings: 4,
        ingredients: [
            { name: "Chicken", quantity: "500", unit: "g" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Tomatoes", quantity: "3", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "2", unit: "tbsp" },
            { name: "Curry Powder", quantity: "2", unit: "tbsp" },
            { name: "Coconut Milk", quantity: "1", unit: "cup" },
            { name: "Cooking Oil", quantity: "3", unit: "tbsp" },
        ],
    },
    {
        name: "Butter Chicken",
        baseServings: 4,
        ingredients: [
            { name: "Chicken", quantity: "500", unit: "g" },
            { name: "Butter", quantity: "4", unit: "tbsp" },
            { name: "Cream", quantity: "0.5", unit: "cup" },
            { name: "Tomato Puree", quantity: "1", unit: "cup" },
            { name: "Ginger-Garlic Paste", quantity: "2", unit: "tbsp" },
            { name: "Garam Masala", quantity: "1", unit: "tbsp" },
            { name: "Red Chili Powder", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Paneer Butter Masala",
        baseServings: 4,
        ingredients: [
            { name: "Paneer", quantity: "300", unit: "g" },
            { name: "Butter", quantity: "3", unit: "tbsp" },
            { name: "Cream", quantity: "0.5", unit: "cup" },
            { name: "Tomato Puree", quantity: "1", unit: "cup" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "1", unit: "tbsp" },
            { name: "Garam Masala", quantity: "1", unit: "tbsp" },
        ],
    },
    {
        name: "Chana Masala",
        baseServings: 4,
        ingredients: [
            { name: "Chickpeas", quantity: "2", unit: "cups" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Tomatoes", quantity: "3", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "2", unit: "tbsp" },
            { name: "Chana Masala Powder", quantity: "2", unit: "tbsp" },
            { name: "Cooking Oil", quantity: "3", unit: "tbsp" },
            { name: "Coriander Leaves", quantity: "0.25", unit: "cup" },
        ],
    },
    {
        name: "Aloo Gobi",
        baseServings: 4,
        ingredients: [
            { name: "Potatoes", quantity: "4", unit: "medium" },
            { name: "Cauliflower", quantity: "1", unit: "head" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "1", unit: "tbsp" },
            { name: "Turmeric Powder", quantity: "0.5", unit: "tsp" },
            { name: "Cooking Oil", quantity: "3", unit: "tbsp" },
        ],
    },
    {
        name: "Rajma",
        baseServings: 4,
        ingredients: [
            { name: "Kidney Beans", quantity: "1.5", unit: "cups" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Tomatoes", quantity: "3", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "2", unit: "tbsp" },
            { name: "Rajma Masala", quantity: "2", unit: "tbsp" },
            { name: "Cream", quantity: "0.25", unit: "cup" },
            { name: "Cooking Oil", quantity: "3", unit: "tbsp" },
        ],
    },
    {
        name: "Palak Paneer",
        baseServings: 4,
        ingredients: [
            { name: "Spinach", quantity: "500", unit: "g" },
            { name: "Paneer", quantity: "250", unit: "g" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "1", unit: "tbsp" },
            { name: "Cream", quantity: "0.25", unit: "cup" },
            { name: "Ghee", quantity: "2", unit: "tbsp" },
        ],
    },
    {
        name: "Matar Paneer",
        baseServings: 4,
        ingredients: [
            { name: "Paneer", quantity: "250", unit: "g" },
            { name: "Green Peas", quantity: "1", unit: "cup" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "1", unit: "tbsp" },
            { name: "Cream", quantity: "0.25", unit: "cup" },
            { name: "Garam Masala", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Fish Curry",
        baseServings: 4,
        ingredients: [
            { name: "Fish Fillets", quantity: "500", unit: "g" },
            { name: "Coconut Milk", quantity: "1", unit: "cup" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "2", unit: "tbsp" },
            { name: "Curry Leaves", quantity: "10", unit: "leaves" },
            { name: "Cooking Oil", quantity: "3", unit: "tbsp" },
        ],
    },
    {
        name: "Prawn Masala",
        baseServings: 4,
        ingredients: [
            { name: "Prawns", quantity: "500", unit: "g" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Tomatoes", quantity: "3", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "2", unit: "tbsp" },
            { name: "Red Chili Powder", quantity: "1", unit: "tbsp" },
            { name: "Turmeric Powder", quantity: "0.5", unit: "tsp" },
            { name: "Cooking Oil", quantity: "3", unit: "tbsp" },
        ],
    },
    {
        name: "Egg Curry",
        baseServings: 4,
        ingredients: [
            { name: "Boiled Eggs", quantity: "6", unit: "pcs" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Tomatoes", quantity: "3", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "2", unit: "tbsp" },
            { name: "Curry Powder", quantity: "2", unit: "tbsp" },
            { name: "Coconut Milk", quantity: "0.5", unit: "cup" },
            { name: "Cooking Oil", quantity: "3", unit: "tbsp" },
        ],
    },
    {
        name: "Chicken Biryani",
        baseServings: 4,
        ingredients: [
            { name: "Chicken", quantity: "500", unit: "g" },
            { name: "Basmati Rice", quantity: "2", unit: "cups" },
            { name: "Onions", quantity: "3", unit: "large" },
            { name: "Yogurt", quantity: "1", unit: "cup" },
            { name: "Ginger-Garlic Paste", quantity: "2", unit: "tbsp" },
            { name: "Biryani Masala", quantity: "2", unit: "tbsp" },
            { name: "Cooking Oil", quantity: "4", unit: "tbsp" },
        ],
    },
    {
        name: "Mutton Curry",
        baseServings: 4,
        ingredients: [
            { name: "Mutton", quantity: "500", unit: "g" },
            { name: "Onions", quantity: "2", unit: "large" },
            { name: "Tomatoes", quantity: "3", unit: "medium" },
            { name: "Ginger-Garlic Paste", quantity: "2", unit: "tbsp" },
            { name: "Curry Powder", quantity: "2", unit: "tbsp" },
            { name: "Coconut Milk", quantity: "1", unit: "cup" },
            { name: "Cooking Oil", quantity: "3", unit: "tbsp" },
        ],
    },
    {
        name: "Sambar",
        baseServings: 4,
        ingredients: [
            { name: "Toor Dal", quantity: "1", unit: "cup" },
            { name: "Mixed Vegetables", quantity: "2", unit: "cups" },
            { name: "Tamarind", quantity: "1", unit: "tbsp" },
            { name: "Sambar Powder", quantity: "2", unit: "tbsp" },
            { name: "Turmeric Powder", quantity: "0.5", unit: "tsp" },
            { name: "Cooking Oil", quantity: "2", unit: "tbsp" },
            { name: "Curry Leaves", quantity: "10", unit: "leaves" },
        ],
    },
    {
        name: "Rasam",
        baseServings: 4,
        ingredients: [
            { name: "Tomatoes", quantity: "4", unit: "medium" },
            { name: "Tamarind", quantity: "1", unit: "tbsp" },
            { name: "Rasam Powder", quantity: "1", unit: "tbsp" },
            { name: "Turmeric Powder", quantity: "0.25", unit: "tsp" },
            { name: "Ghee", quantity: "1", unit: "tbsp" },
            { name: "Curry Leaves", quantity: "10", unit: "leaves" },
            { name: "Coriander Leaves", quantity: "2", unit: "tbsp" },
        ],
    },
    {
        name: "Idli",
        baseServings: 4,
        ingredients: [
            { name: "Idli Rice", quantity: "2", unit: "cups" },
            { name: "Urad Dal", quantity: "0.5", unit: "cup" },
            { name: "Fenugreek Seeds", quantity: "0.5", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Dosa",
        baseServings: 4,
        ingredients: [
            { name: "Rice", quantity: "2", unit: "cups" },
            { name: "Urad Dal", quantity: "0.5", unit: "cup" },
            { name: "Fenugreek Seeds", quantity: "0.5", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
            { name: "Cooking Oil", quantity: "4", unit: "tbsp" },
        ],
    },
    {
        name: "Uttapam",
        baseServings: 4,
        ingredients: [
            { name: "Rice", quantity: "2", unit: "cups" },
            { name: "Urad Dal", quantity: "0.5", unit: "cup" },
            { name: "Fenugreek Seeds", quantity: "0.5", unit: "tsp" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Green Chilies", quantity: "2", unit: "pcs" },
            { name: "Cooking Oil", quantity: "4", unit: "tbsp" },
        ],
    },
    {
        name: "Pizza",
        baseServings: 4,
        ingredients: [
            { name: "Pizza Dough", quantity: "1", unit: "batch" },
            { name: "Tomato Sauce", quantity: "0.5", unit: "cup" },
            { name: "Mozzarella Cheese", quantity: "200", unit: "g" },
            { name: "Pepperoni", quantity: "100", unit: "g" },
            { name: "Bell Peppers", quantity: "1", unit: "medium" },
            { name: "Onions", quantity: "1", unit: "medium" },
            { name: "Olive Oil", quantity: "2", unit: "tbsp" },
        ],
    },
    {
        name: "Burger",
        baseServings: 4,
        ingredients: [
            { name: "Ground Beef", quantity: "500", unit: "g" },
            { name: "Burger Buns", quantity: "4", unit: "pcs" },
            { name: "Cheese Slices", quantity: "4", unit: "pcs" },
            { name: "Lettuce", quantity: "1", unit: "cup" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Onions", quantity: "1", unit: "medium" },
            { name: "Burger Sauce", quantity: "4", unit: "tbsp" },
        ],
    },
    {
        name: "Sandwich",
        baseServings: 4,
        ingredients: [
            { name: "Bread Slices", quantity: "8", unit: "pcs" },
            { name: "Cheese Slices", quantity: "4", unit: "pcs" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Cucumber", quantity: "1", unit: "medium" },
            { name: "Lettuce", quantity: "1", unit: "cup" },
            { name: "Butter", quantity: "4", unit: "tbsp" },
            { name: "Salt & Pepper", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "French Fries",
        baseServings: 4,
        ingredients: [
            { name: "Potatoes", quantity: "4", unit: "large" },
            { name: "Cooking Oil", quantity: "2", unit: "cups" },
            { name: "Salt", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Chicken Nuggets",
        baseServings: 4,
        ingredients: [
            { name: "Chicken Breast", quantity: "500", unit: "g" },
            { name: "Breadcrumbs", quantity: "1", unit: "cup" },
            { name: "Eggs", quantity: "2", unit: "pcs" },
            { name: "Flour", quantity: "0.5", unit: "cup" },
            { name: "Salt & Pepper", quantity: "1", unit: "tsp" },
            { name: "Cooking Oil", quantity: "2", unit: "cups" },
        ],
    },
    {
        name: "Caesar Salad",
        baseServings: 4,
        ingredients: [
            { name: "Romaine Lettuce", quantity: "1", unit: "head" },
            { name: "Croutons", quantity: "1", unit: "cup" },
            { name: "Parmesan Cheese", quantity: "0.5", unit: "cup" },
            { name: "Caesar Dressing", quantity: "0.5", unit: "cup" },
            { name: "Chicken Breast", quantity: "300", unit: "g" },
        ],
    },
    {
        name: "Greek Salad",
        baseServings: 4,
        ingredients: [
            { name: "Cucumber", quantity: "2", unit: "medium" },
            { name: "Tomatoes", quantity: "4", unit: "medium" },
            { name: "Red Onion", quantity: "1", unit: "medium" },
            { name: "Feta Cheese", quantity: "100", unit: "g" },
            { name: "Kalamata Olives", quantity: "0.5", unit: "cup" },
            { name: "Olive Oil", quantity: "3", unit: "tbsp" },
            { name: "Oregano", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Tomato Soup",
        baseServings: 4,
        ingredients: [
            { name: "Tomatoes", quantity: "6", unit: "large" },
            { name: "Onions", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Vegetable Stock", quantity: "4", unit: "cups" },
            { name: "Cream", quantity: "0.5", unit: "cup" },
            { name: "Butter", quantity: "2", unit: "tbsp" },
            { name: "Basil Leaves", quantity: "1", unit: "tbsp" },
        ],
    },
    {
        name: "Chicken Soup",
        baseServings: 4,
        ingredients: [
            { name: "Chicken", quantity: "300", unit: "g" },
            { name: "Carrots", quantity: "2", unit: "medium" },
            { name: "Celery", quantity: "2", unit: "stalks" },
            { name: "Onions", quantity: "1", unit: "large" },
            { name: "Garlic", quantity: "3", unit: "cloves" },
            { name: "Chicken Stock", quantity: "6", unit: "cups" },
            { name: "Noodles", quantity: "1", unit: "cup" },
        ],
    },
    {
        name: "Chocolate Cake",
        baseServings: 8,
        ingredients: [
            { name: "Flour", quantity: "2", unit: "cups" },
            { name: "Sugar", quantity: "2", unit: "cups" },
            { name: "Cocoa Powder", quantity: "0.75", unit: "cup" },
            { name: "Baking Powder", quantity: "2", unit: "tsp" },
            { name: "Eggs", quantity: "2", unit: "pcs" },
            { name: "Milk", quantity: "1", unit: "cup" },
            { name: "Butter", quantity: "0.5", unit: "cup" },
        ],
    },
    {
        name: "Vanilla Cupcakes",
        baseServings: 12,
        ingredients: [
            { name: "Flour", quantity: "1.5", unit: "cups" },
            { name: "Sugar", quantity: "1", unit: "cup" },
            { name: "Baking Powder", quantity: "1.5", unit: "tsp" },
            { name: "Eggs", quantity: "2", unit: "pcs" },
            { name: "Milk", quantity: "0.5", unit: "cup" },
            { name: "Butter", quantity: "0.5", unit: "cup" },
            { name: "Vanilla Extract", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Brownies",
        baseServings: 9,
        ingredients: [
            { name: "Butter", quantity: "0.5", unit: "cup" },
            { name: "Sugar", quantity: "1", unit: "cup" },
            { name: "Eggs", quantity: "2", unit: "pcs" },
            { name: "Vanilla Extract", quantity: "1", unit: "tsp" },
            { name: "Flour", quantity: "0.75", unit: "cup" },
            { name: "Cocoa Powder", quantity: "0.25", unit: "cup" },
            { name: "Chocolate Chips", quantity: "0.5", unit: "cup" },
        ],
    },
    {
        name: "Pancakes",
        baseServings: 4,
        ingredients: [
            { name: "Flour", quantity: "1.5", unit: "cups" },
            { name: "Sugar", quantity: "2", unit: "tbsp" },
            { name: "Baking Powder", quantity: "2", unit: "tsp" },
            { name: "Eggs", quantity: "1", unit: "pc" },
            { name: "Milk", quantity: "1.25", unit: "cups" },
            { name: "Butter", quantity: "3", unit: "tbsp" },
            { name: "Vanilla Extract", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Omelette",
        baseServings: 2,
        ingredients: [
            { name: "Eggs", quantity: "4", unit: "pcs" },
            { name: "Onions", quantity: "1", unit: "medium" },
            { name: "Tomatoes", quantity: "1", unit: "medium" },
            { name: "Green Chilies", quantity: "2", unit: "pcs" },
            { name: "Coriander Leaves", quantity: "2", unit: "tbsp" },
            { name: "Butter", quantity: "2", unit: "tbsp" },
            { name: "Salt & Pepper", quantity: "0.5", unit: "tsp" },
        ],
    },
    {
        name: "Scrambled Eggs",
        baseServings: 2,
        ingredients: [
            { name: "Eggs", quantity: "4", unit: "pcs" },
            { name: "Milk", quantity: "2", unit: "tbsp" },
            { name: "Butter", quantity: "2", unit: "tbsp" },
            { name: "Salt & Pepper", quantity: "0.5", unit: "tsp" },
        ],
    },
    {
        name: "Grilled Cheese Sandwich",
        baseServings: 2,
        ingredients: [
            { name: "Bread Slices", quantity: "4", unit: "pcs" },
            { name: "Cheese Slices", quantity: "4", unit: "pcs" },
            { name: "Butter", quantity: "2", unit: "tbsp" },
        ],
    },
    {
        name: "Mac and Cheese",
        baseServings: 4,
        ingredients: [
            { name: "Macaroni", quantity: "2", unit: "cups" },
            { name: "Cheddar Cheese", quantity: "2", unit: "cups" },
            { name: "Milk", quantity: "2", unit: "cups" },
            { name: "Butter", quantity: "4", unit: "tbsp" },
            { name: "Flour", quantity: "0.25", unit: "cup" },
            { name: "Salt & Pepper", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Spaghetti Carbonara",
        baseServings: 4,
        ingredients: [
            { name: "Spaghetti", quantity: "400", unit: "g" },
            { name: "Pancetta", quantity: "150", unit: "g" },
            { name: "Eggs", quantity: "3", unit: "pcs" },
            { name: "Parmesan Cheese", quantity: "1", unit: "cup" },
            { name: "Black Pepper", quantity: "1", unit: "tsp" },
            { name: "Salt", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Lasagna",
        baseServings: 6,
        ingredients: [
            { name: "Lasagna Sheets", quantity: "12", unit: "pcs" },
            { name: "Ground Beef", quantity: "500", unit: "g" },
            { name: "Tomato Sauce", quantity: "2", unit: "cups" },
            { name: "Ricotta Cheese", quantity: "1", unit: "cup" },
            { name: "Mozzarella Cheese", quantity: "2", unit: "cups" },
            { name: "Parmesan Cheese", quantity: "0.5", unit: "cup" },
            { name: "Onions", quantity: "1", unit: "large" },
        ],
    },
    {
        name: "Tacos",
        baseServings: 4,
        ingredients: [
            { name: "Ground Beef", quantity: "500", unit: "g" },
            { name: "Taco Shells", quantity: "8", unit: "pcs" },
            { name: "Lettuce", quantity: "2", unit: "cups" },
            { name: "Tomatoes", quantity: "2", unit: "medium" },
            { name: "Cheddar Cheese", quantity: "1", unit: "cup" },
            { name: "Sour Cream", quantity: "0.5", unit: "cup" },
            { name: "Taco Seasoning", quantity: "2", unit: "tbsp" },
        ],
    },
    {
        name: "Burrito Bowl",
        baseServings: 4,
        ingredients: [
            { name: "Rice", quantity: "2", unit: "cups" },
            { name: "Black Beans", quantity: "1", unit: "cup" },
            { name: "Chicken Breast", quantity: "400", unit: "g" },
            { name: "Corn", quantity: "1", unit: "cup" },
            { name: "Salsa", quantity: "0.5", unit: "cup" },
            { name: "Guacamole", quantity: "0.5", unit: "cup" },
            { name: "Cheddar Cheese", quantity: "1", unit: "cup" },
        ],
    },
    {
        name: "Sushi Rolls",
        baseServings: 4,
        ingredients: [
            { name: "Sushi Rice", quantity: "2", unit: "cups" },
            { name: "Nori Sheets", quantity: "4", unit: "pcs" },
            { name: "Cucumber", quantity: "1", unit: "medium" },
            { name: "Avocado", quantity: "1", unit: "medium" },
            { name: "Crab Sticks", quantity: "8", unit: "pcs" },
            { name: "Soy Sauce", quantity: "0.25", unit: "cup" },
            { name: "Wasabi", quantity: "1", unit: "tsp" },
        ],
    },
    {
        name: "Pad Thai",
        baseServings: 4,
        ingredients: [
            { name: "Rice Noodles", quantity: "200", unit: "g" },
            { name: "Chicken", quantity: "300", unit: "g" },
            { name: "Tofu", quantity: "100", unit: "g" },
            { name: "Bean Sprouts", quantity: "1", unit: "cup" },
            { name: "Peanuts", quantity: "0.25", unit: "cup" },
            { name: "Lime", quantity: "2", unit: "pcs" },
            { name: "Tamarind Sauce", quantity: "3", unit: "tbsp" },
        ],
    },
    {
        name: "Kimchi Fried Rice",
        baseServings: 4,
        ingredients: [
            { name: "Cooked Rice", quantity: "4", unit: "cups" },
            { name: "Kimchi", quantity: "1", unit: "cup" },
            { name: "Spam", quantity: "200", unit: "g" },
            { name: "Eggs", quantity: "2", unit: "pcs" },
            { name: "Sesame Oil", quantity: "2", unit: "tbsp" },
            { name: "Green Onions", quantity: "4", unit: "stalks" },
            { name: "Gochujang", quantity: "1", unit: "tbsp" },
        ],
    },
    {
        name: "Bibimbap",
        baseServings: 4,
        ingredients: [
            { name: "Cooked Rice", quantity: "4", unit: "cups" },
            { name: "Spinach", quantity: "1", unit: "cup" },
            { name: "Carrots", quantity: "2", unit: "medium" },
            { name: "Mushrooms", quantity: "1", unit: "cup" },
            { name: "Beef", quantity: "200", unit: "g" },
            { name: "Eggs", quantity: "4", unit: "pcs" },
            { name: "Gochujang", quantity: "4", unit: "tbsp" },
        ],
    },
    {
        name: "Pho",
        baseServings: 4,
        ingredients: [
            { name: "Rice Noodles", quantity: "200", unit: "g" },
            { name: "Beef", quantity: "300", unit: "g" },
            { name: "Beef Broth", quantity: "8", unit: "cups" },
            { name: "Onions", quantity: "2", unit: "medium" },
            { name: "Ginger", quantity: "2", unit: "inch" },
            { name: "Star Anise", quantity: "3", unit: "pcs" },
            { name: "Bean Sprouts", quantity: "2", unit: "cups" },
        ],
    },
    {
        name: "Ramen",
        baseServings: 4,
        ingredients: [
            { name: "Ramen Noodles", quantity: "4", unit: "packs" },
            { name: "Pork Belly", quantity: "300", unit: "g" },
            { name: "Eggs", quantity: "4", unit: "pcs" },
            { name: "Green Onions", quantity: "4", unit: "stalks" },
            { name: "Nori", quantity: "4", unit: "sheets" },
            { name: "Soy Sauce", quantity: "0.25", unit: "cup" },
            { name: "Chicken Broth", quantity: "6", unit: "cups" },
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
