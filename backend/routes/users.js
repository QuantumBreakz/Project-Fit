const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { userValidation } = require('../validations/schemas');

// Register a new user
router.post('/register', userValidation.register, validate, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user
router.post('/login', userValidation.login, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    res.json(req.user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, userValidation.updateProfile, validate, async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'profile', 'preferences'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ error: 'Invalid updates' });
    }

    updates.forEach(update => {
      req.user[update] = req.body[update];
    });

    await req.user.save();
    res.json(req.user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Upload profile picture
router.post('/avatar', auth, async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatar = req.files.avatar;
    const fileName = `${req.user._id}-${Date.now()}${path.extname(avatar.name)}`;
    const filePath = path.join(__dirname, '../uploads/avatars', fileName);

    await avatar.mv(filePath);
    req.user.avatar = `/uploads/avatars/${fileName}`;
    await req.user.save();

    res.json({ avatar: req.user.avatar });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get weight history
router.get('/weight-history', auth, async (req, res) => {
  try {
    const weightHistory = await User.findById(req.user._id)
      .select('weightHistory')
      .sort({ 'weightHistory.date': -1 });

    res.json(weightHistory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add weight record
router.post('/weight', auth, async (req, res) => {
  try {
    const { weight, date } = req.body;
    req.user.weightHistory.push({ weight, date: date || new Date() });
    await req.user.save();

    res.json(req.user.weightHistory);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 