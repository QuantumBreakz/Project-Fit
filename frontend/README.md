# Project-Fit Frontend

The frontend application for Project-Fit, built with React and Material-UI.

## Features

- Modern, responsive UI using Material-UI components
- State management with Redux Toolkit
- Client-side routing with React Router
- Data visualization with Recharts
- Form handling and validation
- Real-time updates and notifications
- Dark/Light theme support

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── redux/         # Redux store and slices
│   ├── services/      # API services
│   ├── utils/         # Utility functions
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React context providers
│   ├── assets/        # Images, fonts, etc.
│   ├── styles/        # Global styles
│   ├── App.js         # Root component
│   └── index.js       # Entry point
├── package.json
└── README.md
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run lint`

Runs ESLint to check for code quality issues.

## Dependencies

- `@mui/material`: Material-UI components
- `@reduxjs/toolkit`: State management
- `react-router-dom`: Routing
- `axios`: HTTP client
- `recharts`: Data visualization
- `formik`: Form handling
- `yup`: Form validation
- `date-fns`: Date manipulation
- `jwt-decode`: JWT token handling

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## Component Documentation

### Pages

- `Dashboard`: Main dashboard with overview and statistics
- `Workouts`: Workout tracking and management
- `Exercises`: Exercise library and favorites
- `Nutrition`: Meal tracking and nutrition logging
- `Goals`: Goal setting and progress tracking
- `Profile`: User profile and settings
- `Progress`: Progress visualization and statistics

### Common Components

- `Layout`: Main layout with navigation
- `AuthForm`: Authentication forms
- `DataGrid`: Reusable data grid component
- `Charts`: Various chart components
- `Forms`: Reusable form components
- `Modals`: Dialog and modal components

## State Management

The application uses Redux Toolkit for state management. The store is organized into slices:

- `auth`: Authentication state
- `workouts`: Workout data
- `exercises`: Exercise library
- `nutrition`: Nutrition tracking
- `goals`: Goal management
- `ui`: UI state (theme, notifications)

## API Integration

API calls are handled through services in the `services` directory:

- `authService`: Authentication endpoints
- `workoutService`: Workout management
- `exerciseService`: Exercise library
- `nutritionService`: Nutrition tracking
- `goalService`: Goal management
- `userService`: User profile and settings

## Styling

The application uses Material-UI's theming system with custom theme configuration. Global styles are defined in `styles/theme.js`.

## Testing

Tests are written using Jest and React Testing Library. Run tests with:

```bash
npm test
```

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Update documentation as needed
4. Create meaningful commit messages 