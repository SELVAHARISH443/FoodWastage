const SurplusFood = require('../models/SurplusFood');

// Create new surplus food report
const createSurplus = async (req, res) => {
    try {
        console.log('📥 Received surplus food request:', req.body);
        const { dishName, quantity, location, notes, expiresIn, provider, contact } = req.body;

        // Validation
        if (!dishName || !quantity || !location || !expiresIn || !provider || !contact) {
            console.log('❌ Validation failed - missing fields');
            return res.status(400).json({
                message: 'Missing required fields: dishName, quantity, location, expiresIn, provider, contact'
            });
        }

        console.log('✅ Validation passed, creating surplus object...');
        const surplus = new SurplusFood({
            dishName,
            quantity: parseFloat(quantity),
            location,
            notes: notes || '',
            expiresIn: parseInt(expiresIn),
            provider,
            contact
        });

        console.log('💾 Saving to database...');
        await surplus.save();
        console.log('✅ Surplus saved successfully:', surplus._id);

        res.status(201).json({
            message: 'Surplus food reported successfully',
            data: surplus
        });
    } catch (error) {
        console.error('❌ Error creating surplus:');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Full error:', error);
        res.status(500).json({ message: 'Error creating surplus food report', error: error.message });
    }
};

// Get all active surplus food (not expired)
const getAllSurplus = async (req, res) => {
    try {
        const now = new Date();

        const surplusItems = await SurplusFood.find({
            isActive: true,
            expiresAt: { $gt: now }
        })
            .sort({ createdAt: -1 })
            .select('-__v');

        res.json(surplusItems);
    } catch (error) {
        console.error('Error fetching surplus:', error);
        res.status(500).json({ message: 'Error fetching surplus food', error: error.message });
    }
};

// Get specific surplus food item
const getSurplusById = async (req, res) => {
    try {
        const surplus = await SurplusFood.findById(req.params.id).select('-__v');

        if (!surplus) {
            return res.status(404).json({ message: 'Surplus food item not found' });
        }

        res.json(surplus);
    } catch (error) {
        console.error('Error fetching surplus item:', error);
        res.status(500).json({ message: 'Error fetching surplus food item', error: error.message });
    }
};

// Delete surplus food (mark as collected)
const deleteSurplus = async (req, res) => {
    try {
        const surplus = await SurplusFood.findByIdAndUpdate(
            req.params.id,
            { isActive: false },
            { new: true }
        );

        if (!surplus) {
            return res.status(404).json({ message: 'Surplus food item not found' });
        }

        res.json({ message: 'Surplus food marked as collected', data: surplus });
    } catch (error) {
        console.error('Error deleting surplus:', error);
        res.status(500).json({ message: 'Error deleting surplus food', error: error.message });
    }
};

module.exports = {
    createSurplus,
    getAllSurplus,
    getSurplusById,
    deleteSurplus
};
