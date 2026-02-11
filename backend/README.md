# Food Wastage Reduction System - Backend

Backend API for the Food Wastage Reduction System built with Node.js, Express, and MongoDB.

## Features

- **Recipe Management**: Store and retrieve recipes with ingredient calculations
- **Surplus Food Reporting**: Allow providers to report excess food
- **Food Listings**: Display available surplus food to orphanages
- **Auto-expiry**: Automatically filter expired food listings
- **RESTful API**: Clean API design with proper error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
   - Copy `.env` file and update with your MongoDB Atlas connection string
   - Get your connection string from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

3. Seed the database with initial recipes:
```bash
node seed/seedRecipes.js
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Recipes

- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:name` - Get specific recipe by name

### Surplus Food

- `POST /api/surplus` - Create new surplus food report
- `GET /api/surplus` - Get all active surplus food (not expired)
- `GET /api/surplus/:id` - Get specific surplus food item
- `DELETE /api/surplus/:id` - Mark surplus as collected

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Paste the connection string in `.env` file as `MONGODB_URI`

Example:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/food-wastage?retryWrites=true&w=majority
```

## Project Structure

```
backend/
├── models/           # Mongoose schemas
│   ├── Recipe.js
│   └── SurplusFood.js
├── controllers/      # Route controllers
│   ├── recipeController.js
│   └── surplusController.js
├── routes/          # API routes
│   ├── recipeRoutes.js
│   └── surplusRoutes.js
├── seed/            # Database seeding scripts
│   └── seedRecipes.js
├── server.js        # Main application file
├── .env             # Environment variables
└── package.json     # Dependencies
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `NODE_ENV` - Environment (development/production)

## Technologies Used

- **Express.js** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **nodemon** - Development auto-reload
