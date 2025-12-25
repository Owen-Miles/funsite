import { Container, Box, Typography } from '@mui/material';

function MapArtRadiohead() {
  return (
    <Container>
      <Box
        component="img"
        src="/assets/mapArt/htt_minnow.jpg"
        alt="Radiohead Style Map Art"
        sx={{
          maxWidth: '600px',
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
            What if a map of the dominant minnow species in US watersheds were
            stylized like Radiohead's map-based Hail to the Thief album cover?
            <br />
            <br />
            Made in ESRI ArcGIS and MS Paint (MS paint is wonderful).
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default MapArtRadiohead;
