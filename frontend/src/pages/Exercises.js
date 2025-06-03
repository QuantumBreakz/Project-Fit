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
  Tabs,
  Tab,
  InputAdornment,
  Tooltip,
  Fab,
  LinearProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  FitnessCenter as StrengthIcon,
  DirectionsRun as RunIcon,
  Pool as SwimIcon,
  DirectionsBike as BikeIcon
} from '@mui/icons-material';
import axios from 'axios';

const exerciseCategories = [
  { value: 'strength', label: 'Strength Training', icon: <StrengthIcon /> },
  { value: 'cardio', label: 'Cardio', icon: <RunIcon /> },
  { value: 'swimming', label: 'Swimming', icon: <SwimIcon /> },
  { value: 'cycling', label: 'Cycling', icon: <BikeIcon /> },
];

const muscleGroups = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Core',
  'Full Body',
];

const difficultyLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const Exercises = () => {
  const theme = useTheme();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'strength',
    muscleGroup: '',
    difficulty: 'intermediate',
    description: '',
    instructions: '',
    equipment: '',
    videoUrl: '',
  });

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/exercises', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExercises(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching exercises:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (exercise = null) => {
    if (exercise) {
      setSelectedExercise(exercise);
      setFormData({
        name: exercise.name,
        category: exercise.category,
        muscleGroup: exercise.muscleGroup,
        difficulty: exercise.difficulty,
        description: exercise.description || '',
        instructions: exercise.instructions || '',
        equipment: exercise.equipment || '',
        videoUrl: exercise.videoUrl || '',
      });
    } else {
      setSelectedExercise(null);
      setFormData({
        name: '',
        category: 'strength',
        muscleGroup: '',
        difficulty: 'intermediate',
        description: '',
        instructions: '',
        equipment: '',
        videoUrl: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedExercise(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (selectedExercise) {
        await axios.put(
          `http://localhost:5000/api/exercises/${selectedExercise._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/exercises',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchExercises();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving exercise:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/exercises/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchExercises();
      } catch (error) {
        console.error('Error deleting exercise:', error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const filteredExercises = exercises.filter((exercise) => {
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    { field: 'name', headerName: 'Exercise', flex: 1 },
    {
      field: 'category',
      headerName: 'Category',
      flex: 1,
      renderCell: (params) => (
        <Chip
          icon={exerciseCategories.find(cat => cat.value === params.value)?.icon}
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={
            params.value === 'strength'
              ? 'primary'
              : params.value === 'cardio'
              ? 'secondary'
              : params.value === 'swimming'
              ? 'info'
              : 'success'
          }
          size="small"
        />
      ),
    },
    {
      field: 'muscleGroup',
      headerName: 'Muscle Group',
      flex: 1,
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
          Exercises
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
          Add Exercise
        </Button>
      </Box>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          mb: 4,
        }}
      >
        <CardContent>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              mb: 3,
            }}
          >
            <Tab label="Exercise Library" />
            <Tab label="My Exercises" />
            <Tab label="Favorites" />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search exercises..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              onClick={() => setSelectedCategory(selectedCategory === 'all' ? 'strength' : 'all')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3,
              }}
            >
              Filter
            </Button>
          </Box>

          <DataGrid
            rows={filteredExercises}
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

      {/* Add/Edit Exercise Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
          },
        }}
      >
        <DialogTitle>
          {selectedExercise ? 'Edit Exercise' : 'Add New Exercise'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Exercise Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  {exerciseCategories.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Muscle Group"
                  value={formData.muscleGroup}
                  onChange={(e) => setFormData({ ...formData, muscleGroup: e.target.value })}
                  required
                >
                  {muscleGroups.map((group) => (
                    <MenuItem key={group} value={group}>
                      {group}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Difficulty"
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  required
                >
                  {difficultyLevels.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Equipment"
                  value={formData.equipment}
                  onChange={(e) => setFormData({ ...formData, equipment: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions"
                  multiline
                  rows={4}
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Video URL"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                />
              </Grid>
            </Grid>
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
            {selectedExercise ? 'Save Changes' : 'Add Exercise'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Add */}
      <Tooltip title="Quick Add Exercise">
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

export default Exercises; 