const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { goalValidation } = require('../validations/schemas');

// Get all goals for a user
router.get('/', auth, async (req, res) => {
  try {
    const { type, status, priority } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const goals = await Goal.find(query)
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get goal statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Goal.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          completed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'completed'] }, 1, 0]
            }
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0]
            }
          }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new goal
router.post('/', auth, goalValidation.create, validate, async (req, res) => {
  try {
    const goal = new Goal({
      ...req.body,
      user: req.user._id
    });

    await goal.save();
    res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific goal
router.get('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update a goal
router.put('/:id', auth, goalValidation.update, validate, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'type', 'target', 'targetDate', 'description', 'priority', 'milestones', 'reminders'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => {
      goal[update] = req.body[update];
    });

    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a goal
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update goal progress
router.post('/:id/progress', auth, async (req, res) => {
  try {
    const { value } = req.body;
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await goal.updateProgress(value);
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add milestone
router.post('/:id/milestones', auth, async (req, res) => {
  try {
    const { title, targetValue, deadline } = req.body;
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await goal.addMilestone(title, targetValue, deadline);
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Complete milestone
router.post('/:id/milestones/:milestoneId/complete', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await goal.completeMilestone(req.params.milestoneId);
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add reminder
router.post('/:id/reminders', auth, async (req, res) => {
  try {
    const { title, date, type } = req.body;
    const goal = await Goal.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    await goal.addReminder(title, date, type);
    res.json(goal);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 