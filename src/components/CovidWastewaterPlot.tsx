import { useEffect, useRef, useState, useMemo } from 'react';
import { Container, Box, Typography, ToggleButton, ToggleButtonGroup, Card } from '@mui/material';
import * as d3 from 'd3';
import { BACKGROUND_COLOR } from '../theme';
import rawData from '../data/covidData.json';

type TimeToggleValue = 'time2Plots' | 'time1Plot' | 'noTime';

interface CovidDataPoint {
  Date: string;
  PositiveResults: number | '';
  WW_Daily_copiesPml: number | '';
}

interface PlotDataPoint {
  x: Date | number;
  y1: number | '';
  y1Avg: number | '';
  y2: number | '';
  y2Avg: number | '';
}

const CHART_CONFIG = {
  margin: {
    top: 20,
    left: 60,
    right: 50,
    bottom: 55,
    betweenPlotPadding: 20,
  },
  colorLeft: 'rgb(255,77,77)',
  colorRight: 'rgb(29,129,162)',
  height: 300,
  transitionDuration: 1000,
};

function CovidWastewaterPlot() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [timeToggle, setTimeToggle] = useState<TimeToggleValue>('time1Plot');

  const width = useMemo(() => {
    return window.innerWidth > 400 ? 300 : 200;
  }, []);

  const plotData = useMemo(() => {
    const average = (nums: number[]) => nums.reduce((a, b) => a + b) / nums.length;

    const data: PlotDataPoint[] = [];
    let y1AvgArray: number[] = [];
    let y2AvgArray: number[] = [];

    (rawData as CovidDataPoint[]).forEach((e, index) => {
      let y1Avg: number | '' = '';
      let y2Avg: number | '' = '';

      if (index > 13) {
        y1AvgArray = (rawData as CovidDataPoint[])
          .slice(index - 13, index + 1)
          .map((e) => e.PositiveResults)
          .filter((el) => el !== '') as number[];

        y2AvgArray = (rawData as CovidDataPoint[])
          .slice(index - 13, index + 1)
          .map((e) => e.WW_Daily_copiesPml)
          .filter((el) => el !== '') as number[];
      }

      y1Avg = y1AvgArray.length > 0 ? average(y1AvgArray) : '';
      y2Avg = y2AvgArray.length > 0 ? average(y2AvgArray) : '';

      data.push({
        x: timeToggle === 'noTime' ? (e.WW_Daily_copiesPml as number) : new Date(e.Date),
        y1: e.PositiveResults,
        y1Avg: y1Avg,
        y2: timeToggle === 'noTime' ? e.PositiveResults : e.WW_Daily_copiesPml,
        y2Avg: y2Avg,
      });
    });

    return data;
  }, [timeToggle]);

  const scales = useMemo(() => {
    const yAxisRange = (): [number, number] => {
      switch (timeToggle) {
        case 'time2Plots':
          return [0, CHART_CONFIG.height / 2];
        case 'noTime':
        case 'time1Plot':
          return [0, CHART_CONFIG.height + CHART_CONFIG.margin.betweenPlotPadding];
      }
    };

    const yLeftExtents = d3.extent(plotData.map((e) => e.y1 as number)) as [number, number];
    const yRightExtents = d3.extent(plotData.map((e) => e.y2 as number)) as [number, number];

    let xDomain: [Date, Date] | [number, number] = [new Date(2020, 1, 1), new Date(2022, 1, 1)];
    if (timeToggle === 'noTime') {
      xDomain = d3.extent(plotData.map((e) => e.x as number)) as [number, number];
    }

    const xScale = timeToggle === 'noTime'
      ? d3.scaleLinear().range([0, width]).domain(xDomain as [number, number])
      : d3.scaleTime().range([0, width]).domain(xDomain as [Date, Date]);

    const yLeft = d3.scaleLinear().range(yAxisRange()).domain(yLeftExtents.reverse());
    const yRight = d3.scaleLinear().range(yAxisRange()).domain(yRightExtents.reverse());

    if (timeToggle === 'noTime') {
      return { x: xScale, yLeft: yLeft, yRight: yLeft };
    }

    return { x: xScale, yLeft: yLeft, yRight: yRight };
  }, [plotData, timeToggle, width]);

  const avgLines = useMemo(() => {
    const avgLineRed = d3
      .line<PlotDataPoint>()
      .x((e) => scales.x(e.x as any))
      .y((e) => scales.yLeft(e.y1Avg as number))
      .defined((d) => d.y1Avg !== '');

    const avgLineBlue = d3
      .line<PlotDataPoint>()
      .x((e) => scales.x(e.x as any))
      .y((e) => scales.yRight(e.y2Avg as number))
      .defined((d) => d.y2Avg !== '');

    const avgBothLines = d3
      .line<PlotDataPoint>()
      .x((e) => scales.x(e.y2Avg as any))
      .y((e) => scales.yLeft(e.y1Avg as number))
      .defined((d) => d.y1Avg !== '' && d.y2Avg !== '');

    if (['time2Plots', 'time1Plot'].includes(timeToggle)) {
      return { avgLineRed, avgLineBlue };
    }
    return { avgLineRed: avgBothLines, avgLineBlue: avgBothLines };
  }, [scales, timeToggle]);

  const translations = useMemo(() => {
    const { margin, height } = CHART_CONFIG;
    const leftAxis = `translate(${margin.left},${margin.top})`;
    const xAxis = `translate(${margin.left},${margin.top + margin.betweenPlotPadding * 2 + height})`;

    let rightYAxis = `translate(${margin.left + width},${margin.top + margin.betweenPlotPadding + height / 2})`;
    let rightData = `translate(${margin.left},${margin.top + margin.betweenPlotPadding + height / 2})`;

    if (['noTime', 'time1Plot'].includes(timeToggle)) {
      rightYAxis = `translate(${margin.left + width},${margin.top})`;
      rightData = `translate(${margin.left},${margin.top})`;
    }

    let rightAxisTitle = '';
    let leftAxisTitle = '';
    const xAxisTitle = `translate(${margin.left + width / 2},${margin.top + margin.betweenPlotPadding * 2 + height + 50})`;

    switch (timeToggle) {
      case 'noTime':
        leftAxisTitle = `translate(${margin.left - 50},${margin.top + height / 2}),rotate(-90)`;
        rightAxisTitle = xAxisTitle;
        break;
      case 'time1Plot':
        leftAxisTitle = `translate(${margin.left - 50},${margin.top + height / 2}),rotate(-90)`;
        rightAxisTitle = `translate(${margin.left + width + 50},${margin.top + height / 2}),rotate(-90)`;
        break;
      case 'time2Plots':
        leftAxisTitle = `translate(${margin.left - 50},${margin.top + height / 4}),rotate(-90)`;
        rightAxisTitle = `translate(${margin.left + width + 50},${margin.top + margin.betweenPlotPadding + (height * 3) / 4}),rotate(-90)`;
        break;
    }

    return { rightYAxis, rightAxisTitle, rightData, leftAxis, leftAxisTitle, xAxis, xAxisTitle };
  }, [timeToggle, width]);

  const dataOpacity = useMemo(() => {
    return ['time2Plots', 'time1Plot'].includes(timeToggle) ? 1 : 0.7;
  }, [timeToggle]);

  // Initialize visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { margin, height, colorLeft, colorRight } = CHART_CONFIG;

    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom + margin.betweenPlotPadding * 2);

    // X-axis
    svg
      .append('g')
      .call(
        d3
          .axisBottom(scales.x as any)
          .tickSize(2)
          .tickFormat(d3.timeFormat('%b-%y') as any)
          .ticks(6)
      )
      .attr('transform', translations.xAxis)
      .attr('class', 'xaxis')
      .selectAll('.tick text')
      .style('font-size', 12)
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '.15em')
      .attr('transform', 'rotate(-35)');

    svg
      .append('text')
      .attr('transform', translations.xAxisTitle)
      .attr('class', 'xaxistitle')
      .style('text-anchor', 'middle')
      .text('Month')
      .style('font-size', 12);

    // Left axis
    svg
      .append('g')
      .call(d3.axisLeft(scales.yLeft).tickSize(2).ticks(5))
      .attr('class', 'leftaxis')
      .attr('transform', translations.leftAxis)
      .style('color', colorLeft)
      .selectAll('.tick text')
      .style('font-size', 12);

    svg
      .append('text')
      .attr('transform', translations.leftAxisTitle)
      .attr('class', 'leftaxistitle')
      .style('text-anchor', 'middle')
      .text('Positive Covid Cases per Day')
      .style('font-size', 12)
      .style('fill', colorLeft);

    // Right axis
    svg
      .append('g')
      .call(d3.axisRight(scales.yRight).tickSize(2).ticks(4))
      .attr('class', 'rightaxis')
      .attr('transform', translations.rightYAxis)
      .style('color', colorRight)
      .selectAll('.tick text')
      .style('font-size', 12);

    svg
      .append('text')
      .attr('transform', translations.rightAxisTitle)
      .attr('class', 'rightaxistitle')
      .style('text-anchor', 'middle')
      .text('Covid in Wastewater: Copies per ml')
      .style('font-size', 12)
      .style('fill', colorRight);

    // Red dots
    svg
      .selectAll('dot')
      .data(plotData)
      .enter()
      .append('circle')
      .attr('cx', (e) => scales.x(e.x as any))
      .attr('cy', (e) => scales.yLeft(e.y1 as number))
      .attr('r', 1)
      .style('fill', colorLeft)
      .attr('transform', translations.leftAxis)
      .attr('id', 'redDots');

    // Blue dots
    svg
      .selectAll('dot')
      .data(plotData.filter((e) => e.y2))
      .enter()
      .append('circle')
      .attr('cx', (e) => scales.x(e.x as any))
      .attr('cy', (e) => scales.yRight(e.y2 as number))
      .attr('r', 1)
      .style('fill', colorRight)
      .attr('transform', translations.rightData)
      .attr('id', 'blueDots');

    // Red line
    svg
      .append('path')
      .attr('d', avgLines.avgLineRed(plotData))
      .attr('stroke', colorLeft)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('transform', translations.leftAxis)
      .attr('id', 'theRedLine');

    // Blue line
    svg
      .append('path')
      .attr('d', avgLines.avgLineBlue(plotData))
      .attr('stroke', colorRight)
      .attr('stroke-width', 2)
      .attr('fill', 'none')
      .attr('transform', translations.rightData)
      .attr('id', 'theBlueLine');
  }, []);

  // Update visualization on toggle change
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const { transitionDuration, colorRight } = CHART_CONFIG;

    // Update dots and lines
    svg
      .selectAll('#redDots')
      .data(plotData)
      .transition()
      .duration(transitionDuration)
      .attr('cy', (e: any) => scales.yLeft(e.y1))
      .attr('cx', (e: any) => scales.x(e.x))
      .attr('transform', translations.leftAxis)
      .style('opacity', dataOpacity);

    svg
      .selectAll('#blueDots')
      .data(plotData.filter((e) => e.y2))
      .transition()
      .duration(transitionDuration)
      .attr('cy', (e: any) => scales.yRight(e.y2))
      .attr('cx', (e: any) => scales.x(e.x))
      .attr('transform', translations.rightData)
      .style('opacity', dataOpacity);

    svg
      .selectAll('#theRedLine')
      .transition()
      .duration(transitionDuration)
      .attr('d', avgLines.avgLineRed(plotData))
      .attr('transform', translations.leftAxis)
      .style('opacity', dataOpacity);

    svg
      .selectAll('#theBlueLine')
      .transition()
      .duration(transitionDuration)
      .attr('d', avgLines.avgLineBlue(plotData))
      .attr('transform', translations.rightData)
      .style('opacity', dataOpacity);

    // Update axes
    svg
      .selectAll('.leftaxis')
      .transition()
      .duration(transitionDuration)
      .call(d3.axisLeft(scales.yLeft).tickSize(2).ticks(5) as any);

    svg
      .selectAll('.rightaxis')
      .transition()
      .duration(transitionDuration)
      .call(d3.axisRight(scales.yRight).tickSize(2).ticks(5).tickPadding(3) as any)
      .attr('transform', translations.rightYAxis);

    svg
      .selectAll('.rightaxistitle')
      .transition()
      .duration(transitionDuration)
      .attr('transform', translations.rightAxisTitle);

    svg
      .selectAll('.leftaxistitle')
      .transition()
      .duration(transitionDuration)
      .attr('transform', translations.leftAxisTitle);

    // Handle noTime mode
    if (timeToggle === 'noTime') {
      svg.selectAll('.xaxis').transition().duration(transitionDuration).style('opacity', 0);
      svg.selectAll('.xaxistitle').transition().duration(transitionDuration).style('opacity', 0);
      svg
        .selectAll('.rightaxis')
        .transition()
        .duration(transitionDuration)
        .call(
          d3
            .axisBottom(scales.x as any)
            .tickSize(2)
            .tickFormat(d3.format(',.0f') as any)
            .tickPadding(10)
            .ticks(4) as any
        )
        .style('color', colorRight)
        .attr('transform', translations.xAxis);
    } else {
      svg.selectAll('.xaxis').transition().duration(transitionDuration).style('opacity', 1);
      svg.selectAll('.xaxistitle').transition().duration(transitionDuration).style('opacity', 1);
    }
  }, [timeToggle, plotData, scales, avgLines, translations, dataOpacity]);

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 600,
            backgroundColor: 'transparent',
            border: 'none',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="body2" sx={{ textAlign: 'center', maxWidth: '300pt', p: 1 }}>
              Plots with multiple axes can be misleading. This graph that compares a two-axis plot and alternatives.
              It is based on this post:{' '}
              <a href="https://blog.datawrapper.de/dualaxis/">
                "Why not to use two axes, and what to use instead"
              </a>
              . Select the different options below.
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', my: 1 }}>
            <ToggleButtonGroup
              value={timeToggle}
              exclusive
              onChange={(_, value) => value && setTimeToggle(value)}
              size="small"
            >
              <ToggleButton value="time2Plots" sx={{ backgroundColor: BACKGROUND_COLOR, px: 2 }}>
                Two Time Plots
              </ToggleButton>
              <ToggleButton value="time1Plot" sx={{ backgroundColor: BACKGROUND_COLOR, px: 2 }}>
                Two-axis Plot
              </ToggleButton>
              <ToggleButton value="noTime" sx={{ backgroundColor: BACKGROUND_COLOR, px: 2 }}>
                Direct compare
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <svg ref={svgRef} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <Typography variant="body2" component="div" sx={{ maxWidth: '300pt' }}>
              <ul>
                <li>The line is a 7-day Floating average, dots are daily reported values.</li>
                <li>
                  Data from Massachusetts:{' '}
                  <a href="https://www.mwra.com/biobot/biobotdata.htm">MWRA Wastewater COVID-19 Tracking</a> and{' '}
                  <a href="https://www.mass.gov/info-details/covid-19-response-reporting">
                    MA COVID-19 Response Reporting
                  </a>
                  .
                </li>
                <li>Data colllected in January 2022.</li>
                <li>I am not an epidemiologist.</li>
                <li>This was made for personal interest only.</li>
                <li>This was made with D3.js</li>
              </ul>
            </Typography>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

export default CovidWastewaterPlot;
