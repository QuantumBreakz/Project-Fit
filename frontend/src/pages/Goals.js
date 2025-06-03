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
  LinearProgress,
  Box,
  Chip,
  Tooltip,
  useTheme,
  Fab,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Flag as FlagIcon,
  Timeline as TimelineIcon,
  Notifications as NotificationsIcon
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const Goals = () => {
  const theme = useTheme();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    type: '',
    target: {
      value: '',
      unit: ''
    },
    targetDate: '',
    description: '',
    priority: 'medium'
  });

  const goalTypes = [
    { value: 'weight', label: 'Weight Goal' },
    { value: 'workout', label: 'Workout Goal' },
    { value: 'nutrition', label: 'Nutrition Goal' },
    { value: 'strength', label: 'Strength Goal' },
    { value: 'endurance', label: 'Endurance Goal' },
    { value: 'custom', label: 'Custom Goal' }
  ];

  const priorities = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/goals', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGoals(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch goals');
      setLoading(false);
    }
  };

  const handleOpenDialog = (goal = null) => {
    if (goal) {
      setSelectedGoal(goal);
      setFormData({
        title: goal.title,
        type: goal.type,
        target: {
          value: goal.target.value,
          unit: goal.target.unit
        },
        targetDate: new Date(goal.targetDate).toISOString().split('T')[0],
        description: goal.description || '',
        priority: goal.priority
      });
    } else {
      setSelectedGoal(null);
      setFormData({
        title: '',
        type: '',
        target: {
          value: '',
          unit: ''
        },
        targetDate: '',
        description: '',
        priority: 'medium'
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedGoal(null);
    setFormData({
      title: '',
      type: '',
      target: {
        value: '',
        unit: ''
      },
      targetDate: '',
      description: '',
      priority: 'medium'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        target: {
          value: Number(formData.target.value),
          unit: formData.target.unit
        },
        targetDate: formData.targetDate ? new Date(formData.targetDate).toISOString().split('T')[0] : '',
        progress: {
          current: 0,
          unit: formData.target.unit,
          history: []
        }
      };
      if (selectedGoal) {
        await axios.put(
          `http://localhost:5000/api/goals/${selectedGoal._id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:5000/api/goals',
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      handleCloseDialog();
      fetchGoals();
    } catch (err) {
      setError('Failed to save goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/goals/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchGoals();
      } catch (err) {
        setError('Failed to delete goal');
      }
    }
  };

  const handleUpdateProgress = async (id, value) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/goals/${id}/progress`,
        { value },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchGoals();
    } catch (err) {
      setError('Failed to update progress');
    }
  };

  const columns = [
    { field: 'title', headerName: 'Goal', flex: 1 },
    { field: 'type', headerName: 'Type', width: 130 },
    {
      field: 'progress',
      headerName: 'Progress',
      width: 200,
      renderCell: (params) => {
        const current = params.row.progress?.current || 0;
        const target = params.row.target?.value || 1;
        const percent = target === 0 ? 0 : (current / target) * 100;
        return (
          <Box sx={{ width: '100%' }}>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: theme.palette.grey[200],
                '& .MuiLinearProgress-bar': {
                  borderRadius: 4
                }
              }}
            />
            <Typography variant="caption" sx={{ mt: 0.5 }}>
              {current} / {target} {params.row.target?.unit}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'completed'
              ? 'success'
              : params.value === 'active'
              ? 'primary'
              : 'error'
          }
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Update Progress">
            <IconButton
              onClick={() => handleUpdateProgress(params.row._id, params.row.progress.current + 1)}
              size="small"
            >
              <TimelineIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleOpenDialog(params.row)} size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(params.row._id)} size="small">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ];

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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Goals
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
              sx={{
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              Add Goal
            </Button>
          </Box>
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
              <DataGrid
                rows={goals}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10]}
                disableSelectionOnClick
                autoHeight
                getRowId={(row) => row._id}
                sx={{
                  border: 'none',
                  '& .MuiDataGrid-cell:focus': {
                    outline: 'none'
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedGoal ? 'Edit Goal' : 'Add New Goal'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Goal Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Goal Type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  required
                >
                  {goalTypes.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  required
                >
                  {priorities.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Target Value"
                  type="number"
                  value={formData.target.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target: { ...formData.target, value: e.target.value }
                    })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit"
                  value={formData.target.unit}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      target: { ...formData.target, unit: e.target.value }
                    })
                  }
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Target Date"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {selectedGoal ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => handleOpenDialog()}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16
        }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default Goals; 