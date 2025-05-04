import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
  Box,
  CircularProgress,
} from '@mui/material';
import { searchArticles } from '../services/wikipediaApi';

function SearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await searchArticles(query);
        setResults(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h1" gutterBottom>
        Search results for "{query}"
      </Typography>
      {results.length > 0 ? (
        <List>
          {results.map((result) => (
            <ListItem key={result.pageid} divider>
              <ListItemText
                primary={
                  <Link href={`/article/${encodeURIComponent(result.title)}`}>
                    {result.title}
                  </Link>
                }
                secondary={
                  <Typography
                    variant="body2"
                    dangerouslySetInnerHTML={{ __html: result.snippet }}
                  />
                }
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography variant="body1">
          No results found for "{query}". Try a different search term.
        </Typography>
      )}
    </Container>
  );
}

export default SearchResults;