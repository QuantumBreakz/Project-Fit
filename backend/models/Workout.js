const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['strength', 'cardio', 'flexibility', 'hiit', 'custom']
    },
    exercises: [{
        exercise: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Exercise'
        },
        sets: [{
            reps: Number,
            weight: Number,
            duration: Number,
            distance: Number,
            notes: String
        }],
        notes: String
    }],
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    caloriesBurned: {
        type: Number,
        default: 0
    },
    difficulty: {
        type: String,
        required: true,
        enum: ['beginner', 'intermediate', 'advanced']
    },
    date: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Calculate total calories burned
workoutSchema.methods.calculateCaloriesBurned = function() {
    // Basic calculation based on duration and type
    const baseCaloriesPerMinute = {
        strength: 5,
        cardio: 8,
        flexibility: 3,
        hiit: 10,
        custom: 6
    };

    return this.duration * baseCaloriesPerMinute[this.type];
};

// Pre-save middleware to calculate calories burned
workoutSchema.pre('save', function(next) {
    if (this.isModified('duration') || this.isModified('type')) {
        this.caloriesBurned = this.calculateCaloriesBurned();
    }
    next();
});

// Method to mark workout as completed
workoutSchema.methods.complete = function(rating, feedback) {
    this.completed = true;
    this.completedAt = new Date();
    if (rating) this.rating = rating;
    if (feedback) this.feedback = feedback;
    return this.save();
};

// Index for efficient querying
workoutSchema.index({ user: 1, date: -1 });

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout; 