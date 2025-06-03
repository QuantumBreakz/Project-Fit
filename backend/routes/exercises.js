const express = require('express');
const router = express.Router();
const Exercise = require('../models/Exercise');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { exerciseValidation } = require('../validations/schemas');

// Get all exercises
router.get('/', auth, async (req, res) => {
  try {
    const { category, muscleGroup, difficulty, search } = req.query;
    const query = {};

    if (category) query.category = category;
    if (muscleGroup) query.muscleGroup = muscleGroup;
    if (difficulty) query.difficulty = difficulty;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const exercises = await Exercise.find(query)
      .sort({ name: 1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get exercise categories
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Exercise.distinct('category');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get muscle groups
router.get('/muscle-groups', auth, async (req, res) => {
  try {
    const muscleGroups = await Exercise.distinct('muscleGroup');
    res.json(muscleGroups);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new exercise
router.post('/', auth, exerciseValidation.create, validate, async (req, res) => {
  try {
    const exercise = new Exercise({
      ...req.body,
      createdBy: req.user._id,
      isCustom: true
    });

    await exercise.save();
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific exercise
router.get('/:id', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update an exercise
router.put('/:id', auth, exerciseValidation.update, validate, async (req, res) => {
  try {
    const exercise = await Exercise.findOne({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'category', 'muscleGroup', 'difficulty', 'description', 'instructions', 'equipment', 'videoUrl'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => {
      exercise[update] = req.body[update];
    });

    await exercise.save();
    res.json(exercise);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete an exercise
router.delete('/:id', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id
    });

    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle favorite status
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }

    const isFavorite = exercise.favorites.includes(req.user._id);
    if (isFavorite) {
      await exercise.removeFromFavorites(req.user._id);
    } else {
      await exercise.addToFavorites(req.user._id);
    }

    res.json({ isFavorite: !isFavorite });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's favorite exercises
router.get('/favorites', auth, async (req, res) => {
  try {
    const exercises = await Exercise.find({ favorites: req.user._id })
      .sort({ name: 1 });
    res.json(exercises);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 