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
    <Container maxWidth="lg" sx={{ fontFamily: 'Linux Libertine, Georgia, Times, serif', background: '#f8f9fa', minHeight: '100vh', py: 3 }}>
      {/* Welcome Section */}
      <Paper elevation={0} sx={{ mb: 3, p: 2, border: '1px solid #a2a9b1', background: '#fff' }}>
        <Typography variant="h1" sx={{ fontSize: '2.5rem', fontWeight: 400, textAlign: 'center', mb: 1 }}>
          Welcome to <Box component="span" sx={{ color: '#3366cc', fontWeight: 400 }}>Wikipedia</Box>,
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', color: '#222', mb: 1 }}>
          the <Box component="span" sx={{ color: '#3366cc' }}>free encyclopedia</Box> that <Box component="span" sx={{ color: '#006400' }}>anyone can edit</Box>.
        </Typography>
        <Typography variant="body2" sx={{ textAlign: 'center', color: '#222' }}>
          <Box component="span" sx={{ color: '#3366cc' }}>117,298 active editors</Box> • 6,989,742 articles in <Box component="span" sx={{ color: '#3366cc' }}>English</Box>
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {/* Featured Article */}
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ border: '1px solid #a2a9b1', background: '#f5fff5', mb: 2 }}>
            <Box sx={sectionHeaderStyle}>From today's featured article</Box>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, p: 2 }}>
              {featuredArticles[0]?.image && (
                <CardMedia
                  component="img"
                  image={featuredArticles[0]?.image}
                  alt={featuredArticles[0]?.title}
                  sx={{ width: 180, height: 120, objectFit: 'cover', mr: 2, mb: { xs: 2, sm: 0 }, border: '1px solid #a2a9b1' }}
                />
              )}
              <Box>
                <Typography variant="h3" sx={{ fontSize: '1.1rem', fontWeight: 700, mb: 1 }}>
                  <Link href={`/article/${encodeURIComponent(featuredArticles[0]?.title)}`} sx={{ color: '#0645ad' }}>
                    {featuredArticles[0]?.title}
                  </Link>
                </Typography>
                <Typography variant="body1" sx={{ color: '#222', fontSize: '1rem' }}>
                  {featuredArticles[0]?.extract}
                </Typography>
                <Link href={`/article/${encodeURIComponent(featuredArticles[0]?.title)}`} sx={{ color: '#0645ad', fontSize: '0.95rem' }}>
                  (Full article...)
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* In The News */}
        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ border: '1px solid #a2a9b1', background: '#f8fcff', mb: 2 }}>
            <Box sx={newsHeaderStyle}>In the news</Box>
            <Box sx={{ p: 2 }}>
              <List sx={{ pl: 2 }}>
                {featuredArticles.slice(1, 5).map((article) => (
                  <ListItem key={article.title} sx={{ display: 'list-item', listStyleType: 'disc', color: '#222', fontSize: '1rem', py: 0.5 }}>
                    <Link href={`/article/${encodeURIComponent(article.title)}`} sx={{ color: '#0645ad', fontWeight: 500 }}>
                      {article.title}
                    </Link>
                    {article.extract && <Box component="span" sx={{ color: '#222', ml: 0.5 }}>{article.extract}</Box>}
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Did You Know & On This Day */}
      <Grid container spacing={3} sx={{ mt: 0 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ border: '1px solid #a2a9b1', background: '#f5fff5', mb: 2 }}>
            <Box sx={sectionHeaderStyle}>Did you know ...</Box>
            <Box sx={{ p: 2 }}>
              <List sx={{ pl: 2 }}>
                {featuredArticles.slice(5, 8).map((article) => (
                  <ListItem key={article.title} sx={{ display: 'list-item', listStyleType: 'disc', color: '#222', fontSize: '1rem', py: 0.5 }}>
                    <Link href={`/article/${encodeURIComponent(article.title)}`} sx={{ color: '#0645ad', fontWeight: 500 }}>
                      {article.title}
                    </Link>
                    {article.extract && <Box component="span" sx={{ color: '#222', ml: 0.5 }}>{article.extract}</Box>}
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ border: '1px solid #a2a9b1', background: '#f8fcff', mb: 2 }}>
            <Box sx={newsHeaderStyle}>On this day</Box>
            <Box sx={{ p: 2 }}>
              <List sx={{ pl: 2 }}>
                {featuredArticles.slice(8, 11).map((article) => (
                  <ListItem key={article.title} sx={{ display: 'list-item', listStyleType: 'disc', color: '#222', fontSize: '1rem', py: 0.5 }}>
                    <Link href={`/article/${encodeURIComponent(article.title)}`} sx={{ color: '#0645ad', fontWeight: 500 }}>
                      {article.title}
                    </Link>
                    {article.extract && <Box component="span" sx={{ color: '#222', ml: 0.5 }}>{article.extract}</Box>}
                  </ListItem>
                ))}
              </List>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Random Article */}
      {randomArticle && (
        <Paper elevation={0} sx={{ border: '1px solid #a2a9b1', background: '#fff9db', mt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', background: '#fff3b0', borderBottom: '1px solid #a2a9b1', px: 2, py: 1 }}>
            <CasinoIcon sx={{ color: '#b59f3b', mr: 1 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#222', m: 0 }}>
              Random article
            </Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="h3" sx={{ fontSize: '1.2rem', fontWeight: 700, mb: 1 }}>
              <Link href={`/article/${encodeURIComponent(randomArticle.title)}`} sx={{ color: '#0645ad' }}>
                {randomArticle.title}
              </Link>
            </Typography>
            <Typography variant="body1" sx={{ color: '#444', fontSize: '1rem', mb: 1 }}>
              {randomArticle.extract}
            </Typography>
            <Link href={`/article/${encodeURIComponent(randomArticle.title)}`} sx={{ color: '#0645ad', fontSize: '0.95rem' }}>
              (Read full article)
            </Link>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default Home;