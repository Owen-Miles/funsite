import { useState, useEffect, useRef, useMemo } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  Slider,
  Fab,
  IconButton,
  Toolbar,
} from '@mui/material';
import { PlayArrow, Pause, Add, Remove } from '@mui/icons-material';
import tickSound from '../assets/click.mp3';

function Metronome() {
  const [bpm, setBpm] = useState(63);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const color = useMemo(() => {
    if (bpm < 100) return '#3f51b5'; // indigo
    if (bpm < 125) return '#009688'; // teal
    if (bpm < 140) return '#4caf50'; // green
    if (bpm < 175) return '#ff9800'; // orange
    return '#f44336'; // red
  }, [bpm]);

  const timeoutDuration = useMemo(() => {
    return (60 / bpm) * 1000;
  }, [bpm]);

  const play = () => {
    const audio = new Audio(tickSound);
    // Intentionally bad timing - adds random delay
    setTimeout(() => audio.play(), (Math.random() + 1) * 200);
  };

  const startMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = window.setInterval(play, timeoutDuration);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle BPM changes while playing
  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
    return () => stopMetronome();
  }, [bpm, timeoutDuration]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      startMetronome();
    } else {
      stopMetronome();
    }
    return () => stopMetronome();
  }, [isPlaying]);

  const toggle = () => {
    setIsPlaying((prev) => !prev);
  };

  const increment = () => {
    setBpm((prev) => Math.min(prev + 1, 218));
  };

  const decrement = () => {
    setBpm((prev) => Math.max(prev - 1, 40));
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Box sx={{ width: '100%', maxWidth: 600 }}>
          <Card variant="outlined" sx={{ backgroundColor: 'transparent' }}>
            <Toolbar sx={{ backgroundColor: 'transparent' }}>
              <Typography variant="body2" component="div">
                A BAD METRONOME
              </Typography>
            </Toolbar>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box sx={{ textAlign: 'left' }}>
                  <Typography
                    variant="h2"
                    component="span"
                    sx={{ fontWeight: 300, fontSize: { xs: '3rem', sm: '4rem' } }}
                  >
                    {bpm}
                  </Typography>
                  <Typography variant="body2" component="span" sx={{ fontWeight: 300, ml: 1 }}>
                    BPM
                  </Typography>
                </Box>
                <Box>
                  <Fab
                    onClick={toggle}
                    sx={{
                      backgroundColor: color,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: color,
                        opacity: 0.9,
                      },
                    }}
                  >
                    {isPlaying ? <Pause sx={{ fontSize: 32 }} /> : <PlayArrow sx={{ fontSize: 32 }} />}
                  </Fab>
                </Box>
              </Box>

              <Box sx={{ px: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <IconButton onClick={decrement} sx={{ color }}>
                    <Remove />
                  </IconButton>
                  <Slider
                    value={bpm}
                    onChange={(_, value) => setBpm(value as number)}
                    min={40}
                    max={218}
                    sx={{
                      color,
                      '& .MuiSlider-track': {
                        backgroundColor: color,
                      },
                      '& .MuiSlider-thumb': {
                        backgroundColor: color,
                      },
                      '& .MuiSlider-rail': {
                        backgroundColor: 'grey',
                      },
                    }}
                  />
                  <IconButton onClick={increment} sx={{ color }}>
                    <Add />
                  </IconButton>
                </Box>
              </Box>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Card elevation={0} sx={{ maxWidth: 500, backgroundColor: 'transparent' }}>
              <CardContent>
                <Typography variant="body2" sx={{ textAlign: 'center' }}>
                  This is a metronome I made that does not keep good time. It is a bad metronome.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Metronome;
