const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { workoutValidation } = require('../validations/schemas');

// Get all workouts for a user
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id })
      .populate('exercises.exercise')
      .sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get workout statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Workout.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalCalories: { $sum: '$caloriesBurned' },
          totalDuration: { $sum: '$duration' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new workout
router.post('/', auth, workoutValidation.create, validate, async (req, res) => {
  try {
    const workout = new Workout({
      ...req.body,
      user: req.user._id
    });

    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific workout
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('exercises.exercise');

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a workout
router.put('/:id', auth, workoutValidation.update, validate, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'type', 'duration', 'difficulty', 'exercises', 'notes'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => {
      workout[update] = req.body[update];
    });

    await workout.save();
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a workout
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete a workout
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const { rating, feedback } = req.body;
    await workout.complete(rating, feedback);

    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 