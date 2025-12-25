import { Container, Box, Typography } from '@mui/material';

function MapArtNj() {
  return (
    <Container>
      <Box
        component="img"
        src="/assets/mapArt/NjMapArt.jpg"
        alt="New Jersey Map Art"
        sx={{
          maxWidth: '540px',
          width: '100%',
          margin: 'auto',
          display: 'block',
          objectFit: 'contain',
        }}
      />
      <Box
        sx={{
          paddingTop: '50pt',
          textAlign: 'center',
          fontSize: '0.75rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ maxWidth: '320pt' }}>
          <Typography variant="body2">
            A nice looking data set I recieved from a surveyor at a remediation job.
            Somewhere in New Jersey.
            <br />
            <br />
            Made in ESRI ArcGIS
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default MapArtNj;
