import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Link,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import { getFeaturedArticles, getRandomArticle } from '../services/wikipediaApi';

const sectionHeaderStyle = {
  fontWeight: 700,
  fontSize: '1.1rem',
  padding: '0.4em 0.7em',
  borderBottom: '1px solid #a2a9b1',
  background: '#eaf3e2',
  color: '#222',
  marginBottom: 0,
};
const newsHeaderStyle = {
  ...sectionHeaderStyle,
  background: '#cedff2',
};

function Home() {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [randomArticle, setRandomArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, random] = await Promise.all([
          getFeaturedArticles(),
          getRandomArticle(),
        ]);
        setFeaturedArticles(featured);
        setRandomArticle(random);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ p: { xs: 1, sm: 2, md: 3 }, fontFamily: 'Linux Libertine, Georgia, Times, serif', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Welcome Section */}
      <Paper elevation={0} sx={{ 
        mb: 3, 
        p: { xs: 1, sm: 2 }, 
        border: '1px solid #a2a9b1', 
        background: '#fff' 
      }}>
        <Typography variant="h1" sx={{ 
          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' }, 
          fontWeight: 400, 
          textAlign: 'center', 
          mb: 1 
        }}>
          Welcome to <Box component="span" sx={{ color: '#3366cc', fontWeight: 400 }}>Wikipedia</Box>,
        </Typography>
        <Typography variant="body1" sx={{ 
          textAlign: 'center', 
          color: '#222', 
          mb: 1,
          fontSize: { xs: '0.9rem', sm: '1rem' }
        }}>
          the <Box component="span" sx={{ color: '#3366cc' }}>free encyclopedia</Box> that <Box component="span" sx={{ color: '#006400' }}>anyone can edit</Box>.
        </Typography>
        <Typography variant="body2" sx={{ 
          textAlign: 'center', 
          color: '#222',
          fontSize: { xs: '0.8rem', sm: '0.9rem' }
        }}>
          <Box component="span" sx={{ color: '#3366cc' }}>117,298 active editors</Box> • 6,989,742 articles in <Box component="span" sx={{ color: '#3366cc' }}>English</Box>
        </Typography>
      </Paper>

      <Grid container spacing={{ xs: 2, md: 3 }}>
        {/* Left Column */}
        <Grid item xs={12} md={6}>
          {/* Featured Article */}
          <Paper elevation={0} sx={{ 
            border: '1px solid #a2a9b1', 
            background: '#f5fff5', 
            mb: 2 
          }}>
            <Box sx={sectionHeaderStyle}>From today's featured article</Box>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              p: { xs: 1, sm: 2 } 
            }}>
              {featuredArticles[0]?.image && (
                <CardMedia
                  component="img"
                  image={featuredArticles[0]?.image}
                  alt={featuredArticles[0]?.title}
                  sx={{ 
                    width: { xs: '100%', sm: 180 }, 
                    height: { xs: 200, sm: 120 }, 
                    objectFit: 'cover', 
                    mr: { xs: 0, sm: 2 }, 
                    mb: { xs: 2, sm: 0 }, 
                    border: '1px solid #a2a9b1' 
                  }}
                />
              )}
              <Box>
                <Typography variant="h3" sx={{ 
                  fontSize: { xs: '1rem', sm: '1.1rem' }, 
                  fontWeight: 700, 
                  mb: 1 
                }}>
                  <Link href={`/article/${encodeURIComponent(featuredArticles[0]?.title)}`} sx={{ color: '#0645ad' }}>
                    {featuredArticles[0]?.title}
                  </Link>
                </Typography>
                <Typography variant="body1" sx={{ 
                  color: '#222', 
                  fontSize: { xs: '0.9rem', sm: '1rem' } 
                }}>
                  {featuredArticles[0]?.extract}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* In the News */}
          <Paper elevation={0} sx={{ 
            border: '1px solid #a2a9b1', 
            background: '#f5faff', 
            mb: 2 
          }}>
            <Box sx={newsHeaderStyle}>In the news</Box>
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography variant="body1" sx={{ 
                color: '#222', 
                fontSize: { xs: '0.9rem', sm: '1rem' } 
              }}>
                {featuredArticles[1]?.extract}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={6}>
          {/* Did you know */}
          <Paper elevation={0} sx={{ 
            border: '1px solid #a2a9b1', 
            background: '#f5fff5', 
            mb: 2 
          }}>
            <Box sx={sectionHeaderStyle}>Did you know...</Box>
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography variant="body1" sx={{ 
                color: '#222', 
                fontSize: { xs: '0.9rem', sm: '1rem' } 
              }}>
                {featuredArticles[2]?.extract}
              </Typography>
            </Box>
          </Paper>

          {/* Random Article */}
          <Paper elevation={0} sx={{ 
            border: '1px solid #a2a9b1', 
            background: '#f5faff', 
            mb: 2 
          }}>
            <Box sx={newsHeaderStyle}>Random article</Box>
            <Box sx={{ p: { xs: 1, sm: 2 } }}>
              <Typography variant="body1" sx={{ 
                color: '#222', 
                fontSize: { xs: '0.9rem', sm: '1rem' } 
              }}>
                {randomArticle?.extract}
              </Typography>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 2 
              }}>
                <Link href={`/article/${encodeURIComponent(randomArticle?.title)}`} sx={{ color: '#0645ad' }}>
                  <CasinoIcon sx={{ mr: 1 }} />
                  Read another random article
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;