const mongoose = require('mongoose');

const surplusFoodSchema = new mongoose.Schema({
    dishName: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0.1
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        required: true,
        trim: true
    },
    notes: {
        type: String,
        default: ''
    },
    expiresIn: {
        type: Number,
        required: true,
        min: 1
    },
    estimatedPeople: {
        type: Number,
        default: 0
    },
    provider: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Pre-save middleware to calculate estimated people and expiry time
surplusFoodSchema.pre('save', function () {
    // Calculate estimated people (1 person = 0.4 kg)
    this.estimatedPeople = Math.floor(this.quantity / 0.4);

    // Calculate expiry timestamp
    this.expiresAt = new Date(Date.now() + this.expiresIn * 60 * 60 * 1000);
});

module.exports = mongoose.model('SurplusFood', surplusFoodSchema);
