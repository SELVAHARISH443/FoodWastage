const express = require('express');
const router = express.Router();
const {
    createSurplus,
    getAllSurplus,
    getSurplusById,
    deleteSurplus
} = require('../controllers/surplusController');

// POST /api/surplus - Create new surplus food report
router.post('/', createSurplus);

// GET /api/surplus - Get all active surplus food
router.get('/', getAllSurplus);

// GET /api/surplus/:id - Get specific surplus food item
router.get('/:id', getSurplusById);

// DELETE /api/surplus/:id - Mark surplus as collected
router.delete('/:id', deleteSurplus);

module.exports = router;
