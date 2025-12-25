<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col align="center">
        <svg id="movingViz" />
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters style="margin-top: 8px">
      <v-col align="center">
        <v-card flat max-width="350" color="rgba(0,0,0,0)">
          <h4>
            Predictions as of: <u>{{ episodeAsOf }}</u>
          </h4>
          <v-row justify="center" no-gutters>
            <v-card-text>
              <v-slider
                v-model="sliderNumber"
                step="1"
                min="1"
                :max="sliderMax"
                ticks="always"
                tick-size="5"
                :tick-labels="ticksLabels"
                @click="autoScroll = false"
              ></v-slider>
            </v-card-text>
          </v-row>
          <v-row justify="center" no-gutters style="margin-top: -36px">
            <v-checkbox
              v-model="autoScroll"
              label="Auto scroll every 2 seconds"
              style="transform: scale(0.85)"
            ></v-checkbox>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from "d3";
import MAFS_results from "../lib/data/MAFS.json";

function colorSquare(marriedString) {
  switch (marriedString) {
    case "Married":
      return "red";
    case "Divorced":
      return "grey";
    default:
      "green";
  }
}

export function wrap(text, width) {
  text.each(function() {
    var text = d3.select(this),
      words = text
        .text()
        .split(/\s+/)
        .reverse(),
      word,
      line = [],
      lineNumber = 0,
      lineHeight = 1.1, // ems
      y = text.attr("y"),
      dy = parseFloat(text.attr("dy")),
      tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy + "em");
    while ((word = words.pop())) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", ++lineNumber * lineHeight + dy + "em")
          .text(word);
      }
    }
  });
}

