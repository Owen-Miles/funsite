import { useEffect, useRef, useState, useMemo } from 'react';
import type { ReactNode } from 'react';
import {
  Container,
  Box,
  Typography,
  Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import * as d3 from 'd3';
import { BACKGROUND_COLOR } from '../theme';

// Constants
const CHART_CONFIG = {
  width: 400,
  height: 300,
  margin: { top: 20, left: 150, right: 150, bottom: 80, xAxis: 30, yAxis: 10 },
  transitionDuration: { slow: 1000, fast: 50 },
  colors: {
    distroLines: '#2f4f87',
    axes: '#4f4f4f',
    carbonDateLine: '#B22222',
  },
  distroRange: 25,
  distroBins: 20,
  stdDevMultiplier: 3,
};

const SLIDER_STYLES = {
  color: '#666',
  '& .MuiSlider-thumb': { width: 12, height: 12 },
  '& .MuiSlider-track': { height: 2 },
  '& .MuiSlider-rail': { height: 2, opacity: 0.3 },
};

// Utility functions
const carbon14Calc = (depletion: number): number => {
  return -8033 * Math.log(1 + depletion);
};

const normalDist = (sigma: number, mean: number, e: number): number => {
  return (
    (1 / (sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp((-0.5 * (e - mean) ** 2) / sigma ** 2)
  );
};

const clampDate = (depletion: number): number => {
  if (depletion >= 998) return 998;
  if (depletion <= 12) return 12;
  return depletion;
};

// Types
interface DistroDataPoint {
  bin: number;
  dist: number;
}

interface RadiocarbonPoint {
  x: number;
  y: number;
}

interface SliderRowProps {
  label: ReactNode;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
}

// Components
const SliderRow = ({ label, value, onChange, min, max }: SliderRowProps) => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', px: 2, py: 1 }}>
    <Typography sx={{ width: '30%', textAlign: 'right', pr: 2 }} component="div" variant="body2">
      {label}
    </Typography>
    <Box sx={{ width: '50%' }}>
      <Slider
        value={value}
        onChange={(_, val) => onChange(val as number)}
        max={max}
        min={min}
        size="small"
        sx={SLIDER_STYLES}
      />
    </Box>
    <Box sx={{ width: '20%', pl: 2 }}>
      <TextField
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        type="number"
        size="small"
        sx={{ width: 70 }}
      />
    </Box>
  </Box>
);

// Helper functions
const createScales = (width: number, height: number, timeScale: 'linear' | 'log', distroMax: number) => {
  const xLinear = d3.scaleLinear().range([0, width]).domain([0, 50000]);
  const xLog = d3.scaleLog().range([0, width]).domain([100, 50000]);
  const yScale = d3.scaleLinear().range([0, height]).domain([100, 0]);
  const y2 = d3.scaleLinear().range([0, height]).domain([0, 1000]);
  const ydistrox = d3.scaleLinear().range([0, CHART_CONFIG.distroRange]).domain([0, distroMax]);
  const xdistroy = d3.scaleLinear().range([0, CHART_CONFIG.distroRange]).domain([distroMax, 0]);

  return {
    x: timeScale === 'log' ? xLog : xLinear,
    y: yScale,
    y2,
    ydistrox,
    xdistroy,
  };
};

const calculateDistributionData = (mean: number, sigma: number) => {
  const binsStart = mean - CHART_CONFIG.stdDevMultiplier * sigma;
  const binsEnd = mean + CHART_CONFIG.stdDevMultiplier * sigma;
  const binSize = (binsEnd - binsStart) / CHART_CONFIG.distroBins;
  
  const bins: number[] = [];
  for (let i = binsStart; i < binsEnd; i += binSize) {
    bins.push(i);
  }
  
  const yData = bins.map((e) => ({
    bin: e,
    dist: normalDist(sigma, mean, e),
  }));

  const xData = yData.map((e) => ({
    bin: carbon14Calc(-clampDate(e.bin) / 1000),
    dist: e.dist,
  }));

  return { yData, xData };
};

function CarbonForteen() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [inputPerMilDepleted, setInputPerMilDepleted] = useState(985);
  const [standardDeviation, setStandardDeviation] = useState(5);
  const [timeScale, setTimeScale] = useState<'linear' | 'log'>('linear');

  const { width, height, margin, transitionDuration, colors } = CHART_CONFIG;

  // Computed values
  const distroMax = useMemo(
    () => normalDist(standardDeviation, inputPerMilDepleted, inputPerMilDepleted),
    [standardDeviation, inputPerMilDepleted]
  );

  const { yData: yDistroData, xData: xDistroData } = useMemo(
    () => calculateDistributionData(inputPerMilDepleted, standardDeviation),
    [inputPerMilDepleted, standardDeviation]
  );

  const estRadiocarbonDates: RadiocarbonPoint[] = useMemo(
    () => [{ x: carbon14Calc(-inputPerMilDepleted / 1000), y: inputPerMilDepleted }],
    [inputPerMilDepleted]
  );

  const scales = useMemo(
    () => createScales(width, height, timeScale, distroMax),
    [timeScale, distroMax, width, height]
  );

  const radiocarbonLineData: RadiocarbonPoint[] = useMemo(() => {
    const depletions = [-0.0125, -0.02, -0.05, -0.07, -0.1, -0.2, -0.3, -0.4, -0.5, -0.6, -0.7, -0.8, -0.9, -0.95, -0.99, -0.998];
    return depletions.map((e) => ({ x: carbon14Calc(e), y: -e * 1000 }));
  }, []);

  const carbonLine = useMemo(() => {
    return d3
      .line<RadiocarbonPoint>()
      .x((e) => scales.x(e.x))
      .y((e) => scales.y2(e.y))
      .curve(d3.curveMonotoneX);
  }, [scales]);

  const distroLines = useMemo(() => {
    const y = d3
      .line<DistroDataPoint>()
      .x((e) => scales.ydistrox(e.dist))
      .y((e) => scales.y2(e.bin))
      .curve(d3.curveMonotoneX);

    const x = d3
      .line<DistroDataPoint>()
      .x((e) => scales.x(e.bin))
      .y((e) => scales.xdistroy(e.dist))
      .curve(d3.curveMonotoneX);

    return { y, x };
  }, [scales]);

  const translations = useMemo(() => {
    const yAxis = `translate(${margin.left - margin.yAxis - 70},${margin.top})`;
    const yAxis2 = `translate(${margin.left - margin.yAxis},${margin.top})`;
    const yAxisTitle = `translate(${margin.left - margin.yAxis - 100},${margin.top + height / 2}),rotate(-90)`;
    const yAxis2Title = `translate(${margin.left - margin.yAxis - 35},${margin.top + height / 2}),rotate(-90)`;
    const xAxis = `translate(${margin.left},${margin.top + height + margin.xAxis})`;
    const xAxisDistro = `translate(${margin.left},${margin.top + height + margin.xAxis - 25})`;
    const data = `translate(${margin.left},${margin.top})`;
    const xAxisTitle = `translate(${margin.left + width / 2},${margin.top + height + margin.xAxis + 40})`;

    return { yAxis, yAxis2, xAxis, yAxisTitle, yAxis2Title, xAxisDistro, data, xAxisTitle };
  }, [margin, width, height]);

  // Initialize visualization
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);

    // X-axis
    svg
      .append('g')
      .call(d3.axisBottom(scales.x).ticks(6))
      .attr('transform', translations.xAxis)
      .style('color', colors.axes)
      .attr('class', 'xaxis');

    svg
      .append('text')
      .attr('transform', translations.xAxisTitle)
      .style('color', colors.axes)
      .style('text-anchor', 'middle')
      .text('Radiocarbon Age (years)')
      .style('font-size', 12);

    // Left Y-axis (Fraction Modern Carbon)
    svg
      .append('g')
      .call(d3.axisLeft(scales.y))
      .attr('class', 'leftaxis')
      .attr('transform', translations.yAxis)
      .style('color', colors.axes);

    svg
      .append('text')
      .attr('transform', translations.yAxisTitle)
      .style('text-anchor', 'middle')
      .style('color', colors.axes)
      .text('Fraction Modern Carbon (percent, %)')
      .style('font-size', 12);

    // Right Y-axis (Depletion)
    svg
      .append('g')
      .call(d3.axisLeft(scales.y2))
      .attr('class', 'leftaxis2')
      .style('color', colors.axes)
      .attr('transform', translations.yAxis2);

    svg
      .append('text')
      .attr('transform', translations.yAxis2Title)
      .style('color', colors.axes)
      .style('text-anchor', 'middle')
      .text('Depletion (per mille, ‰)')
      .style('font-size', 12);

    // Carbon line
    svg
      .append('path')
      .attr('d', carbonLine(radiocarbonLineData))
      .attr('stroke', colors.carbonDateLine)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('transform', translations.data)
      .attr('id', 'theline');

    // Y distribution line
    svg
      .append('path')
      .attr('d', distroLines.y(yDistroData))
      .attr('stroke', colors.distroLines)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('transform', translations.yAxis2)
      .attr('id', 'theydistroline');

    // X distribution line
    svg
      .append('path')
      .attr('d', distroLines.x(xDistroData))
      .attr('stroke', colors.distroLines)
      .attr('fill', 'none')
      .attr('stroke-width', 2)
      .attr('transform', translations.xAxisDistro)
      .attr('id', 'thexdistroline');

    // Data point
    svg
      .selectAll('circle.datapoint')
      .data(estRadiocarbonDates)
      .enter()
      .append('circle')
      .attr('class', 'datapoint')
      .attr('cx', (e) => scales.x(e.x))
      .attr('cy', (e) => scales.y2(e.y))
      .attr('r', 2)
      .style('fill', 'black')
      .attr('transform', translations.data)
      .attr('id', 'thedots');
  }, []);

  // Handle time scale toggle
  const handleTimeScaleChange = (newScale: 'linear' | 'log') => {
    if (!svgRef.current || !newScale) return;
    
    setTimeScale(newScale);
    
    const svg = d3.select(svgRef.current);

    // Calculate scales for the new time scale
    const xLinear = d3.scaleLinear().range([0, width]).domain([0, 50000]);
    const xLog = d3.scaleLog().range([0, width]).domain([100, 50000]);
    const yScale = d3.scaleLinear().range([0, height]).domain([100, 0]);
    const y2 = d3.scaleLinear().range([0, height]).domain([0, 1000]);
    const ydistrox = d3.scaleLinear().range([0, 25]).domain([0, distroMax]);
    const xdistroy = d3.scaleLinear().range([0, 25]).domain([distroMax, 0]);

    const newScales = {
      x: newScale === 'log' ? xLog : xLinear,
      y: yScale,
      y2,
      ydistrox,
      xdistroy,
    };

    svg
      .selectAll('.xaxis')
      .transition()
      .duration(transitionDuration.slow)
      .call(
        d3
          .axisBottom(newScales.x)
          .tickFormat(
            newScale === 'log'
              ? (x) => (/[15]/.test(x.toString()) ? x.toString() : '')
              : d3.format(',.0f')
          )
          .ticks(newScale === 'log' ? 10 : 5) as any
      );

    const carbonLineGenerator = d3
      .line<RadiocarbonPoint>()
      .x((e) => newScales.x(e.x))
      .y((e) => newScales.y2(e.y))
      .curve(d3.curveMonotoneX);

    const xDistroLineGenerator = d3
      .line<DistroDataPoint>()
      .x((e) => newScales.x(e.bin))
      .y((e) => xdistroy(e.dist))
      .curve(d3.curveMonotoneX);

    svg
      .selectAll('#thedots')
      .data(estRadiocarbonDates)
      .transition()
      .duration(transitionDuration.slow)
      .attr('cy', (e) => newScales.y2(e.y))
      .attr('cx', (e) => newScales.x(e.x));

    svg
      .selectAll('#theline')
      .transition()
      .duration(transitionDuration.slow)
      .attr('d', carbonLineGenerator(radiocarbonLineData));

    svg
      .selectAll('#thexdistroline')
      .transition()
      .duration(transitionDuration.slow)
      .attr('d', xDistroLineGenerator(xDistroData));
  };

  // Handle slider input changes
  const handleInputChange = (newInputValue?: number, newStdDevValue?: number) => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const currentInput = newInputValue ?? inputPerMilDepleted;
    const currentStdDev = newStdDevValue ?? standardDeviation;

    const newEstRadiocarbonDates: RadiocarbonPoint[] = [
      { x: carbon14Calc(-currentInput / 1000), y: currentInput }
    ];

    const { yData: newYDistroData, xData: newXDistroData } = calculateDistributionData(currentInput, currentStdDev);
    const newDistroMax = normalDist(currentStdDev, currentInput, currentInput);
    
    const ydistrox = d3.scaleLinear().range([0, CHART_CONFIG.distroRange]).domain([0, newDistroMax]);
    const xdistroy = d3.scaleLinear().range([0, CHART_CONFIG.distroRange]).domain([newDistroMax, 0]);

    const yDistroLineGenerator = d3
      .line<DistroDataPoint>()
      .x((e) => ydistrox(e.dist))
      .y((e) => scales.y2(e.bin))
      .curve(d3.curveMonotoneX);

    const xDistroLineGenerator = d3
      .line<DistroDataPoint>()
      .x((e) => scales.x(e.bin))
      .y((e) => xdistroy(e.dist))
      .curve(d3.curveMonotoneX);

    svg
      .selectAll('#thedots')
      .data(newEstRadiocarbonDates)
      .transition()
      .duration(transitionDuration.fast)
      .attr('cy', (e) => scales.y2(e.y))
      .attr('cx', (e) => scales.x(e.x));

    svg
      .selectAll('#theydistroline')
      .transition()
      .duration(transitionDuration.fast)
      .attr('d', yDistroLineGenerator(newYDistroData));

    svg
      .selectAll('#thexdistroline')
      .transition()
      .duration(transitionDuration.fast)
      .attr('d', xDistroLineGenerator(newXDistroData));
  };

  // Handler for input per mil depleted changes
  const handleInputPerMilDepletedChange = (newValue: number) => {
    setInputPerMilDepleted(newValue);
    handleInputChange(newValue, undefined);
  };

  // Handler for standard deviation changes
  const handleStandardDeviationChange = (newValue: number) => {
    setStandardDeviation(newValue);
    handleInputChange(undefined, newValue);
  };

  return (
    <Container maxWidth="md">
      <Typography sx={{ textAlign: 'center', maxWidth: '350pt', mx: 'auto', mt: 2 }} variant="body2">
        Interactive radiocarbon dating plot, to show uncertainty in age estimation.
        <br />
        Select log or linear time, and drag the sliders below.
      </Typography>

      <Box
        sx={{
          width: width + 300,
          mx: 'auto',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2.5, mb: -2 }}>
          <ToggleButtonGroup
            value={timeScale}
            exclusive
            onChange={(_, value) => value && handleTimeScaleChange(value)}
            size="small"
          >
            <ToggleButton value="linear" sx={{ width: 80, backgroundColor: BACKGROUND_COLOR, py: 0.5 }}>
              Linear
            </ToggleButton>
            <ToggleButton value="log" sx={{ width: 80, backgroundColor: BACKGROUND_COLOR, py: 0.5 }}>
              Log
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <svg ref={svgRef} />
        </Box>

        <SliderRow
          label={
            <>
              Estimated 14C Depletion <br />(per mille, ‰)
            </>
          }
          value={inputPerMilDepleted}
          onChange={handleInputPerMilDepletedChange}
          min={10}
          max={997}
        />

        <SliderRow
          label={
            <>
              Standard Deviation of Estimate <br />(per mille, ‰)
            </>
          }
          value={standardDeviation}
          onChange={handleStandardDeviationChange}
          min={1}
          max={25}
        />

        <Box sx={{ px: 4, pb: 2 }}>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Purpose: to experiment with interactively showing estimates uncertainty, using radiocarbon dating as an
            example. Uncertainty is shown with a normal distriution on the input, with plus or minus three standard
            deviations (99.7% probability). Made with D3.
            <br />
            <br />
            Note: showing the fraction modern carbon, because it is more intuitive to me, but the convention is to use
            per mille depletion of 14C.
            <br />
            Also, real laboratory standard deviations are frequently less than 1 per mille, and are much more accurate
            than this dashboard initally suggests. Eventually I will refine the scales to show much smaller errors,
            which is more realistic, but for now this illustrates the concept.
            <br />
            <br />
            (Age calibration with IntCal coming soon...)
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default CarbonForteen;
