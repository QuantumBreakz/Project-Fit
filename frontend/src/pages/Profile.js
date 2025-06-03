import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Box,
  Divider,
  Switch,
  FormControlLabel,
  MenuItem,
  Alert,
  useTheme,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon
} from '@mui/icons-material';
import axios from 'axios';

const Profile = () => {
  const theme = useTheme();
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    profile: {
      height: '',
      weight: '',
      age: '',
      gender: '',
      activityLevel: ''
    },
    preferences: {
      theme: 'light',
      notifications: {
        email: true,
        push: true
      },
      units: {
        weight: 'kg',
        height: 'cm'
      }
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editing, setEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(null);

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary' },
    { value: 'light', label: 'Lightly Active' },
    { value: 'moderate', label: 'Moderately Active' },
    { value: 'active', label: 'Active' },
    { value: 'very_active', label: 'Very Active' }
  ];

  const genders = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setTempProfile(JSON.parse(JSON.stringify(profile)));
    setEditing(true);
  };

  const handleCancel = () => {
    setTempProfile(null);
    setEditing(false);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        tempProfile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProfile(tempProfile);
      setEditing(false);
      setTempProfile(null);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setTempProfile({
        ...tempProfile,
        [parent]: {
          ...tempProfile[parent],
          [child]: value
        }
      });
    } else {
      setTempProfile({
        ...tempProfile,
        [field]: value
      });
    }
  };

  const handlePreferenceChange = (section, field, value) => {
    setTempProfile({
      ...tempProfile,
      preferences: {
        ...tempProfile.preferences,
        [section]: {
          ...tempProfile.preferences[section],
          [field]: value
        }
      }
    });
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:5000/api/users/avatar',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setProfile({ ...profile, avatar: response.data.avatar });
        setSuccess('Profile picture updated successfully');
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        setError('Failed to upload profile picture');
      }
    }
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

  const currentProfile = editing ? tempProfile : profile;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" component="h1" gutterBottom>
            Profile Settings
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        {success && (
          <Grid item xs={12}>
            <Alert severity="success" onClose={() => setSuccess(null)}>
              {success}
            </Alert>
          </Grid>
        )}

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 3
                }}
              >
                <Avatar
                  src={currentProfile.avatar}
                  sx={{
                    width: 120,
                    height: 120,
                    mb: 2,
                    border: `4px solid ${theme.palette.primary.main}`
                  }}
                />
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <label htmlFor="avatar-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCameraIcon />}
                  >
                    Change Photo
                  </Button>
                </label>
              </Box>
              <Typography variant="h6" align="center" gutterBottom>
                {currentProfile.username}
              </Typography>
              <Typography variant="body2" color="textSecondary" align="center">
                {currentProfile.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6">Personal Information</Typography>
                {!editing ? (
                  <Button
                    startIcon={<EditIcon />}
                    onClick={handleEdit}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                ) : (
                  <Box>
                    <Button
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                      variant="contained"
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      startIcon={<CancelIcon />}
                      onClick={handleCancel}
                      variant="outlined"
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    value={currentProfile.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={currentProfile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={!editing}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Height"
                    type="number"
                    value={currentProfile.profile.height}
                    onChange={(e) => handleChange('profile.height', e.target.value)}
                    disabled={!editing}
                    InputProps={{
                      endAdornment: (
                        <Typography variant="body2" color="textSecondary">
                          {currentProfile.preferences.units.height}
                        </Typography>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Weight"
                    type="number"
                    value={currentProfile.profile.weight}
                    onChange={(e) => handleChange('profile.weight', e.target.value)}
                    disabled={!editing}
                    InputProps={{
                      endAdornment: (
                        <Typography variant="body2" color="textSecondary">
                          {currentProfile.preferences.units.weight}
                        </Typography>
                      )
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Gender"
                    value={currentProfile.profile.gender}
                    onChange={(e) => handleChange('profile.gender', e.target.value)}
                    disabled={!editing}
                  >
                    {genders.map((option) => (
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
                    label="Activity Level"
                    value={currentProfile.profile.activityLevel}
                    onChange={(e) => handleChange('profile.activityLevel', e.target.value)}
                    disabled={!editing}
                  >
                    {activityLevels.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Theme"
                    value={currentProfile.preferences.theme}
                    onChange={(e) => handlePreferenceChange('theme', 'theme', e.target.value)}
                    disabled={!editing}
                  >
                    <MenuItem value="light">Light</MenuItem>
                    <MenuItem value="dark">Dark</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Weight Unit"
                    value={currentProfile.preferences.units.weight}
                    onChange={(e) => handlePreferenceChange('units', 'weight', e.target.value)}
                    disabled={!editing}
                  >
                    <MenuItem value="kg">Kilograms (kg)</MenuItem>
                    <MenuItem value="lbs">Pounds (lbs)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    select
                    label="Height Unit"
                    value={currentProfile.preferences.units.height}
                    onChange={(e) => handlePreferenceChange('units', 'height', e.target.value)}
                    disabled={!editing}
                  >
                    <MenuItem value="cm">Centimeters (cm)</MenuItem>
                    <MenuItem value="ft">Feet (ft)</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle1" gutterBottom>
                    Notifications
                  </Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={currentProfile.preferences.notifications.email}
                        onChange={(e) =>
                          handlePreferenceChange('notifications', 'email', e.target.checked)
                        }
                        disabled={!editing}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={currentProfile.preferences.notifications.push}
                        onChange={(e) =>
                          handlePreferenceChange('notifications', 'push', e.target.checked)
                        }
                        disabled={!editing}
                      />
                    }
                    label="Push Notifications"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 