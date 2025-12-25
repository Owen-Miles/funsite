import { useState, useEffect, useRef } from 'react';
import { Box, Card, CardContent, CircularProgress, Container, Link } from '@mui/material';

// Import X3D model HTML content
import { DyeLifInputHTML } from '../assets/x3dModels/DyeLifInput';
import { DyeLifLinearHTML } from '../assets/x3dModels/DyeLifLinear';
import { DyeLifLegoHTML } from '../assets/x3dModels/DyeLifLego';
import { DyeLifSmoothHTML } from '../assets/x3dModels/DyeLifSmooth';

interface X3DCardProps {
  title: string;
  htmlContent: string;
  width: number;
  height: number;
  loaded: boolean;
  onLoaded?: (loaded: boolean) => void;
}

function X3DCard({ title, htmlContent, width, height, loaded, onLoaded }: X3DCardProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Use a wrapper div with innerHTML to let browser parse everything at once
      const wrapper = document.createElement('div');
      containerRef.current.appendChild(wrapper);
      
      // Set innerHTML on the wrapper - this lets the browser parse the entire X3D structure
      wrapper.innerHTML = `<x3d width="${width}" height="${height}" style="margin: 2pt">${htmlContent}</x3d>`;
      
      // Wait for X3DOM to process the newly added elements
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const x3dom = (window as any).x3dom;
          if (x3dom && typeof x3dom.reload === 'function') {
            x3dom.reload();
          }
          if (onLoaded) {
            onLoaded(true);
          }
        });
      });

      return () => {
        if (wrapper.parentNode) {
          wrapper.parentNode.removeChild(wrapper);
        }
      };
    }
  }, [width, height, htmlContent, onLoaded]);

  return (
    <Card
        variant='outlined'
      sx={{
        width: width + 4,
        height: height + 4,
        margin: '4px auto',
        padding: '1px',
        border: '1pt solid rgb(80, 80, 80)',
        backgroundColor: 'transparent',
        position: 'relative',
      }}
    >
      <CardContent
        sx={{
          fontSize: '0.75rem',
          position: 'absolute',
          paddingTop: 0,
          paddingLeft: '2pt',
          zIndex: 100,
        }}
      >
        {title}
      </CardContent>
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
  );
}

export default function DyeLif() {
  const [loaded1, setLoaded1] = useState(false);
  const [xDomWidth, setXDomWidth] = useState(530);
  const [xDomHeight, setXDomHeight] = useState(424);

  // Calculate responsive dimensions
  useEffect(() => {
    const updateDimensions = () => {
      let width = 530;
      if (window.innerWidth <= 830 && window.innerWidth >= 550) {
        width = window.innerWidth - 300;
      } else if (window.innerWidth < 550) {
        width = window.innerWidth - 50;
      }
      setXDomWidth(width);
      setXDomHeight(width * 0.8);
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Reload X3DOM after component mounts and when models are loaded
  useEffect(() => {
    if (loaded1) {
      // Add delay to ensure x3d elements are in DOM
      const timer = setTimeout(() => {
        const x3dom = (window as any).x3dom;
        if (x3dom && typeof x3dom.reload === 'function') {
          x3dom.reload();
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loaded1]);

  const handleModelLoaded = (value: boolean) => {
    if (value) {
      setTimeout(() => setLoaded1(true), 1500);
    }
  };

  return (
    <Container>
      <CardContent
        sx={{
          padding: '8px',
          fontSize: '0.75rem',
          textAlign: 'center',
          maxWidth: '450pt',
          margin: '0 auto',
        }}
      >
        I made the cover image for{' '}
        <Link href="https://ngwa.onlinelibrary.wiley.com/doi/abs/10.1111/gwmr.12296" target="_blank" rel="noopener">
          this groundwater paper
        </Link>{' '}
        using the modeling tool EVS. It is very expensive software if you are a student, so I wanted to re-do it in a
        free, accessible way using python, with the packages pykrige and vedo. More information below.
        <br />
        (Click and drag any image to rotate, scroll to zoom, press 't' to reset the view.)
      </CardContent>

      <X3DCard title="Input data: detections of an oil are shown in red" htmlContent={DyeLifInputHTML} width={xDomWidth} height={xDomHeight} loaded={loaded1} />

      <X3DCard title="A simple 3D linear interpolation (not as good as Kriging)" htmlContent={DyeLifLinearHTML} width={xDomWidth} height={xDomHeight} loaded={loaded1} onLoaded={handleModelLoaded} />

      <X3DCard
        title="Interpolating Kriging over a grid, blocky to show the grid resolution:"
        htmlContent={DyeLifLegoHTML}
        width={xDomWidth}
        height={xDomHeight}
        loaded={loaded1}
      />

      <X3DCard
        title="Interpolating Kriging over a grid, smoothed, shows where oil is most likely located:"
        htmlContent={DyeLifSmoothHTML}
        width={xDomWidth}
        height={xDomHeight}
        loaded={loaded1}
      />

      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: '8px' }}>
        <CardContent sx={{ padding: '8px', fontSize: '0.75rem', maxWidth: '450pt' }}>
          <ul>
            <li>
              <Link href="https://www.ctech.com/" target="_blank" rel="noopener">
                EVS is a widely used 3D modeling tool made by C-Tech
              </Link>{' '}
              that has useful interpolation tools for earth sciences. It is prohibitively expensive for a student. I
              wanted to re-do my previous 3D modeling work with free tools.
            </li>
            <li>
              Some other background: When oily substances spill onto the ground, they seep down to the groundwater
              where they slowly dissolve, causing contamination that could be hazardous. It is often difficult to find
              the oil in the ground, because we can't see it easily. Usually, we have to drill boreholes and collect
              samples of the soil, which is expensive and time consuming.{' '}
              <Link href="https://ngwa.onlinelibrary.wiley.com/toc/17456592/2018/38/3" target="_blank" rel="noopener">
                A tool was developed
              </Link>{' '}
              by{' '}
              <Link href="http://www.dakotatechnologies.com/services/dyelif" target="_blank" rel="noopener">
                Dakota Technologies
              </Link>{' '}
              that can detect oil more easily in the ground using a technology called Laser Induced Fluorescence (LIF).
              This method is really effective at some sites at finding the oily substance without drilling boreholes
              and sampling directly. Here, I am simulating using Dakota's DyeLIF tool and showing the interpolation
              that is done after.
            </li>
            <li>
              The method for investigating a contaminated site usually involves several boreholes or probes with the
              DyeLIF tool, followed by some sort of interpolation to map out where we think the oils are. Here, we use
              the geostatistical method Kriging, which is usually better than a simple linear or spline interpolation.
              Normally, one would do this with EVS or some other paid-for tool.
            </li>
            <li>
              I am instead using Python and free packages to do the same work in a script. This frees up time, because
              as long as the input data is in the right form, we get the same cool 3D visualization out with out any
              work.
            </li>
            <li>I made this data up, but it is based on my experience with the technology.</li>
            <li>
              It is loosely based on what one may encounter at a{' '}
              <Link href="https://en.wikipedia.org/wiki/Trichloroethylene" target="_blank" rel="noopener">
                TCE site, which is a common contaminant
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/Owen-Miles/flopyVedo/blob/main/example_scripts/07_DyeLIF.py"
                target="_blank"
                rel="noopener"
              >
                Github link
              </Link>{' '}
              for the Python script.
            </li>
          </ul>
        </CardContent>
      </Box>
    </Container>
  );
}
