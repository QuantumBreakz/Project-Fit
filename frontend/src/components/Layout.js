import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  useMediaQuery,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  FitnessCenter as WorkoutIcon,
  DirectionsRun as ExerciseIcon,
  Restaurant as NutritionIcon,
  Flag as GoalIcon,
  Person as ProfileIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const drawerWidth = 280;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Workouts', icon: <WorkoutIcon />, path: '/workouts' },
  { text: 'Exercises', icon: <ExerciseIcon />, path: '/exercises' },
  { text: 'Nutrition', icon: <NutritionIcon />, path: '/nutrition' },
  { text: 'Goals', icon: <GoalIcon />, path: '/goals' },
];

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ px: 2, py: 3 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
          FitTrack
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flex: 1, px: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) handleDrawerToggle();
            }}
            sx={{
              borderRadius: 2,
              mb: 1,
              backgroundColor: location.pathname === item.path ? theme.palette.primary.light + '20' : 'transparent',
              color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.primary,
              '&:hover': {
                backgroundColor: theme.palette.primary.light + '20',
              },
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary,
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List sx={{ px: 2 }}>
        <ListItem
          button
          onClick={() => navigate('/profile')}
          sx={{
            borderRadius: 2,
            mb: 1,
            '&:hover': {
              backgroundColor: theme.palette.primary.light + '20',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: theme.palette.text.secondary }}>
            <ProfileIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          button
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            color: theme.palette.error.main,
            '&:hover': {
              backgroundColor: theme.palette.error.light + '20',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: theme.palette.error.main }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" sx={{ mr: 2 }}>
            <SettingsIcon />
          </IconButton>
          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{ ml: 2 }}
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: theme.palette.primary.main,
                fontSize: '1rem',
                fontWeight: 600,
              }}
            >
              {user?.username?.charAt(0).toUpperCase()}
            </Avatar>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                mt: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              },
            }}
          >
            <MenuItem onClick={() => {
              navigate('/profile');
              handleMenuClose();
            }}>
              <ListItemIcon>
                <ProfileIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={() => {
              navigate('/settings');
              handleMenuClose();
            }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: theme.palette.error.main }}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: theme.palette.background.default,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 