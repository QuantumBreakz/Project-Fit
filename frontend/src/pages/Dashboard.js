import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp as TrendingUpIcon,
  FitnessCenter as FitnessCenterIcon,
  LocalFireDepartment as FireIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalWorkouts: 0,
    totalExercises: 0,
    streakDays: 0,
    recentWorkouts: [],
    workoutDistribution: {
      strength: 0,
      cardio: 0,
      flexibility: 0,
      hiit: 0,
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
    window.refreshDashboard = fetchDashboardData;
    return () => { delete window.refreshDashboard; };
  }, []);

  const workoutChartData = {
    labels: stats.recentWorkouts.map(workout => 
      new Date(workout.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: 'Workout Duration (minutes)',
        data: stats.recentWorkouts.map(workout => workout.duration),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '20',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const workoutDistributionData = {
    labels: ['Strength', 'Cardio', 'Flexibility', 'HIIT'],
    datasets: [
      {
        data: [
          stats.workoutDistribution.strength,
          stats.workoutDistribution.cardio,
          stats.workoutDistribution.flexibility,
          stats.workoutDistribution.hiit,
        ],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.success.main,
          theme.palette.warning.main,
        ],
        borderWidth: 0,
      },
    ],
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.light + '20',
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <FitnessCenterIcon sx={{ color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  Total Workouts
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.totalWorkouts}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Keep up the great work!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: theme.palette.secondary.light + '20',
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <TrendingUpIcon sx={{ color: theme.palette.secondary.main }} />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  Total Exercises
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.totalExercises}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Variety is the key to success!
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              height: '100%',
              borderRadius: 4,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
              },
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: theme.palette.warning.light + '20',
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <FireIcon sx={{ color: theme.palette.warning.main }} />
                </Box>
                <Typography variant="h6" color="text.secondary">
                  Current Streak
                </Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {stats.streakDays}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.streakDays > 0 ? "You're on fire!" : 'Start your streak today!'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Recent Workouts
                </Typography>
                <Tooltip title="Shows your workout duration over time">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ height: 400 }}>
                <Line
                  data={workoutChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        grid: {
                          color: theme.palette.divider,
                        },
                      },
                      x: {
                        grid: {
                          display: false,
                        },
                      },
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                  Workout Distribution
                </Typography>
                <Tooltip title="Shows the distribution of your workout types">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ height: 400 }}>
                <Doughnut
                  data={workoutDistributionData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                      },
                    },
                    cutout: '70%',
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 