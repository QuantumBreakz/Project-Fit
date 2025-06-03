import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  Chip,
  Tooltip,
  Fab,
  LinearProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FitnessCenter as FitnessCenterIcon,
  Timer as TimerIcon,
  LocalFireDepartment as FireIcon
} from '@mui/icons-material';
import axios from 'axios';

const workoutTypes = [
  { value: 'strength', label: 'Strength Training' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'hiit', label: 'HIIT' },
  { value: 'custom', label: 'Custom' },
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const Workouts = () => {
  const theme = useTheme();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'strength',
    duration: '',
    difficulty: 'intermediate',
    notes: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/workouts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWorkouts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (workout = null) => {
    if (workout) {
      setSelectedWorkout(workout);
      setFormData({
        name: workout.name,
        type: workout.type,
        duration: workout.duration,
        difficulty: workout.difficulty,
        notes: workout.notes || '',
      });
    } else {
      setSelectedWorkout(null);
      setFormData({
        name: '',
        type: 'strength',
        duration: '',
        difficulty: 'intermediate',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWorkout(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        duration: Number(formData.duration),
        exercises: [],
      };
      if (selectedWorkout) {
        await axios.put(
          `http://localhost:5000/api/workouts/${selectedWorkout._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/workouts',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchWorkouts();
      if (window.refreshDashboard) window.refreshDashboard();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'Error saving workout');
      console.error('Error saving workout:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workout?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/workouts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchWorkouts();
      } catch (error) {
        console.error('Error deleting workout:', error);
      }
    }
  };

  const columns = [
    { field: 'name', headerName: 'Workout', flex: 1 },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={
            params.value === 'strength'
              ? 'primary'
              : params.value === 'cardio'
              ? 'secondary'
              : params.value === 'flexibility'
              ? 'success'
              : 'warning'
          }
          size="small"
        />
      ),
    },
    {
      field: 'duration',
      headerName: 'Duration',
      flex: 1,
      renderCell: (params) => `${params.value} min`,
    },
    {
      field: 'difficulty',
      headerName: 'Difficulty',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={
            params.value === 'beginner'
              ? 'success'
              : params.value === 'intermediate'
              ? 'warning'
              : 'error'
          }
          size="small"
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <IconButton
            size="small"
            onClick={() => handleOpenDialog(params.row)}
            sx={{ color: theme.palette.primary.main }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => handleDelete(params.row._id)}
            sx={{ color: theme.palette.error.main }}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ width: '100%', mt: 4 }}>
        <LinearProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Workouts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
          }}
        >
          New Workout
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
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
                <Typography variant="h6">Total Workouts</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {workouts.length}
              </Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    backgroundColor: theme.palette.secondary.light + '20',
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <TimerIcon sx={{ color: theme.palette.secondary.main }} />
                </Box>
                <Typography variant="h6">Total Time</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {workouts.reduce((acc, workout) => acc + workout.duration, 0)} min
              </Typography>
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
                <Typography variant="h6">Calories Burned</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {workouts.reduce((acc, workout) => acc + (workout.caloriesBurned || 0), 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Workouts Table */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          >
            <CardContent>
              <DataGrid
                rows={workouts}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                autoHeight
                disableSelectionOnClick
                getRowId={(row) => row._id}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none',
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Add/Edit Workout Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle>
          {selectedWorkout ? 'Edit Workout' : 'New Workout'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
            )}
            <TextField
              fullWidth
              label="Workout Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Workout Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              margin="normal"
              required
              sx={{ mb: 2 }}
            >
              {workoutTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Duration (minutes)"
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Difficulty"
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
              margin="normal"
              required
              sx={{ mb: 2 }}
            >
              {difficultyLevels.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              margin="normal"
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              px: 3,
            }}
          >
            {selectedWorkout ? 'Save Changes' : 'Create Workout'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Add */}
      <Tooltip title="Quick Add Workout">
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            borderRadius: 2,
          }}
          onClick={() => handleOpenDialog()}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Container>
  );
};

export default Workouts; 