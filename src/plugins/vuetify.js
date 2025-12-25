import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Import Vuetify styles
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Use Material Design Icons

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light', // Change to 'dark' if you want a dark theme by default
  },
});