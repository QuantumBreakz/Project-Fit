const mongoose = require('mongoose');

const nutritionSchema = new mongoose.Schema({
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
        enum: ['breakfast', 'lunch', 'dinner', 'snack']
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    },
    protein: {
        type: Number,
        required: true,
        min: 0
    },
    carbs: {
        type: Number,
        required: true,
        min: 0
    },
    fat: {
        type: Number,
        required: true,
        min: 0
    },
    notes: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isFavorite: {
        type: Boolean,
        default: false
    },
    ingredients: [{
        name: String,
        amount: Number,
        unit: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fat: Number
    }],
    mealPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MealPlan'
    }
}, {
    timestamps: true
});

// Calculate total macros
nutritionSchema.methods.calculateMacros = function() {
    if (this.ingredients && this.ingredients.length > 0) {
        this.calories = this.ingredients.reduce((sum, ing) => sum + (ing.calories || 0), 0);
        this.protein = this.ingredients.reduce((sum, ing) => sum + (ing.protein || 0), 0);
        this.carbs = this.ingredients.reduce((sum, ing) => sum + (ing.carbs || 0), 0);
        this.fat = this.ingredients.reduce((sum, ing) => sum + (ing.fat || 0), 0);
    }
};

// Pre-save middleware to calculate macros
nutritionSchema.pre('save', function(next) {
    if (this.isModified('ingredients')) {
        this.calculateMacros();
    }
    next();
});

// Static method to get daily nutrition summary
nutritionSchema.statics.getDailySummary = async function(userId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const meals = await this.find({
        user: userId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay
        }
    });

    return {
        totalCalories: meals.reduce((sum, meal) => sum + meal.calories, 0),
        totalProtein: meals.reduce((sum, meal) => sum + meal.protein, 0),
        totalCarbs: meals.reduce((sum, meal) => sum + meal.carbs, 0),
        totalFat: meals.reduce((sum, meal) => sum + meal.fat, 0),
        meals
    };
};

// Index for efficient querying
nutritionSchema.index({ user: 1, date: -1 });
nutritionSchema.index({ user: 1, type: 1 });

const Nutrition = mongoose.model('Nutrition', nutritionSchema);

module.exports = Nutrition; 