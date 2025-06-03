const express = require('express');
const router = express.Router();
const Nutrition = require('../models/Nutrition');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { nutritionValidation } = require('../validations/schemas');

// Get all meals for a user
router.get('/', auth, async (req, res) => {
  try {
    const { type, date, isFavorite } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (date) query.date = new Date(date);
    if (isFavorite) query.isFavorite = isFavorite === 'true';

    const meals = await Nutrition.find(query)
      .sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get nutrition statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Nutrition.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          totalCalories: { $sum: '$calories' },
          totalProtein: { $sum: '$protein' },
          totalCarbs: { $sum: '$carbs' },
          totalFat: { $sum: '$fat' },
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

// Get daily summary
router.get('/daily-summary', auth, async (req, res) => {
  try {
    const { date } = req.query;
    const summary = await Nutrition.getDailySummary(req.user._id, date || new Date());
    res.json(summary);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new meal
router.post('/', auth, nutritionValidation.create, validate, async (req, res) => {
  try {
    const meal = new Nutrition({
      ...req.body,
      user: req.user._id
    });

    await meal.save();
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific meal
router.get('/:id', auth, async (req, res) => {
  try {
    const meal = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json(meal);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a meal
router.put('/:id', auth, nutritionValidation.update, validate, async (req, res) => {
  try {
    const meal = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'type', 'calories', 'protein', 'carbs', 'fat', 'notes', 'ingredients', 'date'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => {
      meal[update] = req.body[update];
    });

    await meal.save();
    res.json(meal);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a meal
router.delete('/:id', auth, async (req, res) => {
  try {
    const meal = await Nutrition.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json({ message: 'Meal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Toggle favorite status
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const meal = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    meal.isFavorite = !meal.isFavorite;
    await meal.save();

    res.json({ isFavorite: meal.isFavorite });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's favorite meals
router.get('/favorites', auth, async (req, res) => {
  try {
    const meals = await Nutrition.find({
      user: req.user._id,
      isFavorite: true
    }).sort({ date: -1 });
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 