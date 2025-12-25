import { Container, Typography, Box } from '@mui/material';

function About() {
  return (
    <Container>
      <Box sx={{ padding: '20px', textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" color="text.secondary">
          About page coming soon...
        </Typography>
      </Box>
    </Container>
  );
}

export default About;
