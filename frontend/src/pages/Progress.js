import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  useTheme,
  Tabs,
  Tab,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const Progress = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [stats, setStats] = useState({
    workouts: [],
    nutrition: [],
    weight: [],
    goals: []
  });

  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main
  ];

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [workoutsRes, nutritionRes, weightRes, goalsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/workouts/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/nutrition/stats', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/users/weight-history', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/goals/stats', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setStats({
        workouts: workoutsRes.data,
        nutrition: nutritionRes.data,
        weight: weightRes.data,
        goals: goalsRes.data
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch progress data');
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Progress Tracking
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3 }}
              >
                <Tab label="Workouts" />
                <Tab label="Nutrition" />
                <Tab label="Weight" />
                <Tab label="Goals" />
              </Tabs>

              {currentTab === 0 && (
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stats.workouts}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="caloriesBurned"
                        stroke={theme.palette.primary.main}
                        name="Calories Burned"
                      />
                      <Line
                        type="monotone"
                        dataKey="duration"
                        stroke={theme.palette.secondary.main}
                        name="Duration (minutes)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {currentTab === 1 && (
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.nutrition}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="calories"
                        fill={theme.palette.primary.main}
                        name="Calories"
                      />
                      <Bar
                        dataKey="protein"
                        fill={theme.palette.secondary.main}
                        name="Protein (g)"
                      />
                      <Bar
                        dataKey="carbs"
                        fill={theme.palette.success.main}
                        name="Carbs (g)"
                      />
                      <Bar
                        dataKey="fat"
                        fill={theme.palette.warning.main}
                        name="Fat (g)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {currentTab === 2 && (
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={stats.weight}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="weight"
                        stroke={theme.palette.primary.main}
                        name="Weight"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              )}

              {currentTab === 3 && (
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.goals}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={150}
                        label
                      >
                        {stats.goals.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Achievements
              </Typography>
              {stats.workouts.slice(0, 5).map((workout, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                    p: 1,
                    borderRadius: 1,
                    backgroundColor: theme.palette.background.default
                  }}
                >
                  <Typography variant="body1">{workout.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {workout.caloriesBurned} calories
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Goal Progress
              </Typography>
              {stats.goals.map((goal, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 2
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      mb: 1
                    }}
                  >
                    <Typography variant="body1">{goal.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {goal.progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={goal.progress}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: theme.palette.grey[200],
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                        backgroundColor: COLORS[index % COLORS.length]
                      }
                    }}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Progress; 