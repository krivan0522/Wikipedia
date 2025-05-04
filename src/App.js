import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Article from './components/Article';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import { getFeaturedArticles, getArticle, getRandomArticle, getNews } from './services/wikipediaApi';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0645ad',
    },
    background: {
      default: '#f6f6f6',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Linux Libertine", "Georgia", "Times", serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 400,
      borderBottom: '1px solid #a2a9b1',
      marginBottom: '0.5em',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 400,
      borderBottom: '1px solid #a2a9b1',
      marginBottom: '0.5em',
    },
  },
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: '#0645ad',
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        },
      },
    },
  },
});

function App() {
  const [featuredTitle, setFeaturedTitle] = useState('');
  const [contentsTitle, setContentsTitle] = useState('');
  const [currentEventsTitle, setCurrentEventsTitle] = useState('');
  const [randomTitle, setRandomTitle] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    getFeaturedArticles().then(articles => {
      if (articles && articles[0]) setFeaturedTitle(articles[0].title);
    });
    getArticle('Contents').then(article => {
      if (article && article.title) setContentsTitle(article.title);
    });
    getNews().then(article => {
      if (article && article.title) setCurrentEventsTitle(article.title);
    });
    getRandomArticle().then(article => {
      if (article && article.title) setRandomTitle(article.title);
    });
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar onMenuClick={toggleSidebar} />
          <Box sx={{ display: 'flex', flex: 1 }}>
            {(!isMobile || sidebarOpen) && (
              <Box
                sx={{
                  width: { xs: '100%', md: 220 },
                  flexShrink: 0,
                  position: isMobile ? 'fixed' : 'sticky',
                  top: 64,
                  left: 0,
                  height: isMobile ? '100%' : 'calc(100vh - 64px)',
                  zIndex: 1000,
                  backgroundColor: '#f6f6f6',
                  borderRight: '1px solid #a2a9b1',
                  overflowY: 'auto',
                }}
              >
                <Sidebar
                  featuredTitle={featuredTitle}
                  contentsTitle={contentsTitle}
                  currentEventsTitle={currentEventsTitle}
                  randomTitle={randomTitle}
                  onClose={isMobile ? toggleSidebar : undefined}
                />
              </Box>
            )}
            {isMobile && sidebarOpen && (
              <Box
                sx={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 999,
                }}
                onClick={toggleSidebar}
              />
            )}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                backgroundColor: '#ffffff',
                minHeight: 'calc(100vh - 64px)',
                ml: { xs: 0, md: sidebarOpen ? '220px' : 0 },
                transition: 'margin-left 0.2s',
              }}
            >
              <Routes>
                <Route path="/" element={<Home featuredTitle={featuredTitle} />} />
                <Route path="/article/:title" element={<Article />} />
                <Route path="/search" element={<SearchResults />} />
              </Routes>
            </Box>
          </Box>
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 