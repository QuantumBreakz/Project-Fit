const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['weight', 'workout', 'nutrition', 'strength', 'endurance', 'custom']
    },
    target: {
        value: {
            type: Number,
            required: true
        },
        unit: {
            type: String,
            required: true
        }
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    targetDate: {
        type: Date,
        required: true
    },
    progress: {
        current: {
            type: Number,
            default: 0
        },
        unit: {
            type: String,
            required: true
        },
        history: [{
            date: Date,
            value: Number,
            notes: String
        }]
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'abandoned'],
        default: 'active'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    description: {
        type: String,
        trim: true
    },
    milestones: [{
        title: String,
        targetValue: Number,
        achieved: {
            type: Boolean,
            default: false
        },
        achievedAt: Date
    }],
    reminders: [{
        date: Date,
        message: String,
        sent: {
            type: Boolean,
            default: false
        }
    }]
}, {
    timestamps: true
});

// Calculate progress percentage
goalSchema.methods.calculateProgress = function() {
    if (this.target.value === 0) return 0;
    return (this.progress.current / this.target.value) * 100;
};

// Update progress
goalSchema.methods.updateProgress = function(value, notes) {
    this.progress.current = value;
    this.progress.history.push({
        date: new Date(),
        value: value,
        notes: notes
    });

    // Check if goal is completed
    if (value >= this.target.value) {
        this.status = 'completed';
    }

    return this.save();
};

// Add milestone
goalSchema.methods.addMilestone = function(title, targetValue) {
    this.milestones.push({
        title,
        targetValue,
        achieved: false
    });
    return this.save();
};

// Mark milestone as achieved
goalSchema.methods.achieveMilestone = function(milestoneId) {
    const milestone = this.milestones.id(milestoneId);
    if (milestone) {
        milestone.achieved = true;
        milestone.achievedAt = new Date();
        return this.save();
    }
    return Promise.reject(new Error('Milestone not found'));
};

// Add reminder
goalSchema.methods.addReminder = function(date, message) {
    this.reminders.push({
        date,
        message,
        sent: false
    });
    return this.save();
};

// Static method to find active goals
goalSchema.statics.findActive = function(userId) {
    return this.find({
        user: userId,
        status: 'active',
        targetDate: { $gte: new Date() }
    });
};

// Index for efficient querying
goalSchema.index({ user: 1, status: 1, targetDate: 1 });
goalSchema.index({ user: 1, type: 1 });

const Goal = mongoose.model('Goal', goalSchema);

module.exports = Goal; 