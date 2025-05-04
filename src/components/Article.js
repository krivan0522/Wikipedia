import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Grid,
  Container,
  Button,
  Modal,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import {
  Home as HomeIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Link as LinkIcon,
  Print as PrintIcon,
  Download as DownloadIcon,
  Language as LanguageIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  Lightbulb as LightbulbIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { getArticle } from '../services/wikipediaApi';

// Helper to rewrite /wiki/ links to /article/ links
function rewriteWikiLinks(html) {
  return html.replace(/href=(['\"])\/wiki\//g, 'href=$1/article/');
}

// Helper to extract plain text from HTML
function htmlToPlainText(html) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

// Flashcard flip component
function Flashcard({ question, answer, cardKey }) {
  const [flipped, setFlipped] = useState(false);
  // Reset flip state when cardKey changes
  useEffect(() => { setFlipped(false); }, [cardKey]);

  return (
    <Box
      sx={{
        perspective: 1000,
        width: '100%',
        height: 180,
        mb: 2,
        cursor: 'pointer',
      }}
      onClick={() => setFlipped(f => !f)}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s',
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'none',
        }}
      >
        {/* Front (Question) */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#f5f5f5',
            boxShadow: 3,
          }}
        >
          <CardContent>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>
              {question}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#888', textAlign: 'center' }}>
              Click to reveal answer
            </Typography>
          </CardContent>
        </Card>
        {/* Back (Answer) */}
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#e3fbe3',
            boxShadow: 3,
          }}
        >
          <CardContent
            sx={{
              width: '100%',
              maxHeight: 120,
              overflow: 'auto',
              wordBreak: 'break-word',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              pt: 5,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '1rem', color: '#388e3c' }}>
              {answer}
            </Typography>
            <Typography variant="caption" sx={{ color: '#888' }}>
              Click to go back
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

function Article() {
  const { title } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [tldrSummary, setTldrSummary] = useState('');
  const [eli5Summary, setEli5Summary] = useState('');
  const [showEli5, setShowEli5] = useState(false);

  // Flashcard state
  const [flashcards, setFlashcards] = useState([]);
  const [flashLoading, setFlashLoading] = useState(false);
  const [flashError, setFlashError] = useState('');
  const [flashOpen, setFlashOpen] = useState(false);
  const [flashIndex, setFlashIndex] = useState(0);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(title);
        setArticle(data);
        generateSummaries(data.content);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching article:', error);
        setLoading(false);
      }
    };
    fetchArticle();
  }, [title]);

  // Generate TL;DR and ELI5 summaries using Gemini API
  const generateSummaries = async (content) => {
    try {
      const GEMINI_API_KEY = 'AIzaSyDdqMC-irTsZRGcHYVok0TTuvAm5OPpHhA';
      const prompt = `Generate a TL;DR summary and an ELI5 (Explain Like I'm 5) version of the following article. Keep the length such that anyone can learn with that amount of text. Return as JSON: {"tldr": "...", "eli5": "..."}\n\nArticle:\n${htmlToPlainText(content)}`;
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();
      let summaries = {};
      try {
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json|```/g, '').trim();
        summaries = JSON.parse(text);
        setTldrSummary(summaries.tldr);
        setEli5Summary(summaries.eli5);
      } catch (e) {
        console.error('Could not parse summaries from Gemini response.');
      }
    } catch (err) {
      console.error('Failed to generate summaries.');
    }
  };

  // Gemini API call for flashcards
  const generateFlashcards = async () => {
    setFlashLoading(true);
    setFlashError('');
    setFlashcards([]);
    setFlashIndex(0);
    try {
      // --- INSERT YOUR GEMINI API KEY BELOW ---
      const GEMINI_API_KEY = 'AIzaSyDdqMC-irTsZRGcHYVok0TTuvAm5OPpHhA';
      // ----------------------------------------
      const prompt = `Generate 10 learning flashcards (question and answer pairs) from the following article. Return as a JSON array with objects: {"question": "...", "answer": "..."}.\n\nArticle:\n${htmlToPlainText(article.content)}`;
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );
      const data = await response.json();
      let cards = [];
      try {
        // Gemini returns the text in data.candidates[0].content.parts[0].text
        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json|```/g, '').trim();
        cards = JSON.parse(text);
        console.log(cards);
      } catch (e) {
        setFlashError('Could not parse flashcards from Gemini response.');
        setFlashLoading(false);
        return;
      }
      setFlashcards(cards);
      setFlashOpen(true);
    } catch (err) {
      setFlashError('Failed to generate flashcards.');
    } finally {
      setFlashLoading(false);
    }
  };

  const handleNext = () => setFlashIndex((i) => (i + 1) % flashcards.length);
  const handlePrev = () => setFlashIndex((i) => (i - 1 + flashcards.length) % flashcards.length);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!article) {
    return (
      <Container maxWidth="lg" sx={{ p: 3 }}>
        <Typography variant="h1">Article not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ p: 3 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link href="/" sx={{ display: 'flex', alignItems: 'center' }}>
          <HomeIcon sx={{ mr: 0.5, fontSize: 20 }} />
          Main Page
        </Link>
        <Typography color="text.primary">{article.title}</Typography>
      </Breadcrumbs>

      {/* Article Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h1" sx={{ fontSize: '2.5rem', fontWeight: 400, mb: 0 }}>
          {article.title}
        </Typography>
        <Box>
          <Tooltip title="View history">
            <IconButton>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="View source">
            <IconButton>
              <LinkIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Download as PDF">
            <IconButton>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Languages">
            <IconButton>
              <LanguageIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Summary Section */}
      <Paper sx={{ mb: 3, p: 2, border: '1px solid #a2a9b1', background: '#f8f9fa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LightbulbIcon sx={{ mr: 1, color: '#3366cc' }} />
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
            TL;DR Summary
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ color: '#222', mb: 2 }}>
          {tldrSummary || 'Generating summary...'}
        </Typography>
        
        <Accordion 
          expanded={showEli5} 
          onChange={() => setShowEli5(!showEli5)}
          sx={{ 
            background: 'transparent',
            boxShadow: 'none',
            '&:before': { display: 'none' }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{ 
              p: 0,
              minHeight: 'auto',
              '& .MuiAccordionSummary-content': { my: 0 }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <SchoolIcon sx={{ mr: 1, color: '#3366cc' }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#222' }}>
                Explain Like I'm 5
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <Typography variant="body1" sx={{ color: '#222', mt: 2 }}>
              {eli5Summary || 'Generating ELI5 version...'}
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Paper>

      {/* Generate Flashcards Button */}
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={generateFlashcards} disabled={flashLoading}>
          {flashLoading ? 'Generating Flashcards...' : 'Generate Flashcards'}
        </Button>
        {flashError && <Typography color="error" sx={{ mt: 1 }}>{flashError}</Typography>}
      </Box>

      {/* Flashcards Modal */}
      <Modal open={flashOpen} onClose={() => setFlashOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <IconButton
            aria-label="close"
            onClick={() => setFlashOpen(false)}
            sx={{ position: 'absolute', top: 8, right: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
          {flashcards.length > 0 && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Flashcard {flashIndex + 1} of {flashcards.length}</Typography>
              <Flashcard question={flashcards[flashIndex].question} answer={flashcards[flashIndex].answer} cardKey={flashIndex} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={handlePrev} disabled={flashcards.length <= 1}>Previous</Button>
                <Button onClick={handleNext} disabled={flashcards.length <= 1}>Next</Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Article Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Article" />
          <Tab label="Talk" />
          <Tab label="Read" />
          <Tab label="View source" />
          <Tab label="View history" />
        </Tabs>
      </Paper>

      {/* Article Content */}
      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            <Box
              component="div"
              dangerouslySetInnerHTML={{ __html: rewriteWikiLinks(article.content) }}
              sx={{
                '& .mw-parser-output': {
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    borderBottom: '1px solid #a2a9b1',
                    paddingBottom: '0.17em',
                    marginBottom: '0.6em',
                    marginTop: '0.6em',
                  },
                  '& p': {
                    margin: '0.5em 0',
                    lineHeight: 1.6,
                  },
                  '& a': {
                    color: '#0645ad',
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  },
                  '& ul, & ol': {
                    margin: '0.3em 0 0 1.6em',
                    padding: 0,
                  },
                  '& li': {
                    marginBottom: '0.1em',
                  },
                  '& .infobox': {
                    float: 'right',
                    clear: 'right',
                    margin: '0.5em 0 1em 1em',
                    padding: '0.2em',
                    border: '1px solid #a2a9b1',
                    backgroundColor: '#f8f9fa',
                    fontSize: '88%',
                    lineHeight: 1.5,
                    width: '22em',
                  },
                  '& .thumb': {
                    float: 'right',
                    clear: 'right',
                    margin: '0.5em 0 1em 1em',
                    padding: '0.2em',
                    border: '1px solid #a2a9b1',
                    backgroundColor: '#f8f9fa',
                    fontSize: '94%',
                    textAlign: 'center',
                    overflow: 'hidden',
                    width: 'auto',
                    maxWidth: '100%',
                  },
                  '& .thumbinner': {
                    padding: '3px',
                    textAlign: 'center',
                    overflow: 'hidden',
                  },
                  '& .thumbcaption': {
                    textAlign: 'left',
                    lineHeight: 1.4,
                    padding: '3px',
                  },
                  '& .reference': {
                    fontSize: '80%',
                    verticalAlign: 'super',
                  },
                },
              }}
            />
          </Paper>
        </Grid>

        {/* Table of Contents */}
        {/* <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Contents
            </Typography>
            <List dense>
              {article.sections?.map((section) => (
                <ListItem key={section.id} sx={{ pl: section.level * 2 }}>
                  <Link href={`#${section.id}`} sx={{ color: '#0645ad' }}>
                    {section.text}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid> */}
      </Grid>
    </Container>
  );
}

export default Article; 