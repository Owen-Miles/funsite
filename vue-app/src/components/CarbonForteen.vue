<template>
  <v-container fluid>
    <v-card-text
      class="pa-1"
      style="font-size: 0.75rem; max-width: 350pt; text-align: center; margin: auto; display: block;"
    >
      Interactive radiocarbon dating plot, to show uncertainty in age
      estimation.
      <br />
      Select log or linear time, and drag the sliders below.
    </v-card-text>
    <v-card
      tile
      outlined
      :width="width + 300"
      color="rgba(0,0,0,0.0)"
      style="margin: auto; display: block;"
    >
      <v-row justify="center">
        <v-btn-toggle
          mandatory
          v-model="timeScale"
          rounded
          dense
          style="margin-top:20pt; margin-bottom: -18pt"
        >
          <v-btn
            value="linear"
            x-small
            width="90"
            style="background-color: #f2f0e6"
          >
            Linear Time
          </v-btn>
          <v-btn
            value="log"
            x-small
            width="90"
            style="background-color: #f2f0e6"
          >
            Log Time
          </v-btn>
        </v-btn-toggle>
        <svg id="carbonViz" style="margin: 0 auto;" />
      </v-row>
      <v-row
        justify="center"
        align="center"
        no-gutters
        style="padding-top:10pt"
      >
        <v-col cols="12" sm="3" style="font-size: 0.75rem;">
          Estimated 14C Depletion <br />(per mille, ‰)
        </v-col>
        <v-col cols="8" sm="5" style="transform: scale(0.85)">
          <v-slider
            v-model="inputPerMilDepleted"
            :max="997"
            :min="10"
            color="black"
            hide-details
            dense
            track-color="grey"
            class="align-center"
          >
            <template v-slot:append>
              <v-text-field
                v-model="inputPerMilDepleted"
                hide-details
                class="mt-0 pt-0"
                type="number"
                style="width: 60px; "
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12" sm="3" style="font-size: 0.75rem;">
          Standard Deviation of Estimate <br />(per mille, ‰)
        </v-col>
        <v-col cols="8" sm="5" style="transform: scale(0.85)">
          <v-slider
            v-model="standardDeviation"
            :max="25"
            :min="1"
            color="black"
            track-color="grey"
            class="align-center"
          >
            <template v-slot:append>
              <v-text-field
                v-model="standardDeviation"
                class="mt-0 pt-0"
                type="number"
                style="width: 60px"
              ></v-text-field>
            </template>
          </v-slider>
        </v-col>
      </v-row>
      <v-row justify="center" align="center" no-gutters>
        <v-col cols="12" sm="9">
          <v-card-text
            class="pa-2"
            style="font-size: 0.75rem;  text-align: center;"
          >
            Purpose: to experiment with interactively showing estimates
            uncertainty, using radiocarbon dating as an example. Uncertainty is
            shown with a normal distriution on the input, with plus or minus
            three standard deviations (99.7% probability). Made with D3.
            <br />
            <br />
            Note: showing the fraction modern carbon, because it is more
            intuitive to me, but the convention is to use per mille depletion of
            14C.
            <br />
            Also, real laboratory standard deviations are frequently less than 1
            per mille, and are much more accurate than this dashboard initally
            suggests. Eventually I will refine the scales to show much smaller
            errors, which is more realistic, but for now this illustrates the
            concept.
            <br />
            <br />
            (Age calibration with IntCal coming soon...)
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import * as d3 from "d3";
// import rawData from "../lib/data/covidData.json";

const carbon14Calc = (depletion) => {
  return -8033 * Math.log(1 + depletion);
};

const normalDist = (sigma, mean, e) => {
  return (
    (1 / (sigma * Math.sqrt(2 * Math.PI))) *
    Math.exp((-0.5 * (e - mean) ** 2) / sigma ** 2)
  );
};

