const { body } = require('express-validator');

const userValidation = {
  register: [
    body('username')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long')
  ],
  login: [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ],
  updateProfile: [
    body('username')
      .optional()
      .trim()
      .isLength({ min: 3 })
      .withMessage('Username must be at least 3 characters long'),
    body('email')
      .optional()
      .isEmail()
      .withMessage('Please enter a valid email'),
    body('profile.height')
      .optional()
      .isNumeric()
      .withMessage('Height must be a number'),
    body('profile.weight')
      .optional()
      .isNumeric()
      .withMessage('Weight must be a number'),
    body('profile.age')
      .optional()
      .isInt({ min: 13, max: 120 })
      .withMessage('Age must be between 13 and 120'),
    body('profile.gender')
      .optional()
      .isIn(['male', 'female', 'other'])
      .withMessage('Invalid gender value'),
    body('profile.activityLevel')
      .optional()
      .isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
      .withMessage('Invalid activity level')
  ]
};

const workoutValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Workout name is required'),
    body('type')
      .isIn(['strength', 'cardio', 'flexibility', 'hiit', 'other'])
      .withMessage('Invalid workout type'),
    body('duration')
      .isInt({ min: 1 })
      .withMessage('Duration must be at least 1 minute'),
    body('difficulty')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty level'),
    body('exercises')
      .isArray()
      .withMessage('Exercises must be an array')
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Workout name cannot be empty'),
    body('type')
      .optional()
      .isIn(['strength', 'cardio', 'flexibility', 'hiit', 'other'])
      .withMessage('Invalid workout type'),
    body('duration')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Duration must be at least 1 minute'),
    body('difficulty')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty level')
  ]
};

const exerciseValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Exercise name is required'),
    body('category')
      .isIn(['strength', 'cardio', 'swimming', 'cycling'])
      .withMessage('Invalid exercise category'),
    body('muscleGroup')
      .isIn(['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Full Body'])
      .withMessage('Invalid muscle group'),
    body('difficulty')
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty level'),
    body('description')
      .optional()
      .trim()
      .isLength({ min: 10 })
      .withMessage('Description must be at least 10 characters long')
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Exercise name cannot be empty'),
    body('category')
      .optional()
      .isIn(['strength', 'cardio', 'swimming', 'cycling'])
      .withMessage('Invalid exercise category'),
    body('muscleGroup')
      .optional()
      .isIn(['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Core', 'Full Body'])
      .withMessage('Invalid muscle group'),
    body('difficulty')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('Invalid difficulty level')
  ]
};

const nutritionValidation = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Meal name is required'),
    body('type')
      .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
      .withMessage('Invalid meal type'),
    body('calories')
      .isInt({ min: 0 })
      .withMessage('Calories must be a positive number'),
    body('protein')
      .isFloat({ min: 0 })
      .withMessage('Protein must be a positive number'),
    body('carbs')
      .isFloat({ min: 0 })
      .withMessage('Carbs must be a positive number'),
    body('fat')
      .isFloat({ min: 0 })
      .withMessage('Fat must be a positive number')
  ],
  update: [
    body('name')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Meal name cannot be empty'),
    body('type')
      .optional()
      .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
      .withMessage('Invalid meal type'),
    body('calories')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Calories must be a positive number'),
    body('protein')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Protein must be a positive number'),
    body('carbs')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Carbs must be a positive number'),
    body('fat')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Fat must be a positive number')
  ]
};

const goalValidation = {
  create: [
    body('title')
      .trim()
      .notEmpty()
      .withMessage('Goal title is required'),
    body('type')
      .isIn(['weight', 'workout', 'nutrition', 'strength', 'endurance', 'custom'])
      .withMessage('Invalid goal type'),
    body('target.value')
      .isNumeric()
      .withMessage('Target value must be a number'),
    body('target.unit')
      .trim()
      .notEmpty()
      .withMessage('Target unit is required'),
    body('targetDate')
      .isISO8601()
      .withMessage('Invalid target date format'),
    body('priority')
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority level')
  ],
  update: [
    body('title')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Goal title cannot be empty'),
    body('type')
      .optional()
      .isIn(['weight', 'workout', 'nutrition', 'strength', 'endurance', 'custom'])
      .withMessage('Invalid goal type'),
    body('target.value')
      .optional()
      .isNumeric()
      .withMessage('Target value must be a number'),
    body('target.unit')
      .optional()
      .trim()
      .notEmpty()
      .withMessage('Target unit cannot be empty'),
    body('targetDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid target date format'),
    body('priority')
      .optional()
      .isIn(['low', 'medium', 'high'])
      .withMessage('Invalid priority level')
  ]
};

module.exports = {
  userValidation,
  workoutValidation,
  exerciseValidation,
  nutritionValidation,
  goalValidation
}; 