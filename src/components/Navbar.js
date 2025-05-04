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
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  List as ListIcon,
  Star as StarIcon,
  Help as HelpIcon,
  Group as GroupIcon,
  History as HistoryIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuClick = (event) => {
    if (isMobile) {
      onMenuClick();
    } else {
      handleMenuOpen(event);
    }
  };

  const navigationItems = [
    { text: 'Main Page', icon: <HomeIcon />, to: '/' },
    { text: 'Contents', icon: <ListIcon />, to: '/contents' },
    { text: 'Featured Content', icon: <StarIcon />, to: '/featured' },
    { text: 'Current Events', icon: <StarIcon />, to: '/current-events' },
    { text: 'Random Article', icon: <StarIcon />, to: '/random' },
    { text: 'Help', icon: <HelpIcon />, to: '/help' },
    { text: 'Community Portal', icon: <GroupIcon />, to: '/community' },
    { text: 'Recent Changes', icon: <HistoryIcon />, to: '/recent-changes' },
    { text: 'Upload File', icon: <UploadIcon />, to: '/upload' },
  ];

  return (
    <>
      <AppBar position="static" color="default" elevation={0}>
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
          py: 1,
        }}>
          {/* Left Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            flex: isMobile ? '1 1 auto' : '0 1 auto',
            minWidth: isMobile ? '100%' : 'auto',
            order: isMobile ? 1 : 0,
          }}>
            <Link href="/" sx={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
              <img 
                src="/wiki.svg" 
                alt="Wikipedia" 
                style={{ height: '40px', marginRight: '8px' }} 
              />
              <Typography variant="h6" component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
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
              mx: isMobile ? 0 : 2,
              order: isMobile ? 3 : 1,
              flex: isMobile ? '1 1 100%' : '0 1 auto',
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
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            order: isMobile ? 2 : 2,
            flex: isMobile ? '0 1 auto' : '0 1 auto',
          }}>
            {!isMobile && (
              <>
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
              </>
            )}
            <IconButton
              edge="end"
              color="inherit"
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            {!isMobile && (
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                {navigationItems.map((item) => (
                  <MenuItem 
                    key={item.text}
                    onClick={() => { navigate(item.to); handleMenuClose(); }}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText>{item.text}</ListItemText>
                  </MenuItem>
                ))}
              </Menu>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            {navigationItems.map((item) => (
              <ListItem 
                button 
                key={item.text}
                onClick={() => navigate(item.to)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            <Divider />
            <ListItem button onClick={() => navigate('/create-account')}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Create account" />
            </ListItem>
            <ListItem button onClick={() => navigate('/login')}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Log in" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Navbar; 