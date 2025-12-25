import { createTheme } from '@mui/material/styles';

export const BACKGROUND_COLOR = '#f2f0e6';

const theme = createTheme({
  palette: {
    background: {
      default: BACKGROUND_COLOR,
      paper: BACKGROUND_COLOR,
    },
  },
});

export default theme;