export default {
  components: {},
  data: () => ({
    margin: { top: 35, right: 35, bottom: 0, left: 50 },
    width: 250,
    height: 365,
    surveyResults: MAFS_results,
    transitionDuration: 600,
    sliderNumber: 1,
    ticksLabels: ["Ep 2", "4", "7", "9", "11", "13", "15"], // make computed property
    autoScroll: true,
    // smybols:
    brokenHeartD:
      '<path d="m11.959 0.328c-1.147-0.531-2.518-0.393-3.573 0.242l-1.148 2.508 2.274 1.98-2.38 3.216 0.871-2.995-2.914-1.967 0.858-2.525c-1.085-0.812-2.617-1.045-3.884-0.459-1.901 0.882-2.81 3.135-1.308 5.794 1.067 1.891 2.958 3.317 6.256 5.872 3.299-2.555 5.189-3.98 6.257-5.872 1.502-2.659 0.592-4.912-1.309-5.794z"/>',
    married:
      '<g><g><path d="M361.015,132.181c1.89,7.237,8.411,12.329,15.932,12.329c7.651,0,14.082-5.248,15.932-12.328C382.018,132.181,372.024,132.181,361.015,132.181z"/></g></g><g><g><path d="M509.541,176.605c-4.874-8.079-15.374-10.676-23.453-5.802c-23.54,14.204-17.872,10.784-31.946,19.276c-2.502-7.054-5.703-16.16-8.1-23.14c-6.759-19.67-18.71-34.759-39.5-34.759h-3.939c-1.995,12.364-12.738,21.838-25.656,21.838c-12.843,0-23.653-9.421-25.657-21.838c0,0-19.005-7.354-25.216-10.058l9.019-44.427c4.024-19.824,21.625-34.212,41.853-34.212s37.83,14.387,41.854,34.212l9.812,48.333c5.053,2.653,10.045,6.508,14.652,11.998l-12.731-62.714c-5.152-25.379-27.689-43.801-53.587-43.801c-25.897,0-48.434,18.422-53.587,43.802l-8.51,41.921l-18.758-8.168l-29.806-37.819c0.492,6.372-0.661,12.421-3.266,17.982l-9.721,20.738l18.615,23.621c1.746,2.215,4.012,3.963,6.598,5.089c5.552,2.418,48.863,21.276,58.952,25.669l-0.953,6.864c-4.704,3.449-7.805,9.181-9.071,12.253c-1.67,4.053-1.419,11.032,0.15,15.126l6.681,17.424c-14.658,24.224-24.29,50.701-28.653,78.797l-19.668,126.635c-2.418,15.569,9.662,29.592,25.337,29.592h20.232v8.721c0,11.322,9.179,20.501,20.501,20.501s20.501-9.178,20.501-20.501v-8.721h8.851v8.721c0,11.322,9.179,20.501,20.501,20.501s20.501-9.178,20.501-20.501v-8.721h20.231c15.714,0,27.755-14.025,25.337-29.592c-1.818-11.711-17.661-113.715-19.668-126.635c-4.364-28.096-13.995-54.572-28.653-78.797l3.88-10.119c1.699,4.782,3.527,9.904,5.487,15.373c0.004,0.012,0.011,0.023,0.014,0.036c3.656,10.133,15.676,14.393,24.894,8.831c16.587-10.009,33.107-19.977,49.844-30.076C511.819,195.183,514.416,184.683,509.541,176.605z M345.381,180.604c0.03-0.031,0.06-0.062,0.09-0.094c3.52-3.626,8.436-5.886,13.888-5.886c5.451,0,10.363,2.261,13.877,5.886c1.52,1.568,2.783,3.389,3.709,5.399c0.925-2.01,2.189-3.83,3.709-5.399c3.514-3.626,8.426-5.886,13.877-5.886c5.452,0,10.37,2.262,13.889,5.886c4.655,4.795,6.09,11.861,3.675,18.091l-5.462,14.094h-59.376l-5.466-14.106C339.398,192.412,340.797,185.389,345.381,180.604z M435.119,296.854l19.668,126.634c1.166,7.508-4.646,14.236-12.181,14.236c-30.46,0-100.841,0-131.317,0c-7.507,0-13.346-6.734-12.181-14.236l19.668-126.634c3.882-24.997,12.397-49.017,25.064-70.846h66.217C422.721,247.838,431.237,271.857,435.119,296.854z"/></g></g><g><g><path d="M376.947,50.083c-19.554,0-35.407,15.852-35.407,35.406c0,19.608,15.937,35.406,35.406,35.406c19.45,0,35.407-15.778,35.407-35.406C412.353,65.935,396.501,50.083,376.947,50.083z"/></g></g><g><g><circle cx="110.766" cy="83.618" r="37.95"/></g></g><g>	<g><path d="M238.288,57.423c-0.003-0.001-0.007-0.002-0.01-0.004c-9.087-4.248-20.036-0.362-24.338,8.821c-3.272,6.987-23.589,50.371-26.861,57.36l-66.636,9.352l-24.147,0.077c-4.461,0.014-8.871,0.965-12.941,2.791l-72.533,32.534c-8.525,3.822-12.806,13.448-9.932,22.339l26.008,80.473c3.109,9.625,13.432,14.902,23.053,11.793c9.622-3.11,14.902-13.432,11.792-23.054L40.786,195.05l31.223-13.999c0.821,110.711,0.875,99.52,0.469,102.058l-12.543,78.488l-35.973,88.65c-4.562,11.245,0.854,24.059,12.099,28.622c11.235,4.561,24.055-0.847,28.621-12.099l36.915-90.97c0.627-1.542,1.075-3.15,1.337-4.794l11.858-74.199l19.291,75.06l1.816,87.1c0.254,12.209,10.404,21.795,22.425,21.51c12.132-0.253,21.763-10.293,21.51-22.425l-1.869-89.646c-0.035-1.69-0.266-3.373-0.687-5.011l-19.046-74.107l0.471-116.201l-32.298-3.207l75.156-10.202c6.06-0.909,11.268-4.784,13.873-10.344c5.078-10.833,27.844-59.397,31.672-67.564C251.387,72.634,247.46,61.718,238.288,57.423z"/></g></g>',
  }),
  mounted() {
    this.instantiateViz();
    this.updateViz();
    this.scheduler();
  },
  computed: {
    sliderMax: function() {
      return this.ticksLabels.length;
    },
    scales: function() {
      const xGroups = d3.map(this.currentData, (e) => e.couple).keys();
      const yGroups = d3.map(this.currentData, (e) => e.viewer).keys();
      const x = d3
        .scaleBand()
        .range([0, this.width]) //pixles
        .domain(xGroups); // domains are hardcoded
      const y = d3
        .scaleBand()
        .range([0, this.height]) //pixles
        .domain(yGroups);
      return { x, y };
    },
    episodeAsOf: function() {
      switch (this.sliderNumber) {
        case 1:
          return "Episode 2";
        case 2:
          return "Episode 4";
        case 3:
          return "Episode 7";
        case 4:
          return "Episode 9";
        case 5:
          return "Episode 11";
        case 6:
          return "Episode 13";
        case 7:
          return "Episode 15";
        default:
          return "Episode 2";
      }
    },
    currentData: function() {
      return this.surveyResults.filter((e) => e.AsOf === this.episodeAsOf);
    },
  },
  watch: {
    currentData() {
      this.updateViz();
    },
  },
  methods: {
    scheduler: function() {
      setInterval(this.movePrediction, 2000);
    },
    movePrediction: function() {
      if (this.autoScroll) {
        if (this.sliderNumber < this.sliderMax) this.sliderNumber++;
        else this.sliderNumber = 1;
      }
    },
    instantiateViz: function() {
      // make the svg:
      const svg = d3
        .select("#movingViz")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
      // svg
      //   .append("rect")
      //   .attr("x", 0)
      //   .attr("y", 0)
      //   .attr("width", this.width + this.margin.left + this.margin.right)
      //   .attr("height", this.height + this.margin.top + this.margin.bottom)
      //   .style("stroke", "black")
      //   .style("fill", "none")
      //   .style("stroke-width", 3);

      // ----- axes ----
      svg
        .append("g")
        .call(d3.axisTop(this.scales.x).tickSize(0))
        .selectAll(".tick text")
        .call(wrap, this.scales.x.bandwidth() - 30)
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + (this.margin.top - 15) + ")"
        )
        .style("font-size", 14);

      svg
        .append("g")
        .call(d3.axisLeft(this.scales.y).tickSize(0))
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .style("font-size", 15);

      // squares
      svg
        .selectAll("mySquares")
        .data(this.currentData)
        .enter()
        .append("rect")
        .attr("x", (e) => this.scales.x(e.couple))
        .attr("y", (e) => this.scales.y(e.viewer))
        .attr("width", this.scales.x.bandwidth())
        .attr("height", this.scales.y.bandwidth())
        .style("stroke-width", 4)
        .style("stroke", "white")
        .attr("fill", (e) => colorSquare(e.prediction))
        .style("opacity", 0.8)
        .attr("rx", 10)
        .attr("ry", 10)
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .attr("id", "mySquares");

      svg.selectAll(".domain").remove();
    },
    updateViz: async function() {
      //clear the icons first
      await d3.selectAll("#divorcedIcons").remove();
      await d3.selectAll("#marriedIcons").remove();

      // update the squares
      await d3
        .selectAll("#mySquares")
        .data(this.currentData)
        .transition()
        .duration(this.transitionDuration)
        .attr("fill", (e) => colorSquare(e.prediction));

      let svg = d3.select("#movingViz");

      await svg
        .selectAll("mySymbols")
        .data(this.currentData)
        .enter()
        .append("svg")
        .attr("x", (e) => this.scales.x(e.couple) + this.margin.left + 20)
        .attr("y", (e) => this.scales.y(e.viewer) + this.margin.top + 8)
        .attr("height", "72")
        .attr("width", "72")
        .attr("viewBox", "0 0 800 800")
        .html((e) => (e.prediction === "Married" ? this.married : ""))
        .attr("id", "marriedIcons");

      await svg
        .selectAll("mySymbols")
        .data(this.currentData)
        .enter()
        .append("svg")
        .attr("x", (e) => this.scales.x(e.couple) + this.margin.left + 24)
        .attr("y", (e) => this.scales.y(e.viewer) + this.margin.top + 16)
        .attr("height", "72")
        .attr("width", "72")
        .attr("viewBox", "0 0 30 30")
        .html((e) => (e.prediction === "Married" ? "" : this.brokenHeartD))
        .attr("id", "divorcedIcons");
    },
  },
};
</script>
