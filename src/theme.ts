import { createTheme } from '@mui/material/styles';

export const BACKGROUND_COLOR = '#f2f0e6';

const theme = createTheme({
  typography: {
    fontSize: 12, // Default base font size (MUI default is 14)
    body1: {
      fontSize: '0.875rem', // 14px
    },
    body2: {
      fontSize: '0.75rem', // 12px (matching your Vue app)
    },
    button: {
      fontSize: '0.75rem', // 12px
    },
    caption: {
      fontSize: '0.625rem', // 10px
    },
    h1: {
      fontSize: '2rem',
    },
    h2: {
      fontSize: '1.75rem',
    },
    h3: {
      fontSize: '1.5rem',
    },
    h4: {
      fontSize: '1.25rem',
    },
    h5: {
      fontSize: '1rem',
    },
    h6: {
      fontSize: '0.875rem',
    },
  },
  palette: {
    background: {
      default: BACKGROUND_COLOR,
      paper: BACKGROUND_COLOR,
    },
  },
});

export default theme;
