# Project-Fit: Fitness Tracking Application

A comprehensive fitness tracking application that helps users manage their workouts, nutrition, and fitness goals.

## Features

- **User Authentication**: Secure login and registration system
- **Workout Management**: Track and manage different types of workouts
- **Exercise Library**: Browse and save favorite exercises
- **Nutrition Tracking**: Log meals and track nutritional intake
- **Goal Setting**: Set and track fitness goals with milestones
- **Progress Visualization**: View progress through charts and statistics
- **Profile Management**: Customize user profile and preferences

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- React Router
- Axios
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Express Validator

## Project Structure & File Explanations

### Root Directory
- `README.md`: Project documentation and setup instructions.
- `package.json`: Project metadata and scripts (for backend).
- `frontend/`: Contains all frontend (React) code.
- `backend/`: Contains all backend (Node.js/Express) code.

### Frontend (`frontend/`)
- `package.json`: Frontend dependencies and scripts.
- `public/`: Static files for React (HTML, manifest, favicon, robots.txt).
- `src/`: Main source code for the React app.
  - `index.js`: Entry point for the React app.
  - `App.js`: Main app component, sets up routing and theming.
  - `styles/theme.js`: Custom Material-UI theme configuration.
  - `contexts/AuthContext.js`: React context for authentication state and logic.
  - `components/`: Shared UI components (e.g., `Layout.js`, `PrivateRoute.js`).
  - `pages/`: Main pages/views of the app:
    - `Dashboard.js`: User dashboard with stats and charts.
    - `Workouts.js`: Manage and track workouts.
    - `Exercises.js`: Exercise library and management.
    - `Nutrition.js`: Meal and nutrition tracking.
    - `Goals.js`: Set and track fitness goals.
    - `Profile.js`: User profile and preferences.
    - `Progress.js`: Visualize progress over time.
    - `Login.js`, `Register.js`: Authentication pages.

### Backend (`backend/`)
- `server.js`: Main Express server setup and entry point.
- `package.json`: Backend dependencies and scripts.
- `.env.example`: Example environment variables.
- `routes/`: Express route handlers for API endpoints:
  - `auth.js`: Authentication (register, login, current user).
  - `users.js`: User profile, avatar, and weight history.
  - `workouts.js`: CRUD for workouts.
  - `exercises.js`: CRUD for exercises.
  - `nutrition.js`: CRUD for meals/nutrition.
  - `goals.js`: CRUD for goals and progress.
  - `dashboard.js`: Aggregated dashboard data for the frontend.
- `models/`: Mongoose models for MongoDB:
  - `User.js`: User schema and methods.
  - `Workout.js`: Workout schema and methods.
  - `Exercise.js`: Exercise schema and methods.
  - `Nutrition.js`: Nutrition/meal schema and methods.
  - `Goal.js`: Goal schema and methods.
- `middleware/`: Express middleware:
  - `auth.js`: JWT authentication middleware.
  - `validate.js`: Request validation middleware.
  - `error.js`: Error handling middleware.
- `validations/`: Input validation schemas using express-validator:
  - `schemas.js`: All validation rules for users, workouts, exercises, nutrition, and goals.

---

For more details, see the comments in each file or ask for a specific file explanation.

## Project Structure

```
project-fit/
├── frontend/           # React frontend application
├── backend/           # Node.js backend server
├── docs/             # Project documentation
└── README.md         # Project overview
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/project-fit.git
   cd project-fit
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Set up environment variables:
   - Create `.env` files in both frontend and backend directories
   - See `.env.example` files for required variables

5. Start the development servers:

   Frontend:
   ```bash
   cd frontend
   npm start
   ```

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

## API Documentation

The API documentation is available in the `docs/api.md` file. It includes detailed information about all available endpoints, request/response formats, and authentication requirements.

## Testing

Run tests for both frontend and backend:

```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/project-fit](https://github.com/yourusername/project-fit) 