const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['strength', 'cardio', 'swimming', 'cycling']
    },
    muscleGroup: {
        type: String,
        required: true,
        enum: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Full Body']
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    instructions: {
        type: String,
        required: true,
        trim: true
    },
    equipment: {
        type: String,
        trim: true
    },
    videoUrl: {
        type: String,
        trim: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isCustom: {
        type: Boolean,
        default: false
    },
    isPublic: {
        type: Boolean,
        default: true
    },
    favorites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    metadata: {
        caloriesPerMinute: Number,
        targetMuscles: [String],
        equipmentNeeded: [String],
        variations: [String]
    }
}, {
    timestamps: true
});

// Index for efficient searching
exerciseSchema.index({ name: 'text', description: 'text' });

// Method to add to favorites
exerciseSchema.methods.addToFavorites = function(userId) {
    if (!this.favorites.includes(userId)) {
        this.favorites.push(userId);
        return this.save();
    }
    return Promise.resolve(this);
};

// Method to remove from favorites
exerciseSchema.methods.removeFromFavorites = function(userId) {
    this.favorites = this.favorites.filter(id => id.toString() !== userId.toString());
    return this.save();
};

// Static method to find exercises by category
exerciseSchema.statics.findByCategory = function(category) {
    return this.find({ category, isPublic: true });
};

// Static method to find exercises by muscle group
exerciseSchema.statics.findByMuscleGroup = function(muscleGroup) {
    return this.find({ muscleGroup, isPublic: true });
};

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = Exercise; 