export default {
  components: {},
  data: () => ({
    margin: {
      top: 20,
      left: 150,
      right: 150,
      bottom: 80,
      xAxis: 30,
      yAxis: 10,
    },
    inputPerMilDepleted: 985,
    standardDeviation: 5,
    height: 300,
    timeScale: "linear",
    transitionDuration: 1000,
    colors: {
      distroLines: "#2f4f87",
      axes: "#4f4f4f", //"##4f4f4f",
      carbonDateLine: "#B22222",
    },
  }),
  mounted() {
    this.instantiateViz();
  },
  computed: {
    estimatedRCAge() {
      return carbon14Calc(-this.inputPerMilDepleted / 1000);
    },
    width() {
      return 400;
      // maybe this if I try to make it work on mobile?
      // if (window.innerWidth > 800) return 550 - this.margin.right;
      // if (window.innerWidth < 700) return 500;
      // return window.innerWidth - 350 - this.margin.right;
    },
    estRadiocarbonDates() {
      let inputdata = [this.inputPerMilDepleted];
      return inputdata.map((e) => ({
        x: carbon14Calc(-e / 1000),
        y: e,
      }));
    },
    distroMax() {
      const mean = this.inputPerMilDepleted;
      const sigma = this.standardDeviation;
      return normalDist(sigma, mean, mean);
    },
    yDistroData() {
      const mean = this.inputPerMilDepleted;
      const sigma = this.standardDeviation;
      let binsStart = this.inputPerMilDepleted - 3 * sigma;
      const binsEnd = this.inputPerMilDepleted + 3 * sigma;
      let bins = [];
      const binSize = (binsEnd - binsStart) / 20;
      while (binsStart < binsEnd) {
        bins.push(binsStart);
        binsStart = binsStart + binSize;
      }
      return bins.map((e) => ({
        bin: e,
        dist: normalDist(sigma, mean, e),
      }));
    },
    xDistroData() {
      function clampDate(depletion) {
        if (depletion >= 998) return 998;
        if (depletion <= 12) return 12;
        return depletion;
      }
      return this.yDistroData.map((e) => ({
        bin: carbon14Calc(-clampDate(e.bin) / 1000),
        dist: e.dist,
      }));
    },
    scales() {
      const xLinear = d3
        .scaleLinear()
        .range([0, this.width])
        .domain([0, 50000]);
      const xLog = d3
        .scaleLog()
        .range([0, this.width])
        .domain([100, 50000]);
      const yScale = d3
        .scaleLinear()
        .range([0, this.height])
        .domain([100, 0]);
      const y2 = d3
        .scaleLinear()
        .range([0, this.height])
        .domain([0, 1000]);
      const ydistrox = d3
        .scaleLinear()
        .range([0, 25])
        .domain([0, this.distroMax]);

      const xdistroy = d3
        .scaleLinear()
        .range([0, 25])
        .domain([this.distroMax, 0]);

      if (this.timeScale === "log")
        return {
          x: xLog,
          y: yScale,
          y2: y2,
          ydistrox: ydistrox,
          xdistroy: xdistroy,
        };
      return {
        x: xLinear,
        y: yScale,
        y2: y2,
        ydistrox: ydistrox,
        xdistroy: xdistroy,
      };
    },
    radiocarbonLineData() {
      let depletion = [
        -0.0125,
        -0.02,
        -0.05,
        -0.07,
        -0.1,
        -0.2,
        -0.3,
        -0.4,
        -0.5,
        -0.6,
        -0.7,
        -0.8,
        -0.9,
        -0.95,
        -0.99,
        -0.998,
      ];
      return depletion.map((e) => ({
        x: carbon14Calc(e),
        y: -e * 1000,
      }));
    },
    carbonLine() {
      return d3
        .line()
        .x((e) => this.scales.x(e.x))
        .y((e) => this.scales.y2(e.y))
        .curve(d3.curveMonotoneX);
    },
    distroLines() {
      const y = d3
        .line()
        .x((e) => this.scales.ydistrox(e.dist))
        .y((e) => this.scales.y2(e.bin))
        .curve(d3.curveMonotoneX);

      const x = d3
        .line()
        .x((e) => this.scales.x(e.bin))
        .y((e) => this.scales.xdistroy(e.dist))
        .curve(d3.curveMonotoneX);
      return { y, x };
    },

    translations() {
      let margin = this.margin;
      const yAxis =
        "translate(" +
        (margin.left - margin.yAxis - 70) +
        "," +
        margin.top +
        ")";
      const yAxis2 =
        "translate(" + (margin.left - margin.yAxis) + "," + margin.top + ")";
      const yAxisTitle =
        "translate(" +
        (margin.left - margin.yAxis - 100) +
        "," +
        (margin.top + this.height / 2) +
        "),rotate(-90)";
      const yAxis2Title =
        "translate(" +
        (margin.left - margin.yAxis - 35) +
        "," +
        (margin.top + this.height / 2) +
        "),rotate(-90)";
      const xAxis =
        "translate(" +
        margin.left +
        "," +
        (margin.top + this.height + margin.xAxis) +
        ")";
      const xAxisDistro =
        "translate(" +
        margin.left +
        "," +
        (margin.top + this.height + margin.xAxis - 25) +
        ")";
      const data = "translate(" + margin.left + "," + margin.top + ")";
      const xAxisTitle =
        "translate(" +
        (margin.left + this.width / 2) +
        "," +
        (margin.top + this.height + margin.xAxis + 40) +
        ")";
      return {
        yAxis,
        yAxis2,
        xAxis,
        yAxisTitle,
        yAxis2Title,
        xAxisDistro,
        data,
        xAxisTitle,
      };
    },
  },
  watch: {
    timeScale(next, prev) {
      if (next && prev) this.updateScales();
    },
    inputPerMilDepleted(next, prev) {
      if (next && prev) this.updateRCEstimate();
    },
    standardDeviation() {
      this.updateRCEstimate();
    },
    estRadiocarbonDates() {
      this.updateRCEstimate();
    },
  },
  methods: {
    instantiateViz: function() {
      // make the svg:
      const svg = d3
        .select("#carbonViz")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);

      // // ----- axes ----
      svg
        .append("g")
        .call(d3.axisBottom(this.scales.x).ticks(6))
        .attr("transform", this.translations.xAxis)
        .style("color", this.colors.axes)
        .attr("class", "xaxis");
      svg
        .append("text")
        .attr("transform", this.translations.xAxisTitle)
        .style("color", this.colors.axes)
        .style("text-anchor", "middle")
        .text("Radiocarbon Age (years)")
        .style("font-size", 12);

      svg
        .append("g")
        .call(d3.axisLeft(this.scales.y))
        .attr("class", "leftaxis")
        .attr("transform", this.translations.yAxis)
        .style("color", this.colors.axes);

      svg
        .append("text")
        .attr("transform", this.translations.yAxisTitle)
        .style("text-anchor", "middle")
        .style("color", this.colors.axes)
        .text("Fraction Modern Carbon (percent, %)")
        .style("font-size", 12);

      // The other scale for context:
      svg
        .append("g")
        .call(d3.axisLeft(this.scales.y2))
        .attr("class", "leftaxis2")
        .style("color", this.colors.axes)
        .attr("transform", this.translations.yAxis2);
      svg
        .append("text")
        .attr("transform", this.translations.yAxis2Title)
        .style("color", this.colors.axes)
        .style("text-anchor", "middle")
        .text("Depletion (per mille, ‰)")
        .style("font-size", 12);
      // data: the carbon line
      svg
        .append("path")
        .attr("d", this.carbonLine(this.radiocarbonLineData))
        .attr("stroke", this.colors.carbonDateLine)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.data)
        .attr("id", "theline");
      // data: the distro lines:
      svg
        .append("path")
        .attr("d", this.distroLines.y(this.yDistroData))
        .attr("stroke", this.colors.distroLines)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.yAxis2)
        .attr("id", "theydistroline");
      svg
        .append("path")
        .attr("d", this.distroLines.x(this.xDistroData))
        .attr("stroke", this.colors.distroLines)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.xAxisDistro)
        .attr("id", "thexdistroline");
      // just one dot here:
      svg
        .selectAll("thedots")
        .data(this.estRadiocarbonDates)
        .enter()
        .append("circle")
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("cy", (e) => this.scales.y2(e.y))
        .attr("r", 2)
        .style("fill", "black")
        .attr("transform", this.translations.data)
        .attr("id", "thedots");
    },
    updateScales: async function() {
      const svg = d3.select("#carbonViz");
      await svg
        .selectAll(".xaxis")
        .transition()
        .duration(this.transitionDuration)
        .call(
          d3
            .axisBottom(this.scales.x)
            .tickFormat(
              this.timeScale === "log"
                ? (x) => (/[15]/.test(x) ? x : "") // just show 1s and 5s in the ticks
                : d3.format(",.0f")
            )
            .ticks(this.timeScale === "log" ? 10 : 5)
        );
      await d3
        .selectAll("#thedots")
        .data(this.estRadiocarbonDates)
        .transition()
        .duration(this.transitionDuration)
        .attr("cy", (e) => this.scales.y2(e.y))
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("transform", this.translations.data);

      await d3
        .selectAll("#theline")
        .transition()
        .duration(this.transitionDuration)
        .attr("d", this.carbonLine(this.radiocarbonLineData))
        .attr("transform", this.translations.data);

      await d3
        .selectAll("#thexdistroline")
        .transition()
        .duration(this.transitionDuration)
        .attr("d", this.distroLines.x(this.xDistroData))
        .attr("stroke", this.colors.distroLines)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.xAxisDistro);
    },
    updateRCEstimate: async function() {
      await d3
        .selectAll("#thedots")
        .data(this.estRadiocarbonDates)
        .transition()
        .duration(50)
        .attr("cy", (e) => this.scales.y2(e.y))
        .attr("cx", (e) => this.scales.x(e.x))
        .attr("transform", this.translations.data);

      await d3
        .selectAll("#theydistroline")
        .transition()
        .duration(50)
        .attr("d", this.distroLines.y(this.yDistroData))
        .attr("stroke", this.colors.distroLines)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.yAxis2);

      await d3
        .selectAll("#thexdistroline")
        .transition()
        .duration(50)
        .attr("d", this.distroLines.x(this.xDistroData))
        .attr("stroke", this.colors.distroLines)
        .attr("fill", "none")
        .attr("stroke-width", 2)
        .attr("transform", this.translations.xAxisDistro);
    },
  },
};
</script>
