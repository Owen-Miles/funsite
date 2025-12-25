import { useEffect, useRef, useMemo, useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import * as d3 from 'd3';

function RandomSinWaveFun() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [radioMultiplier, setRadioMultiplier] = useState(1);

  // Configuration
  const margin = { top: 0, right: 0, bottom: 0, left: 0 };
  const height = 400;
  const dataRange = { min: 0, max: 30 };
  const discretization = 300;
  const domain = { x: [0, 30], y: [16, -30] };
  const transitionDuration = 1300;

  // Responsive width
  const width = typeof window !== 'undefined' ? window.innerWidth : 800;

  // Generate plot data
  const plotData = useMemo(() => {
    const x: number[] = [dataRange.min];
    let i = dataRange.min;
    const delta = (dataRange.max - dataRange.min) / discretization;

    while (i < dataRange.max) {
      x.push(i + delta);
      i += delta;
    }

    return x.map((e) => ({
      x: e,
      y: Math.sin(e * radioMultiplier) * (radioMultiplier + 1),
    }));
  }, [radioMultiplier]);

  // Random color that changes with the data
  const randomColor = useMemo(() => {
    return `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
  }, [radioMultiplier]);

  // Scales
  const scales = useMemo(() => {
    const x = d3
      .scaleLinear()
      .range([0, width - margin.right - margin.left])
      .domain(domain.x);

    const y = d3
      .scaleLinear()
      .range([0, height - margin.bottom - margin.top])
      .domain(domain.y);

    return { x, y };
  }, [width]);

  // Initialize visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    // Clear previous content
    svg.selectAll('*').remove();

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('display', 'block')
      .style('margin', '0 auto');

    svg
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .style('fill', 'none');

    // Create bars
    svg
      .selectAll('rect.bar')
      .data(plotData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (e) => scales.x(e.x))
      .attr('y', (e) => scales.y(e.y))
      .attr('width', 3)
      .attr('height', Math.random() * 200 + 20)
      .attr('fill', randomColor);
  }, []);

  // Update visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg
      .selectAll('rect.bar')
      .data(plotData)
      .transition()
      .duration(transitionDuration)
      .attr('x', (e) => scales.x(e.x))
      .attr('y', (e) => scales.y(e.y))
      .attr('height', Math.random() * 200 + 20)
      .attr('fill', randomColor);
  }, [plotData, scales, randomColor]);

  // Scheduler for random updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRadioMultiplier(Math.random() * 2 + 0.5);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container sx={{ padding: 0 }}>
      <Typography
        variant="body2"
        sx={{
          textAlign: 'center',
          margin: '0 auto',
        }}
      >
        A soothing sin wave that changes every 1.3 seconds
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <svg ref={svgRef} />
      </Box>
    </Container>
  );
}

export default RandomSinWaveFun;
