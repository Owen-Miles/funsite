import { useEffect, useRef, useState, useMemo } from 'react';
import { Container, Box, Card, CardContent, Typography, ToggleButton, ToggleButtonGroup, Button } from '@mui/material';
import * as d3 from 'd3';

const RED_COLOR = '#FF0000';

interface MafsResult {
  AsOf: string;
  couple: string;
  viewer: string;
  prediction: string;
}

interface FinalDecision {
  couple: string;
  decision: string;
}

interface ViewerResult {
  viewer: string;
  value: number;
}

function colorSquare(marriedString: string): string {
  switch (marriedString) {
    case 'Married':
      return RED_COLOR;
    case 'Divorced':
      return 'grey';
    default:
      return 'green';
  }
}

function MafsOne() {
  const svgRef = useRef<SVGSVGElement>(null);
  const winnerSvgRef = useRef<SVGSVGElement>(null);
  const [surveyResults, setSurveyResults] = useState<MafsResult[]>([]);
  const [groupBy, setGroupBy] = useState<'viewer' | 'couple'>('viewer');
  const [snButton, setSnButton] = useState(true);
  const [cdButton, setCdButton] = useState(false);
  const [aaButton, setAaButton] = useState(true);

  // Configuration
  const margin = { top: 30, right: 50, bottom: 0, left: 50 };
  const width = 180;
  const height = 400;
  const transitionDuration = 1000;

  // Load data
  useEffect(() => {
    fetch('/data/MAFS.json')
      .then((response) => response.json())
      .then((data: MafsResult[]) => setSurveyResults(data));
  }, []);

  // Compute final decisions
  const finalDecisions: FinalDecision[] = useMemo(() => [
    {
      couple: 'Danielle & Cody',
      decision: cdButton ? 'Married' : 'Divorced',
    },
    {
      couple: 'Shelia & Nate',
      decision: snButton ? 'Married' : 'Divorced',
    },
    {
      couple: 'Ashley & Anthony',
      decision: aaButton ? 'Married' : 'Divorced',
    },
  ], [snButton, cdButton, aaButton]);

  // Format data
  const dataFormatted = useMemo(() => {
    return surveyResults.map((e) => ({
      ...e,
      AsOf: e.AsOf.replace('Episode ', ''),
      couple: e.couple
        .replace('Danielle & Cody', 'D&C')
        .replace('Shelia & Nate', 'S&N')
        .replace('Ashley & Anthony', 'A&A'),
      decision: finalDecisions.find((f) => f.couple === e.couple)?.decision || 'Divorced',
    }));
  }, [surveyResults, finalDecisions]);

  // Calculate final results
  const finalResults: ViewerResult[] = useMemo(() => {
    const results: Record<string, number> = {
      Charlo: 0,
      Dinny: 0,
      Katy: 0,
      Laura: 0,
      Owen: 0,
      Paul: 0,
    };

    dataFormatted.forEach((e) => {
      if (e.decision === e.prediction) {
        results[e.viewer]++;
      } else {
        results[e.viewer]--;
      }
    });

    return Object.entries(results).map(([viewer, value]) => ({ viewer, value }));
  }, [dataFormatted]);

  // Scales
  const scales = useMemo(() => {
    if (dataFormatted.length === 0) return null;

    const xGroups = Array.from(new Set(dataFormatted.map((e) => e.AsOf)));
    const yLeftGroups = Array.from(new Set(dataFormatted.map((e) => e.viewer)));
    const yRightGroups = Array.from(new Set(dataFormatted.map((e) => e.couple)));

    const x = d3.scaleBand().range([0, width]).domain(xGroups);
    const yLeft1 = d3.scaleBand().range([0, height]).domain(yLeftGroups).padding(0.1);
    const yRight1 = d3.scaleBand().range([0, yLeft1.bandwidth()]).domain(yRightGroups).padding(0.05);
    const yRight2 = d3.scaleBand().range([0, height]).domain(yRightGroups).padding(0.1);
    const yLeft2 = d3.scaleBand().range([0, yRight2.bandwidth()]).domain(yLeftGroups).padding(0.05);

    if (groupBy === 'viewer') {
      return { x, yLeft: yLeft1, yRight: yRight1 };
    } else {
      return { x, yLeft: yLeft2, yRight: yRight2 };
    }
  }, [dataFormatted, groupBy]);

  // Winner scales
  const winScales = useMemo(() => {
    if (dataFormatted.length === 0) return null;

    const yGroups = Array.from(new Set(dataFormatted.map((e) => e.viewer)));
    const y = d3.scaleBand().range([0, 200]).domain(yGroups);
    const x = d3.scaleLinear().range([0, width]).domain([-21, 21]);

    return { x, y };
  }, [dataFormatted]);

  // Initialize main visualization (only once when data loads)
  useEffect(() => {
    if (!svgRef.current || dataFormatted.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    // Use initial scales (viewer grouping)
    const xGroups = Array.from(new Set(dataFormatted.map((e) => e.AsOf)));
    const yLeftGroups = Array.from(new Set(dataFormatted.map((e) => e.viewer)));
    const yRightGroups = Array.from(new Set(dataFormatted.map((e) => e.couple)));

    const x = d3.scaleBand().range([0, width]).domain(xGroups);
    const yLeft = d3.scaleBand().range([0, height]).domain(yLeftGroups).padding(0.1);
    const yRight = d3.scaleBand().range([0, yLeft.bandwidth()]).domain(yRightGroups).padding(0.05);

    svg.attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

    // Top axis
    svg
      .append('g')
      .call(d3.axisTop(x).tickSize(0))
      .selectAll('.tick text')
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .style('font-size', 14);

    // Left axis
    svg
      .append('g')
      .call(d3.axisLeft(yLeft).tickSize(0))
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .style('font-size', 15)
      .attr('class', 'leftaxis');

    // Right axis
    svg
      .append('g')
      .call(d3.axisRight(yRight).tickSize(0))
      .attr('transform', `translate(${width + margin.right},${margin.top + 8})`)
      .style('font-size', 15)
      .attr('class', 'rightaxis');

    svg.selectAll('.domain').remove();

    // Squares - use FIXED height from initial yRight bandwidth
    svg
      .selectAll('rect.square')
      .data(dataFormatted)
      .enter()
      .append('rect')
      .attr('class', 'square')
      .attr('x', (d) => (x(d.AsOf) || 0))
      .attr('y', (d) => (yLeft(d.viewer) || 0) + (yRight(d.couple) || 0))
      .attr('height', yRight.bandwidth())
      .attr('width', x.bandwidth())
      .style('stroke-width', 1)
      .style('stroke', 'white')
      .attr('fill', (e) => colorSquare(e.prediction))
      .style('opacity', 0.8)
      .attr('rx', 5)
      .attr('ry', 5)
      .attr('transform', `translate(${margin.left},${margin.top})`);
  }, [dataFormatted]);

  // Update visualization on groupBy change
  useEffect(() => {
    if (!svgRef.current || !scales || dataFormatted.length === 0) return;

    const svg = d3.select(svgRef.current);
    d3.selectAll('.extraaxis').transition().duration(500).style('opacity', 0).remove();

    svg
      .selectAll('rect.square')
      .data(dataFormatted)
      .transition()
      .duration(transitionDuration)
      .attr('y', (d) => (scales.yLeft(d.viewer) || 0) + (scales.yRight(d.couple) || 0));

    svg
      .select('.leftaxis')
      .transition()
      .duration(1500)
      .call(d3.axisLeft(scales.yLeft).tickSize(0) as any)
      .attr('transform', `translate(${margin.left},${margin.top + (groupBy === 'viewer' ? 0 : 12)})`);

    svg
      .select('.rightaxis')
      .transition()
      .duration(1500)
      .call(d3.axisRight(scales.yRight).tickSize(0) as any)
      .attr('transform', `translate(${width + margin.right},${margin.top + (groupBy === 'viewer' ? 8 : 0)})`);

    if (groupBy === 'couple') {
      svg
        .append('g')
        .call(d3.axisLeft(scales.yLeft).tickSize(0) as any)
        .attr('transform', `translate(${margin.left},${margin.top + scales.yRight.bandwidth() + 26})`)
        .style('font-size', 15)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .attr('class', 'extraaxis');

      svg
        .append('g')
        .call(d3.axisLeft(scales.yLeft).tickSize(0) as any)
        .attr('transform', `translate(${margin.left},${margin.top + scales.yRight.bandwidth() * 2 + 38})`)
        .style('font-size', 15)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .attr('class', 'extraaxis');
    } else {
      svg
        .append('g')
        .call(d3.axisRight(scales.yRight).tickSize(0) as any)
        .attr('transform', `translate(${width + margin.right},${margin.top + (scales.yLeft.bandwidth() + 8) * 3 + 2})`)
        .style('font-size', 15)
        .style('opacity', 0)
        .transition()
        .duration(1000)
        .style('opacity', 1)
        .attr('class', 'extraaxis');
    }

    svg.selectAll('.domain').remove();
  }, [groupBy]);

  // Initialize winner visualization
  useEffect(() => {
    if (!winnerSvgRef.current || !winScales || finalResults.length === 0) return;

    const svg = d3.select(winnerSvgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width + margin.left + margin.right).attr('height', 200 + margin.top + margin.bottom);

    svg
      .append('g')
      .call(d3.axisTop(winScales.x).tickSize(2).ticks(5) as any)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('.tick text')
      .style('font-size', 14);

    svg
      .append('g')
      .call(d3.axisLeft(winScales.y).tickSize(0) as any)
      .attr('transform', `translate(${margin.left},${margin.top})`)
      .selectAll('.tick text')
      .style('font-size', 14);

    svg.selectAll('.domain').remove();

    svg
      .selectAll('rect.winBar')
      .data(finalResults)
      .enter()
      .append('rect')
      .attr('class', 'winBar')
      .attr('x', (e) => (e.value < 0 ? winScales.x(e.value) : winScales.x(0)))
      .attr('y', (d) => winScales.y(d.viewer) || 0)
      .attr('height', winScales.y.bandwidth())
      .attr('width', (e) =>
        e.value < 0 ? winScales.x(0) - winScales.x(e.value) : winScales.x(e.value) - winScales.x(0)
      )
      .style('stroke-width', 1)
      .style('stroke', 'white')
      .attr('fill', RED_COLOR)
      .style('opacity', 0.8)
      .attr('rx', 3)
      .attr('ry', 3)
      .attr('transform', `translate(${margin.left},${margin.top})`);
  }, [winScales, finalResults]);

  // Update winner visualization
  useEffect(() => {
    if (!winnerSvgRef.current || !winScales) return;

    d3.select(winnerSvgRef.current)
      .selectAll('rect.winBar')
      .data(finalResults)
      .transition()
      .duration(500)
      .attr('x', (e) => (e.value < 0 ? winScales.x(e.value) : winScales.x(0)))
      .attr('y', (d) => winScales.y(d.viewer) || 0)
      .attr('height', winScales.y.bandwidth())
      .attr('width', (e) =>
        e.value < 0 ? winScales.x(0) - winScales.x(e.value) : winScales.x(e.value) - winScales.x(0)
      );
  }, [finalResults, winScales]);

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Card elevation={0} sx={{ maxWidth: 500, backgroundColor: 'transparent' }}>
          <CardContent sx={{ maxWidth: 400 }}>
            <Typography variant="body2">
              In December 2020, five friends watched Married at First Sight season five. This dashboard was used to
              track predictions about the couples.
              <br />
              <br />
              <svg width="24" height="15" style={{ marginBottom: '-2pt' }}>
                <rect
                  width="24"
                  height="15"
                  rx="5"
                  ry="5"
                  style={{ fill: RED_COLOR, strokeWidth: 1, stroke: 'rgb(255,255,255)', opacity: 0.8 }}
                />
              </svg>{' '}
              indicates that the couple was predicted to remain together at the end of the season.
              <br />
              <svg width="24" height="15" style={{ marginBottom: '-2pt' }}>
                <rect
                  width="24"
                  height="15"
                  rx="5"
                  ry="5"
                  style={{ fill: 'rgb(0,0,0)', strokeWidth: 1, stroke: 'rgb(255,255,255)', opacity: 0.35 }}
                />
              </svg>{' '}
              indicates the couple was predicted to divorce at the end of the season
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Typography variant="body2">As of episode:</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <svg ref={svgRef} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <ToggleButtonGroup
          value={groupBy}
          exclusive
          onChange={(_, newValue) => newValue && setGroupBy(newValue)}
          size="small"
        >
          <ToggleButton value="viewer">Group by Viewer</ToggleButton>
          <ToggleButton value="couple">Group by Couple</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ my: 3 }}>
        <Box component="hr" />
      </Box>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2">Select winners:</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 2 }}>
        <Button
          size="small"
          variant="contained"
          disableElevation
          onClick={() => setSnButton(!snButton)}
          sx={{ backgroundColor: snButton ? RED_COLOR : 'grey.400' }}
        >
          S&N
        </Button>
        <Button
          size="small"
          variant="contained"
          disableElevation
          onClick={() => setCdButton(!cdButton)}
          sx={{ backgroundColor: cdButton ? RED_COLOR : 'grey.400' }}
        >
          C&D
        </Button>
        <Button
          size="small"
          variant="contained"
          disableElevation
          onClick={() => setAaButton(!aaButton)}
          sx={{ backgroundColor: aaButton ? RED_COLOR : 'grey.400' }}
        >
          A&A
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <svg ref={winnerSvgRef} />
      </Box>

      <Box sx={{ textAlign: 'center', mt: 1 }}>
        <Typography variant="caption">
          (difference between number of right and number of wrong predictions)
        </Typography>
      </Box>
    </Container>
  );
}

export default MafsOne;
