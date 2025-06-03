const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise');
const Nutrition = require('../models/Nutrition');
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');

// GET /api/dashboard - Dashboard summary for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    // Total workouts
    const totalWorkouts = await Workout.countDocuments({ user: userId });
    // Total exercises
    const totalExercises = await Exercise.countDocuments({ createdBy: userId });
    // Streak (for demo, just count workouts in the last 7 days)
    const streakDays = await Workout.countDocuments({
      user: userId,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    // Recent workouts (last 7)
    const recentWorkouts = await Workout.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(7)
      .select('date duration');
    // Workout distribution
    const allWorkouts = await Workout.find({ user: userId });
    const workoutDistribution = {
      strength: allWorkouts.filter(w => w.type === 'strength').length,
      cardio: allWorkouts.filter(w => w.type === 'cardio').length,
      flexibility: allWorkouts.filter(w => w.type === 'flexibility').length,
      hiit: allWorkouts.filter(w => w.type === 'hiit').length,
    };

    // Nutrition summary
    const totalMeals = await Nutrition.countDocuments({ user: userId });
    const totalCalories = await Nutrition.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$calories' } } }
    ]);
    const calories = totalCalories[0]?.total || 0;

    // Goals summary
    const totalGoals = await Goal.countDocuments({ user: userId });
    const activeGoals = await Goal.countDocuments({ user: userId, status: 'active' });
    const completedGoals = await Goal.countDocuments({ user: userId, status: 'completed' });

    res.json({
      totalWorkouts,
      totalExercises,
      streakDays,
      recentWorkouts,
      workoutDistribution,
      nutrition: {
        totalMeals,
        calories
      },
      goals: {
        totalGoals,
        activeGoals,
        completedGoals
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 