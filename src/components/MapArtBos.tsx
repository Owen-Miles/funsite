import { Container, Box, Typography } from '@mui/material';

function MapArtBos() {
  return (
    <Container>
      <Box
        component="img"
        src="/assets/mapArt/BostonMapArt_1.jpg"
        alt="Boston Map Art"
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
            Stumbled on some map art when tiling elevation data in Boston as part of
            a groundwater model
            <br />
            <br />
            Made in ESRI ArcGIS
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default MapArtBos;
