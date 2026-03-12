// Demo storage with simple file persistence so data survives restarts
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const SURPLUS_FILE = path.join(DATA_DIR, 'surplus.json');

let DEMO_SURPLUS_ITEMS = [];

// ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// load existing items from file at startup
if (fs.existsSync(SURPLUS_FILE)) {
    try {
        const raw = fs.readFileSync(SURPLUS_FILE, 'utf8');
        DEMO_SURPLUS_ITEMS = JSON.parse(raw) || [];
        console.log(`✅ Loaded ${DEMO_SURPLUS_ITEMS.length} surplus items from disk`);
    } catch (err) {
        console.error('⚠️ Failed to load surplus data:', err.message);
        DEMO_SURPLUS_ITEMS = [];
    }
}

// helper to save current items to disk
const persistSurplus = () => {
    try {
        fs.writeFileSync(SURPLUS_FILE, JSON.stringify(DEMO_SURPLUS_ITEMS, null, 2));
    } catch (err) {
        console.error('⚠️ Failed to persist surplus data:', err.message);
    }
};

// Create new surplus food report
const createSurplus = async (req, res) => {
    try {
        console.log('📥 Received surplus food request:', req.body);
        const { dishName, quantity, location, district, notes, expiresIn, provider, contact } = req.body;

        // Validation
        if (!dishName || !quantity || !location || !district || !expiresIn || !provider || !contact) {
            console.log('❌ Validation failed - missing fields');
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: dishName, quantity, location, district, expiresIn, provider, contact'
            });
        }

        console.log('✅ Validation passed, creating surplus object...');
        
        // Demo mode: create in-memory record
        const surplus = {
            _id: `demo-${Date.now()}`,
            dishName,
            quantity: parseFloat(quantity),
            location,
            district,
            notes: notes || '',
            expiresIn: parseInt(expiresIn),
            provider,
            contact,
            userId: req.userId,
            userName: req.userId,
            isActive: true,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + parseInt(expiresIn) * 60 * 60 * 1000) // hours to milliseconds
        };

        DEMO_SURPLUS_ITEMS.push(surplus);
        persistSurplus();
        console.log('✅ Surplus stored and persisted:', surplus._id);

        // Send email notification (will skip in demo mode if email is disabled)
        try {
            const { sendFoodPostedNotification } = require('../utils/emailService');
            await sendFoodPostedNotification(surplus, { name: surplus.userName, email: req.userId, role: 'surplus' }, []);
        } catch (emailError) {
            console.error('Error sending emails:', emailError.message);
            // Don't fail the request if email fails
        }

        res.status(201).json({
            success: true,
            message: 'Surplus food reported successfully!',
            data: surplus
        });
    } catch (error) {
        console.error('❌ Error creating surplus:');
        console.error('Error message:', error.message);
        res.status(500).json({ 
            success: false,
            message: 'Error creating surplus food report', 
            error: error.message 
        });
    }
};

// Get all active surplus food (not expired)
const getAllSurplus = async (req, res) => {
    try {
        const now = new Date();
        const activeSurplus = DEMO_SURPLUS_ITEMS.filter(item => 
            item.isActive && new Date(item.expiresAt) > now
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.json(activeSurplus);
    } catch (error) {
        console.error('Error fetching surplus:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching surplus food', 
            error: error.message 
        });
    }
};

// Get specific surplus food item
const getSurplusById = async (req, res) => {
    try {
        const surplus = DEMO_SURPLUS_ITEMS.find(item => item._id === req.params.id);

        if (!surplus) {
            return res.status(404).json({ 
                success: false,
                message: 'Surplus food item not found' 
            });
        }

        res.json(surplus);
    } catch (error) {
        console.error('Error fetching surplus item:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching surplus food item', 
            error: error.message 
        });
    }
};

// Delete surplus food (mark as collected)
const deleteSurplus = async (req, res) => {
    try {
        const surplus = DEMO_SURPLUS_ITEMS.find(item => item._id === req.params.id);

        if (!surplus) {
            return res.status(404).json({ 
                success: false,
                message: 'Surplus food item not found' 
            });
        }

        surplus.isActive = false;
        persistSurplus();

        res.json(surplus);
    } catch (error) {
        console.error('Error deleting surplus:', error);
        res.status(500).json({ 
            success: false,
            message: 'Error deleting surplus food', 
            error: error.message 
        });
    }
};

module.exports = {
    createSurplus,
    getAllSurplus,
    getSurplusById,
    deleteSurplus
};
