<template>
  <v-container fluid class="pa-0">
    <svg
      style="display: block; margin-left: auto; margin-right: auto;"
      id="simpleViz"
    />
    <v-card-text
      style="padding-top: 300px; font-size: 0.75rem; max-width: 300pt; text-align: center;"
    >
      A soothing sin wave that changes every 1.3 seconds
    </v-card-text>
  </v-container>
</template>

<script>
import * as d3 from "d3";

export default {
  components: {},
  data: () => ({
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    height: 400,
    // x data range:
    data: { min: 0, max: 30 },
    discretization: 300,
    // axis:
    domain: { x: [0, 30], y: [16, -30] },
    radioMultiplier: 1,
    transitionDuration: 1300,
  }),
  mounted() {
    this.instantiateViz();
    this.scheduler();
  },
  watch: {
    plotData() {
      this.updateViz();
    },
    width() {
      this.updateViz();
    },
  },
  computed: {
    width() {
      return window.innerWidth - 20;
    },
    plotData: function() {
      let x = [this.data.min]; // instantiate X
      let i = this.data.min;
      let delta = (this.data.max - this.data.min) / this.discretization; // how I like to think about the x-delta
      // generate the X data
      while (i < this.data.max) {
        x.push(i + delta);
        i += delta;
      }
      // here make y a function of x
      return x.map((e) => ({
        x: e,
        y: Math.sin(e * this.radioMultiplier) * (this.radioMultiplier + 1),
      }));
    },
    scales: function() {
      const x = d3
        .scaleLinear()
        .range([0, this.width - this.margin.right - this.margin.left]) //pixles
        .domain(this.domain.x); // domains are hardcoded
      const y = d3
        .scaleLinear()
        .range([0, this.height - this.margin.bottom - this.margin.top]) //pixles
        .domain(this.domain.y);
      return { x, y };
    },
  },
  methods: {
    instantiateViz: function() {
      // make the svg:
      let svg = d3
        .select("#simpleViz")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
      svg
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .style("fill", "none");

      // ----- Bars ----
      // bars are like points, because they use
      svg
        .selectAll("myBar")
        .data(this.plotData)
        .enter()
        .append("rect")
        .attr("x", (e) => this.scales.x(e.x))
        .attr("y", (e) => this.scales.y(e.y))
        // ^ THis is wack, and takes some getting used to; everything starts at the top, it's the delta in pixels between the top
        //    and the 0 minus the bar
        .attr("width", 3)
        .attr("height", Math.random() * 200 + 20)
        // putting in a random color in the bars for fun.
        .attr(
          "fill",
          "rgb(" +
            Math.random() * 255 +
            "," +
            Math.random() * 255 +
            "," +
            Math.random() * 255 +
            ")"
        )
        .attr("id", "theBars");
    },

    scheduler: function() {
      setInterval((this.updateViz, this.randomMultiplier), 2000);
    },
    randomMultiplier: function() {
      this.radioMultiplier = Math.random() * 2 + 0.5;
    },
    updateViz: function() {
      // ---- update the bars ----
      d3.selectAll("#theBars")
        .data(this.plotData)
        .transition()
        .duration(this.transitionDuration)
        .attr("x", (e) => this.scales.x(e.x))
        .attr("y", (e) => this.scales.y(e.y))
        .attr("height", Math.random() * 200 + 20)
        // putting in a random color in the bars for fun.
        .attr(
          "fill",
          "rgb(" +
            Math.random() * 255 +
            "," +
            Math.random() * 255 +
            "," +
            Math.random() * 255 +
            ")"
        );
    },
  },
};
</script>
