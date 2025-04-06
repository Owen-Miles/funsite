<template>
    <v-container fluid>
      <v-row justify="center" no-gutters>
        <v-card outlined max-width="600" color="rgba(0,0,0,0)">
          <v-row justify="center" no-gutters>
            <v-col align="center">
              <v-card-text
                class="pa-1"
                style="font-size: 0.75rem; text-align: center; max-width: 300pt"
              >
                Old time music.
              </v-card-text>
            </v-col>
          </v-row>
  

          <v-row justify="center" no-gutters>
            <v-col align="center">
              <svg id="covidViz" />
            </v-col>
          </v-row>

        </v-card>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import * as d3 from "d3";
  import rawData from "../lib/data/covidData.json";
  
  export default {
    components: {},
    data: () => ({
      margin: {
        top: 20,
        left: 60,
        right: 50,
        bottom: 55,
        betweenPlotPadding: 20,
      },
      colorLeft: "rgb(255,77,77)",
      height: 300,
      rawData: rawData,
      timeToggle: "time1Plot",
      transitionDuration: 1000,
    }),
    mounted() {
      this.instantiateViz();
    },
    computed: {
      width: function () {
        if (window.innerWidth > 400) return 300;
        return 200;
      },
      scales: function () {
        const yAxisRange = () => {
          switch (this.timeToggle) {
            case "time2Plots":
              return [0, this.height / 2];
            case "noTime":
            case "time1Plot":
              return [0, this.height + this.margin.betweenPlotPadding];
          }
        };
        // X and Y Depend on the data source selected:
        const yLeftExtents = d3.extent(this.plotData.map((e) => e.y1));
        let yRightExtents = d3.extent(this.plotData.map((e) => e.y2));
  
        let xDomain = [new Date(2020, 1, 1), new Date(2022, 1, 1)];
        if (this.timeToggle === "noTime") {
          xDomain = d3.extent(this.plotData.map((e) => e.x));
        }
        const xScale = d3.scaleTime().range([0, this.width]).domain(xDomain);
        const yLeft = d3
          .scaleLinear()
          .range(yAxisRange())
          .domain(yLeftExtents.reverse());
        const yRight = d3
          .scaleLinear()
          .range(yAxisRange())
          .domain(yRightExtents.reverse());
  
        if (this.timeToggle === "noTime")
          return { x: xScale, yLeft: yLeft, yRight: yLeft };
  
        return { x: xScale, yLeft: yLeft, yRight: yRight };
      },
      plotData: function () {
        function average(nums) {
          return nums.reduce((a, b) => a + b) / nums.length;
        }
  
        // If statements here choose the X1 Y1 Y2, with Floating averages.
        let data = [];
        let y1Avg, y2Avg;
        let y1AvgArray = [],
          y2AvgArray = [];
  
        // iterate through the array, creating a floating average:
        this.rawData.forEach((e, index) => {
          // floating average starts on the 7th data point:
          if (index > 13) {
            y1AvgArray = this.rawData
              .slice(index - 13, index + 1)
              .map((e) => e.PositiveResults)
              .filter(function (el) {
                return el != "";
              });
  
            y2AvgArray = this.rawData
              .slice(index - 13, index + 1)
              .map((e) => e.WW_Daily_copiesPml)
              .filter(function (el) {
                return el != "";
              });
          }
  
          y1AvgArray.length > 0 ? (y1Avg = average(y1AvgArray)) : (y1Avg = "");
          y2AvgArray.length > 0 ? (y2Avg = average(y2AvgArray)) : (y2Avg = "");
  
          data.push({
            x:
              this.timeToggle === "noTime"
                ? e.WW_Daily_copiesPml
                : new Date(e.Date),
            y1: e.PositiveResults,
            y1Avg: y1Avg,
            y2:
              this.timeToggle === "noTime"
                ? e.PositiveResults
                : e.WW_Daily_copiesPml,
            y2Avg: y2Avg,
          });
        });
  
        // Plot then is limited to the X and Y
        return data;
      },
      avgLines() {
        const avgLineRed = d3
          .line()
          .x((e) => this.scales.x(e.x))
          .y((e) => this.scales.yLeft(e.y1Avg))
          .defined((d) => d.y1Avg !== "");
        const avgLineBlue = d3
          .line()
          .x((e) => this.scales.x(e.x))
          .y((e) => this.scales.yRight(e.y2Avg))
          .defined((d) => d.y2Avg !== "");
  
        const avgBothLines = d3
          .line()
          .x((e) => this.scales.x(e.y2Avg))
          .y((e) => this.scales.yLeft(e.y1Avg))
          .defined((d) => d.y1Avg !== "")
          .defined((d) => d.y2Avg !== "");
  
        if (["time2Plots", "time1Plot"].includes(this.timeToggle))
          return { avgLineRed: avgLineRed, avgLineBlue: avgLineBlue };
        else
          return {
            avgLineRed: avgBothLines,
            avgLineBlue: avgBothLines,
          };
      },
      translations() {
        const leftAxis =
          "translate(" + this.margin.left + "," + this.margin.top + ")";
        const xAxis =
          "translate(" +
          this.margin.left +
          "," +
          (this.margin.top + this.margin.betweenPlotPadding * 2 + this.height) +
          ")";
  
        let rightYAxis =
          "translate(" +
          (this.margin.left + this.width) +
          "," +
          (this.margin.top + this.margin.betweenPlotPadding + this.height / 2) +
          ")";
  
        let rightData =
          "translate(" +
          this.margin.left +
          "," +
          (this.margin.top + this.margin.betweenPlotPadding + this.height / 2) +
          ")";
        if (["noTime", "time1Plot"].includes(this.timeToggle)) {
          rightYAxis =
            "translate(" +
            (this.margin.left + this.width) +
            "," +
            this.margin.top +
            ")";
          rightData =
            "translate(" + this.margin.left + "," + this.margin.top + ")";
        }
  
        let rightAxisTitle = "";
        let leftAxisTitle = "";
        const xAxisTitle =
          "translate(" +
          (this.margin.left + this.width / 2) +
          "," +
          (this.margin.top +
            this.margin.betweenPlotPadding * 2 +
            this.height +
            50) +
          ")";
  
        switch (this.timeToggle) {
          case "noTime":
            leftAxisTitle =
              "translate(" +
              (this.margin.left - 50) +
              "," +
              (this.margin.top + this.height / 2) +
              "),rotate(-90)";
            rightAxisTitle = xAxisTitle;
            break;
          case "time1Plot":
            leftAxisTitle =
              "translate(" +
              (this.margin.left - 50) +
              "," +
              (this.margin.top + this.height / 2) +
              "),rotate(-90)";
            rightAxisTitle =
              "translate(" +
              (this.margin.left + this.width + 50) +
              "," +
              (this.margin.top + this.height / 2) +
              "),rotate(-90)";
            break;
          case "time2Plots":
            leftAxisTitle =
              "translate(" +
              (this.margin.left - 50) +
              "," +
              (this.margin.top + this.height / 4) +
              "),rotate(-90)";
            rightAxisTitle =
              "translate(" +
              (this.margin.left + this.width + 50) +
              "," +
              (this.margin.top +
                this.margin.betweenPlotPadding +
                (this.height * 3) / 4) +
              "),rotate(-90)";
            break;
        }
        return {
          rightYAxis,
          rightAxisTitle,
          rightData,
          leftAxis,
          leftAxisTitle,
          xAxis,
          xAxisTitle,
        };
      },
      dataOpactity() {
        if (["time2Plots", "time1Plot"].includes(this.timeToggle)) return 1;
        return 0.7;
      },
    },
    watch: {
      timeToggle(next, prev) {
        if (next && prev) this.updateViz(next, prev);
      },
    },
    methods: {
      instantiateViz: function () {
        // make the svg:
        const svg = d3
          .select("#covidViz")
          .attr("width", this.width + this.margin.left + this.margin.right)
          .attr(
            "height",
            this.height +
              this.margin.top +
              this.margin.bottom +
              this.margin.betweenPlotPadding * 2
          );
  
        // // ----- axes ----
        svg
          .append("g")
          .call(
            d3
              .axisBottom(this.scales.x)
              .tickSize(2)
              .tickFormat(d3.timeFormat("%b-%y"))
              .ticks(6)
          )
          .attr("transform", this.translations.xAxis)
          .attr("class", "xaxis")
          .selectAll(".tick text")
          .style("font-size", 12)
          .style("text-anchor", "end")
          .attr("dx", "-.8em")
          .attr("dy", ".15em")
          .attr("transform", "rotate(-35)");
        svg
          .append("text")
          .attr("transform", this.translations.xAxisTitle)
          .attr("class", "xaxistitle")
          .style("text-anchor", "middle")
          .text("Month")
          .style("font-size", 12);
  
        // Left axis:
        svg
          .append("g")
          .call(d3.axisLeft(this.scales.yLeft).tickSize(2).ticks(5))
          .attr("class", "leftaxis")
          .attr("transform", this.translations.leftAxis)
          .selectAll(".tick text")
          .style("font-size", 12);
        svg
          .append("text")
          .attr("transform", this.translations.leftAxisTitle)
          .attr("class", "leftaxistitle")
          .style("text-anchor", "middle")
          .text("Positive Covid Cases per Day")
          .style("font-size", 12)

  
        // Dots:
        svg
          .selectAll("dot")
          .data(this.plotData)
          .enter()
          .append("circle")
          .attr("cx", (e) => this.scales.x(e.x))
          .attr("cy", (e) => this.scales.yLeft(e.y1))
          .attr("r", 1)
          .attr("transform", this.translations.leftAxis)
          .attr("id", "redDots");

        svg
          .append("path")
          .attr("d", this.avgLines.avgLineRed(this.plotData))
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .attr("transform", this.translations.leftAxis)
          .attr("id", "theRedLine");

      },
      
    },
  };
  </script>
  