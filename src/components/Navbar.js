import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Link,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
} from '@mui/icons-material';

function Navbar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Link href="/" sx={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography variant="h6" component="div">
              Wikipedia
            </Typography>
          </Link>
        </Box>

        {/* Center Section - Search */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            display: 'flex',
            alignItems: 'center',
            maxWidth: 600,
            width: '100%',
            mx: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid #a2a9b1',
              borderRadius: 1,
              width: '100%',
            }}
          >
            <InputBase
              placeholder="Search Wikipedia"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
            <IconButton type="submit" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<PersonIcon />}
            color="inherit"
            sx={{ mr: 1 }}
            onClick={() => navigate('/create-account')}
          >
            Create account
          </Button>
          <Button
            color="inherit"
            onClick={() => navigate('/login')}
          >
            Log in
          </Button>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={() => { navigate('/'); handleMenuClose(); }}>
              Main Page
            </MenuItem>
            <MenuItem onClick={() => { navigate('/contents'); handleMenuClose(); }}>
              Contents
            </MenuItem>
            <MenuItem onClick={() => { navigate('/featured'); handleMenuClose(); }}>
              Featured Content
            </MenuItem>
            <MenuItem onClick={() => { navigate('/current-events'); handleMenuClose(); }}>
              Current Events
            </MenuItem>
            <MenuItem onClick={() => { navigate('/random'); handleMenuClose(); }}>
              Random Article
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 