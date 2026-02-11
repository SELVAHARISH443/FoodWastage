# Food Wastage Reduction System

A comprehensive platform to reduce food wastage by connecting chefs, food providers, and orphanages.

## Project Structure

```
food-wastaage/
├── frontend/        # React + Vite frontend
└── backend/         # Node.js + Express backend
```

## Quick Start

### 1. Setup Backend

```bash
cd backend
npm install

# Configure MongoDB Atlas connection in .env file
# MONGODB_URI=your_mongodb_connection_string

# Seed initial recipe data
node seed/seedRecipes.js

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 2. Setup Frontend

```bash
cd frontend
npm install

# Start frontend development server
npm run dev
```

Frontend will run on `http://localhost:5173`

## Features

### 1. Chef Dashboard
- Select a dish from predefined recipes
- Enter number of servings
- Get precise ingredient quantities automatically calculated

### 2. Report Surplus Food
- Report excess food with details (dish name, quantity, location)
- System calculates estimated people that can be fed
- Provide contact information for collection

### 3. Available Food Listings
- Browse surplus food available for pickup
- See real-time listings with expiry times
- Contact providers directly
- Auto-refresh every 30 seconds

## Technologies

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- shadcn/ui components
- React Query (TanStack Query)
- Framer Motion
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- CORS

## MongoDB Atlas Setup

See [backend/README.md](backend/README.md) for detailed MongoDB Atlas setup instructions.

## API Documentation

See [backend/README.md](backend/README.md) for complete API endpoint documentation.

## Contributing

1. Ensure both backend and frontend servers are running
2. Backend must be running before starting frontend
3. Check console for any connection errors

## License

MIT
