# Project-Fit Backend

The backend server for Project-Fit, built with Node.js, Express, and MongoDB.

## Features

- RESTful API architecture
- JWT authentication
- Input validation
- Error handling middleware
- MongoDB integration with Mongoose
- File upload support
- Data aggregation and statistics
- API documentation

## Project Structure

```
backend/
├── config/             # Configuration files
├── controllers/        # Route controllers
├── middleware/         # Custom middleware
├── models/            # Mongoose models
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Utility functions
├── validations/       # Input validation schemas
├── uploads/           # File upload directory
├── tests/             # Test files
├── app.js            # Express app setup
└── server.js         # Server entry point
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Workouts
- `GET /api/workouts` - Get all workouts
- `POST /api/workouts` - Create workout
- `GET /api/workouts/:id` - Get specific workout
- `PUT /api/workouts/:id` - Update workout
- `DELETE /api/workouts/:id` - Delete workout
- `GET /api/workouts/stats` - Get workout statistics

### Exercises
- `GET /api/exercises` - Get all exercises
- `POST /api/exercises` - Create exercise
- `GET /api/exercises/:id` - Get specific exercise
- `PUT /api/exercises/:id` - Update exercise
- `DELETE /api/exercises/:id` - Delete exercise
- `GET /api/exercises/categories` - Get exercise categories

### Nutrition
- `GET /api/nutrition` - Get all meals
- `POST /api/nutrition` - Create meal
- `GET /api/nutrition/:id` - Get specific meal
- `PUT /api/nutrition/:id` - Update meal
- `DELETE /api/nutrition/:id` - Delete meal
- `GET /api/nutrition/stats` - Get nutrition statistics

### Goals
- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `GET /api/goals/:id` - Get specific goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal
- `POST /api/goals/:id/progress` - Update goal progress

## Dependencies

- `express`: Web framework
- `mongoose`: MongoDB ODM
- `jsonwebtoken`: JWT authentication
- `bcryptjs`: Password hashing
- `express-validator`: Input validation
- `multer`: File uploads
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables
- `morgan`: HTTP request logger
- `helmet`: Security headers

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/project-fit
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

## Database Schema

### User Model
- Basic info (username, email, password)
- Profile data (height, weight, age, etc.)
- Preferences (theme, notifications)
- Weight history

### Workout Model
- Basic info (name, type, duration)
- Exercises with sets and reps
- Completion status and feedback
- Statistics (calories, duration)

### Exercise Model
- Basic info (name, category, muscle group)
- Instructions and equipment
- Difficulty level
- Video/image references

### Nutrition Model
- Basic info (name, type, date)
- Nutritional values (calories, macros)
- Ingredients and portions
- Meal type and timing

### Goal Model
- Basic info (title, type, target)
- Progress tracking
- Milestones and deadlines
- Reminders and notifications

## Middleware

- `auth.js`: JWT authentication
- `validate.js`: Input validation
- `error.js`: Error handling
- `upload.js`: File upload handling

## Testing

Tests are written using Jest and Supertest. Run tests with:

```bash
npm test
```

## API Documentation

API documentation is available in the `docs/api.md` file. It includes:
- Endpoint descriptions
- Request/response formats
- Authentication requirements
- Error codes and messages

## Security

- JWT authentication
- Password hashing
- Input validation
- CORS configuration
- Security headers
- Rate limiting
- File upload restrictions

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update API documentation
4. Create meaningful commit messages 