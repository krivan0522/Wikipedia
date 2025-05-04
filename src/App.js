import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
import Article from './components/Article';
import SearchResults from './components/SearchResults';
import Footer from './components/Footer';
import { Box } from '@mui/material';
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <Box sx={{ display: 'flex', flex: 1 }}>
            <Box
              sx={{
                width: 220,
                flexShrink: 0,
                position: 'sticky',
                top: 0,
                height: 'calc(100vh - 64px)',
                overflowY: 'auto',
                borderRight: '1px solid #a2a9b1',
                backgroundColor: '#f6f6f6',
              }}
            >
              <Sidebar
                featuredTitle={featuredTitle}
                contentsTitle={contentsTitle}
                currentEventsTitle={currentEventsTitle}
                randomTitle={randomTitle}
              />
            </Box>
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                backgroundColor: '#ffffff',
                minHeight: 'calc(100vh - 64px)',
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