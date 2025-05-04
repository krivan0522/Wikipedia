import React from 'react';
import {
  Box,
  Typography,
  Link,
  Divider,
  Container,
} from '@mui/material';

const footerLinks = [
  {
    title: 'Wikipedia',
    links: [
      { text: 'About Wikipedia', href: '/about' },
      { text: 'Disclaimers', href: '/disclaimers' },
      { text: 'Contact Wikipedia', href: '/contact' },
      { text: 'Code of Conduct', href: '/code-of-conduct' },
      { text: 'Mobile View', href: '/mobile' },
    ],
  },
  {
    title: 'Contribute',
    links: [
      { text: 'Help', href: '/help' },
      { text: 'Learn to Edit', href: '/learn' },
      { text: 'Community Portal', href: '/community' },
      { text: 'Recent Changes', href: '/recent-changes' },
      { text: 'Upload File', href: '/upload' },
    ],
  },
  {
    title: 'Tools',
    links: [
      { text: 'What Links Here', href: '/what-links-here' },
      { text: 'Related Changes', href: '/related-changes' },
      { text: 'Special Pages', href: '/special-pages' },
      { text: 'Printable Version', href: '/print' },
      { text: 'Permanent Link', href: '/permanent-link' },
    ],
  },
];

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#f6f6f6',
        borderTop: '1px solid #a2a9b1',
        p: 3,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {footerLinks.map((section) => (
            <Box key={section.title} sx={{ minWidth: 200 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#54595d',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                {section.title}
              </Typography>
              <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
                {section.links.map((link) => (
                  <Box
                    component="li"
                    key={link.text}
                    sx={{ mb: 0.5 }}
                  >
                    <Link
                      href={link.href}
                      sx={{
                        color: '#0645ad',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline',
                        },
                      }}
                    >
                      {link.text}
                    </Link>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            This page was last edited on {new Date().toLocaleDateString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Text is available under the{' '}
            <Link
              href="https://creativecommons.org/licenses/by-sa/3.0/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Creative Commons Attribution-ShareAlike License 3.0
            </Link>
            ; additional terms may apply.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Wikipedia® is a registered trademark of the{' '}
            <Link
              href="https://wikimediafoundation.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Wikimedia Foundation, Inc.
            </Link>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer; 