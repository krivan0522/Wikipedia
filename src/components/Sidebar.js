import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  Home as HomeIcon,
  List as ListIcon,
  Star as StarIcon,
  Help as HelpIcon,
  Group as GroupIcon,
  History as HistoryIcon,
  Upload as UploadIcon,
} from '@mui/icons-material';

function Sidebar({ featuredTitle, contentsTitle, currentEventsTitle, randomTitle, onClose }) {
  const navigationItems = [
    {
      title: 'Navigation',
      items: [
        { text: 'Main Page', icon: <HomeIcon />, to: '/' },
        {
          text: 'Contents',
          icon: <ListIcon />, 
          to: contentsTitle ? `/article/${encodeURIComponent(contentsTitle)}` : '/article/Contents',
        },
        {
          text: 'Featured Content',
          icon: <StarIcon />, 
          to: featuredTitle ? `/article/${encodeURIComponent(featuredTitle)}` : '/article/Featured_content',
        },
        {
          text: 'Current Events',
          icon: <StarIcon />, 
          to: currentEventsTitle ? `/article/${encodeURIComponent(currentEventsTitle)}` : '/article/Current_events',
        },
        {
          text: 'Random Article',
          icon: <StarIcon />, 
          to: randomTitle ? `/article/${encodeURIComponent(randomTitle)}` : '/article/Special:Random',
        },
      ],
    },
    {
      title: 'Contribute',
      items: [
        { text: 'Help', icon: <HelpIcon />, to: '/help' },
        { text: 'Learn to Edit', icon: <HelpIcon />, to: '/learn' },
        { text: 'Community Portal', icon: <GroupIcon />, to: '/community' },
        { text: 'Recent Changes', icon: <HistoryIcon />, to: '/recent-changes' },
        { text: 'Upload File', icon: <UploadIcon />, to: '/upload' },
      ],
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        overflowY: 'auto',
        backgroundColor: '#f6f6f6',
        p: 2,
      }}
    >
      {navigationItems.map((section, index) => (
        <Box key={section.title}>
          <Typography
            variant="subtitle2"
            sx={{
              color: '#54595d',
              textTransform: 'uppercase',
              fontWeight: 'bold',
              mt: index > 0 ? 2 : 0,
              mb: 1,
            }}
          >
            {section.title}
          </Typography>
          <List dense>
            {section.items.map((item) => (
              <ListItem
                key={item.text}
                component={RouterLink}
                to={item.to}
                onClick={onClose}
                sx={{
                  color: '#0645ad',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {item.icon}
                  <ListItemText
                    primary={item.text}
                    sx={{ ml: 1 }}
                  />
                </Box>
              </ListItem>
            ))}
          </List>
          {index < navigationItems.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}
    </Box>
  );
}

export default Sidebar; 