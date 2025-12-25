import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, CircularProgress, Container, Link, Stack } from '@mui/material';
import { triangleLayerHTML } from '../assets/x3dModels/triangleLayer';

export default function TriangleLayer() {
  const [loaded, setLoaded] = useState(false);
  const [xDomWidth, setXDomWidth] = useState(730);
  const [xDomHeight, setXDomHeight] = useState(530);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Calculate responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      let width = 730;
      if (window.innerWidth <= 830 && window.innerWidth >= 450) {
        width = window.innerWidth - 100;
      } else if (window.innerWidth < 450) {
        width = window.innerWidth - 50;
      }
      
      let height = 530;
      const aspectRatio = window.innerHeight / window.innerWidth;
      if (aspectRatio > 1) {
        height = width;
      } else if (window.innerHeight <= 830) {
        height = window.innerHeight - 300;
      }
      
      setXDomWidth(width);
      setXDomHeight(height);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Create and manage x3d element
  useEffect(() => {
    if (containerRef.current) {
      // Use a wrapper div with innerHTML to let browser parse everything at once
      const wrapper = document.createElement('div');
      containerRef.current.appendChild(wrapper);
      
      // Set innerHTML on the wrapper - this lets the browser parse the entire X3D structure
      wrapper.innerHTML = `<x3d width="${xDomWidth}" height="${xDomHeight}" style="margin: 2pt">${triangleLayerHTML}</x3d>`;
      
      // Wait for X3DOM to process the newly added elements
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const x3dom = (window as any).x3dom;
          if (x3dom && typeof x3dom.reload === 'function') {
            x3dom.reload();
          }
          setTimeout(() => setLoaded(true), 1000);
        });
      });

      return () => {
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
      };
    }
  }, [xDomWidth, xDomHeight]);

  return (
    <Container>
      <Stack spacing={2} alignItems="center">
        <CardContent sx={{ p: 1, fontSize: '0.75rem', textAlign: 'center' }}>
          Click and drag to rotate, scroll to zoom, press 't' to reset the view.
        </CardContent>

        <Card
          sx={{
            width: xDomWidth + 4,
            height: xDomHeight + 4,
            border: '1pt solid rgb(80, 80, 80)',
            bgcolor: 'transparent',
            position: 'relative',
          }}
        >
          <div ref={containerRef} />
          {!loaded && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}
            >
              <CircularProgress size={39} />
            </Box>
          )}
        </Card>

        <CardContent sx={{ p: 1, fontSize: '0.75rem', maxWidth: '450pt' }}>
          Legend:
          <ul>
            <li>
              Top layer: a digital elevation model (coming from a .csv with thousands of points).
            </li>
            <li>
              Middle triangle yellow layer: finite element mesh in X and Y, with the Z top and bottom interpolated to
              each surface.
            </li>
            <li>
              Bottom green layer: a geologic layer, linearly interpolated by 10s of known locations.
            </li>
            <li>10:1 (V:H) exaggeration, layers "exploded" apart to show them clearly.</li>
          </ul>
          Purpose and Background:
          <ul>
            <li>
              Groundwater flow models sometimes use triangular grids, but they are often viewed in 2D in clumsy-to-use
              or expensive GUIs, where errors are hard to spot. This script is designed to show how groundwater modeling
              and 3D visualization can be combined in Python, using free tools.
            </li>
            <li>
              Specifically, this is to show what a groundwater flow model's triangular grid looks like when it is
              interpolated between two surfaces in 3D. Using this script we can build more complicated multi-layerd
              models, and visualize and troubleshoot our grid with ease.
            </li>
            <li>
              From the Minette Region of southern Luxembourg, geologic layer{' '}
              <Link href="http://doi.org/10.1127/1860-1804/2013/0025" target="_blank" rel="noopener">
                estimated from here.
              </Link>
            </li>
            <li>
              Made using the python packages Flopy and Vedo Borrows heavily from A. Pollack (SCRF)'s example of a
              geologic model from the Vedo examples.
            </li>
            <li>
              <Link
                href="https://github.com/Owen-Miles/flopyVedo/blob/main/example_scripts/04_triangleMeshLayer.py"
                target="_blank"
                rel="noopener"
              >
                Github link
              </Link>{' '}
              for the script.
            </li>
          </ul>
        </CardContent>
      </Stack>
    </Container>
  );
}
