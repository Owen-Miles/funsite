import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Box, Container, Divider } from '@mui/material';
import './App.css';

// Page components
import Gallery from './pages/Gallery.tsx';
import About from './pages/About.tsx';

// Component routes
import MapArtBos from './components/MapArtBos';
import MapArtNj from './components/MapArtNj';
import MapArtRadiohead from './components/MapArtRadiohead';
import RandomSinWaveFun from './components/RandomSinWaveFun';
import MafsOne from './components/MafsOne';

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh' }}>
        {/* Navigation */}
        <Container>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '12px',
              gap: '5px',
            }}
          >
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Gallery
            </Link>
            <span>|</span>
            <Link to="/about" style={{ textDecoration: 'none', color: 'inherit' }}>
              About
            </Link>
          </Box>
        </Container>
        
        <Divider />
        
        {/* Routes */}
        <Box sx={{ py: 1 }}>
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/about" element={<About />} />
            <Route path="/map-art-bos" element={<MapArtBos />} />
            <Route path="/map-art-nj" element={<MapArtNj />} />
            <Route path="/map-art-radiohead" element={<MapArtRadiohead />} />
            <Route path="/random-wave" element={<RandomSinWaveFun />} />
            <Route path="/mafs1" element={<MafsOne />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
