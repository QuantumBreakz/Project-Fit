import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  useTheme,
  Fab,
  Tooltip,
  LinearProgress,
  Tabs,
  Tab,
  InputAdornment,
  Avatar,
  AvatarGroup,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Restaurant as RestaurantIcon,
  LocalDining as MealIcon,
  WaterDrop as WaterIcon,
  MonitorWeight as WeightIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
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

const mealTypes = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' },
];

const Nutrition = () => {
  const theme = useTheme();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: '',
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/nutrition', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMeals(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meals:', error);
      setLoading(false);
    }
  };

  const handleOpenDialog = (meal = null) => {
    if (meal) {
      setSelectedMeal(meal);
      setFormData({
        name: meal.name,
        type: meal.type,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        notes: meal.notes || '',
      });
    } else {
      setSelectedMeal(null);
      setFormData({
        name: '',
        type: 'breakfast',
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        notes: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMeal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (selectedMeal) {
        await axios.put(
          `http://localhost:5000/api/nutrition/${selectedMeal._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/nutrition',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchMeals();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving meal:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/nutrition/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchMeals();
      } catch (error) {
        console.error('Error deleting meal:', error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const filteredMeals = meals.filter((meal) => {
    const matchesSearch = meal.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedMealType === 'all' || meal.type === selectedMealType;
    return matchesSearch && matchesType;
  });

  const columns = [
    { field: 'name', headerName: 'Meal', flex: 1 },
    {
      field: 'type',
      headerName: 'Type',
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value.charAt(0).toUpperCase() + params.value.slice(1)}
          color={
            params.value === 'breakfast'
              ? 'primary'
              : params.value === 'lunch'
              ? 'secondary'
              : params.value === 'dinner'
              ? 'success'
              : 'warning'
          }
          size="small"
        />
      ),
    },
    {
      field: 'calories',
      headerName: 'Calories',
      flex: 1,
      renderCell: (params) => `${params.value} kcal`,
    },
    {
      field: 'protein',
      headerName: 'Protein',
      flex: 1,
      renderCell: (params) => `${params.value}g`,
    },
    {
      field: 'carbs',
      headerName: 'Carbs',
      flex: 1,
      renderCell: (params) => `${params.value}g`,
    },
    {
      field: 'fat',
      headerName: 'Fat',
      flex: 1,
      renderCell: (params) => `${params.value}g`,
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

  const nutritionChartData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [
      {
        data: [
          meals.reduce((acc, meal) => acc + meal.protein, 0),
          meals.reduce((acc, meal) => acc + meal.carbs, 0),
          meals.reduce((acc, meal) => acc + meal.fat, 0),
        ],
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.warning.main,
        ],
        borderWidth: 0,
      },
    ],
  };

  const caloriesChartData = {
    labels: meals.map(meal => meal.name),
    datasets: [
      {
        label: 'Calories',
        data: meals.map(meal => meal.calories),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '20',
        tension: 0.4,
        fill: true,
      },
    ],
  };

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
          Nutrition
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
          Add Meal
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} md={3}>
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
                  <RestaurantIcon sx={{ color: theme.palette.primary.main }} />
                </Box>
                <Typography variant="h6">Total Calories</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {meals.reduce((acc, meal) => acc + meal.calories, 0)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                kcal today
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
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
                  <MealIcon sx={{ color: theme.palette.secondary.main }} />
                </Box>
                <Typography variant="h6">Protein</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                {meals.reduce((acc, meal) => acc + meal.protein, 0)}g
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Daily intake
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
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
                    backgroundColor: theme.palette.success.light + '20',
                    borderRadius: 2,
                    p: 1,
                    mr: 2,
                  }}
                >
                  <WaterIcon sx={{ color: theme.palette.success.main }} />
                </Box>
                <Typography variant="h6">Water</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                2.5L
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Daily goal
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
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
                  <WeightIcon sx={{ color: theme.palette.warning.main }} />
                </Box>
                <Typography variant="h6">Weight</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                75kg
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current weight
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
              <Typography variant="h6" sx={{ mb: 3 }}>
                Daily Calories
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line
                  data={caloriesChartData}
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
              <Typography variant="h6" sx={{ mb: 3 }}>
                Macronutrients
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut
                  data={nutritionChartData}
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

        {/* Meals Table */}
        <Grid item xs={12}>
          <Card
            sx={{
              borderRadius: 4,
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
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
                <Tab label="Today's Meals" />
                <Tab label="Meal History" />
                <Tab label="Favorites" />
              </Tabs>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  placeholder="Search meals..."
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
                  onClick={() => setSelectedMealType(selectedMealType === 'all' ? 'breakfast' : 'all')}
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
                rows={filteredMeals}
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

      {/* Add/Edit Meal Dialog */}
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
          {selectedMeal ? 'Edit Meal' : 'Add New Meal'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Meal Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              margin="normal"
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              select
              label="Meal Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              margin="normal"
              required
              sx={{ mb: 2 }}
            >
              {mealTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Calories"
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Protein"
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">g</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Carbs"
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">g</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fat"
                  type="number"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                  margin="normal"
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">g</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
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
            {selectedMeal ? 'Save Changes' : 'Add Meal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Add */}
      <Tooltip title="Quick Add Meal">
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

export default Nutrition; 