const express = require('express');
const router = express.Router();
const {
    createSurplus,
    getAllSurplus,
    getSurplusById,
    deleteSurplus
} = require('../controllers/surplusController');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/surplus - Create new surplus food report (requires auth)
router.post('/', authMiddleware, createSurplus);

// GET /api/surplus - Get all active surplus food
router.get('/', getAllSurplus);

// GET /api/surplus/:id - Get specific surplus food item
router.get('/:id', getSurplusById);

// DELETE /api/surplus/:id - Mark surplus as collected (requires auth)
router.delete('/:id', authMiddleware, deleteSurplus);

module.exports = router;

module.exports = router;
