<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col align="center">
        <v-card elevation="0" max-width="500" color="rgba(0,0,0,0)">
          <v-card-text style="max-width: 400px">
            In December 2020, five friends watched Married at First Sight season
            five. This dashboard was used to track predictions about the
            couples.
            <br />
            <br />

            <svg width="24" height="15" style="margin-bottom:-2pt">
              <rect
                width="24"
                height="15"
                rx="5"
                ry="5"
                style="fill:rgb(255,0,0);stroke-width:1;stroke:rgb(255,255,255);opacity:0.8;"
              />
            </svg>
            indicates that the couple was predicted to remain together at the
            end of the season.
            <br />

            <svg width="24" height="15" style="margin-bottom:-2pt">
              <rect
                width="24"
                height="15"
                rx="5"
                ry="5"
                style="fill:rgb(0,0,0);stroke-width:1;stroke:rgb(255,255,255);opacity:0.35;"
              />
            </svg>
            indicates the couple was predicted to divorce at the end of the
            season
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters class="ma-0">
      <v-col align="center">
        As of episode:
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters class="ma-0">
      <v-col align="center">
        <svg id="staticViz" />
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters>
      <v-col align="center">
        <v-btn-toggle v-model="groupBy" rounded dense>
          <v-btn value="viewer" small>Group by Viewer</v-btn>
          <v-btn value="couple" small>Group by Couple</v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <br />
    <v-row> <v-divider /> </v-row>
    <v-row justify="center">
      <v-col align="center"> Select winners: </v-col>
    </v-row>

    <v-row justify="center" no-gutters>
      <v-col align="center">
        <v-btn
          elevation="0"
          small
          :color="predictBtnColor.sn"
          @click="snButton = !snButton"
          >S&#38;N</v-btn
        >
        <v-btn
          small
          elevation="0"
          :color="predictBtnColor.cd"
          @click="cdButton = !cdButton"
          style="margin-left: 10px; margin-right: 10px"
        >
          C&#38;D
        </v-btn>
        <v-btn
          small
          elevation="0"
          :color="predictBtnColor.aa"
          @click="aaButton = !aaButton"
          >A&#38;A</v-btn
        >
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters>
      <v-col align="center">
        <svg id="winnerViz" />
      </v-col>
    </v-row>
    <v-row justify="center" no-gutters>
      <v-col align="center">
        (difference between number of right and number of wrong predictions)
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from "d3";
import MAFS_results from "../lib/data/MAFS.json";

export function colorSquare(marriedString) {
  switch (marriedString) {
    case "Married":
      return "red";
    case "Divorced":
      return "grey";
    default:
      "green";
  }
}
export default {
  components: {},
  data: () => ({
    margin: { top: 30, right: 50, bottom: 0, left: 50 },
    width: 180,
    height: 400,
    surveyResults: MAFS_results,
    snButton: true,
    cdButton: false,
    aaButton: true,
    transitionDuration: 1000,
    groupBy: "viewer",
    // smybols:
    brokenHeartD:
      '<path d="m11.959 0.328c-1.147-0.531-2.518-0.393-3.573 0.242l-1.148 2.508 2.274 1.98-2.38 3.216 0.871-2.995-2.914-1.967 0.858-2.525c-1.085-0.812-2.617-1.045-3.884-0.459-1.901 0.882-2.81 3.135-1.308 5.794 1.067 1.891 2.958 3.317 6.256 5.872 3.299-2.555 5.189-3.98 6.257-5.872 1.502-2.659 0.592-4.912-1.309-5.794z"/>',
    married:
      '<g><g><path d="M361.015,132.181c1.89,7.237,8.411,12.329,15.932,12.329c7.651,0,14.082-5.248,15.932-12.328C382.018,132.181,372.024,132.181,361.015,132.181z"/></g></g><g><g><path d="M509.541,176.605c-4.874-8.079-15.374-10.676-23.453-5.802c-23.54,14.204-17.872,10.784-31.946,19.276c-2.502-7.054-5.703-16.16-8.1-23.14c-6.759-19.67-18.71-34.759-39.5-34.759h-3.939c-1.995,12.364-12.738,21.838-25.656,21.838c-12.843,0-23.653-9.421-25.657-21.838c0,0-19.005-7.354-25.216-10.058l9.019-44.427c4.024-19.824,21.625-34.212,41.853-34.212s37.83,14.387,41.854,34.212l9.812,48.333c5.053,2.653,10.045,6.508,14.652,11.998l-12.731-62.714c-5.152-25.379-27.689-43.801-53.587-43.801c-25.897,0-48.434,18.422-53.587,43.802l-8.51,41.921l-18.758-8.168l-29.806-37.819c0.492,6.372-0.661,12.421-3.266,17.982l-9.721,20.738l18.615,23.621c1.746,2.215,4.012,3.963,6.598,5.089c5.552,2.418,48.863,21.276,58.952,25.669l-0.953,6.864c-4.704,3.449-7.805,9.181-9.071,12.253c-1.67,4.053-1.419,11.032,0.15,15.126l6.681,17.424c-14.658,24.224-24.29,50.701-28.653,78.797l-19.668,126.635c-2.418,15.569,9.662,29.592,25.337,29.592h20.232v8.721c0,11.322,9.179,20.501,20.501,20.501s20.501-9.178,20.501-20.501v-8.721h8.851v8.721c0,11.322,9.179,20.501,20.501,20.501s20.501-9.178,20.501-20.501v-8.721h20.231c15.714,0,27.755-14.025,25.337-29.592c-1.818-11.711-17.661-113.715-19.668-126.635c-4.364-28.096-13.995-54.572-28.653-78.797l3.88-10.119c1.699,4.782,3.527,9.904,5.487,15.373c0.004,0.012,0.011,0.023,0.014,0.036c3.656,10.133,15.676,14.393,24.894,8.831c16.587-10.009,33.107-19.977,49.844-30.076C511.819,195.183,514.416,184.683,509.541,176.605z M345.381,180.604c0.03-0.031,0.06-0.062,0.09-0.094c3.52-3.626,8.436-5.886,13.888-5.886c5.451,0,10.363,2.261,13.877,5.886c1.52,1.568,2.783,3.389,3.709,5.399c0.925-2.01,2.189-3.83,3.709-5.399c3.514-3.626,8.426-5.886,13.877-5.886c5.452,0,10.37,2.262,13.889,5.886c4.655,4.795,6.09,11.861,3.675,18.091l-5.462,14.094h-59.376l-5.466-14.106C339.398,192.412,340.797,185.389,345.381,180.604z M435.119,296.854l19.668,126.634c1.166,7.508-4.646,14.236-12.181,14.236c-30.46,0-100.841,0-131.317,0c-7.507,0-13.346-6.734-12.181-14.236l19.668-126.634c3.882-24.997,12.397-49.017,25.064-70.846h66.217C422.721,247.838,431.237,271.857,435.119,296.854z"/></g></g><g><g><path d="M376.947,50.083c-19.554,0-35.407,15.852-35.407,35.406c0,19.608,15.937,35.406,35.406,35.406c19.45,0,35.407-15.778,35.407-35.406C412.353,65.935,396.501,50.083,376.947,50.083z"/></g></g><g><g><circle cx="110.766" cy="83.618" r="37.95"/></g></g><g>	<g><path d="M238.288,57.423c-0.003-0.001-0.007-0.002-0.01-0.004c-9.087-4.248-20.036-0.362-24.338,8.821c-3.272,6.987-23.589,50.371-26.861,57.36l-66.636,9.352l-24.147,0.077c-4.461,0.014-8.871,0.965-12.941,2.791l-72.533,32.534c-8.525,3.822-12.806,13.448-9.932,22.339l26.008,80.473c3.109,9.625,13.432,14.902,23.053,11.793c9.622-3.11,14.902-13.432,11.792-23.054L40.786,195.05l31.223-13.999c0.821,110.711,0.875,99.52,0.469,102.058l-12.543,78.488l-35.973,88.65c-4.562,11.245,0.854,24.059,12.099,28.622c11.235,4.561,24.055-0.847,28.621-12.099l36.915-90.97c0.627-1.542,1.075-3.15,1.337-4.794l11.858-74.199l19.291,75.06l1.816,87.1c0.254,12.209,10.404,21.795,22.425,21.51c12.132-0.253,21.763-10.293,21.51-22.425l-1.869-89.646c-0.035-1.69-0.266-3.373-0.687-5.011l-19.046-74.107l0.471-116.201l-32.298-3.207l75.156-10.202c6.06-0.909,11.268-4.784,13.873-10.344c5.078-10.833,27.844-59.397,31.672-67.564C251.387,72.634,247.46,61.718,238.288,57.423z"/></g></g>',
  }),
  mounted() {
    this.instantiateViz();
    this.instantiateWinViz();
  },
  computed: {
    predictBtnColor: function() {
      return {
        sn: this.snButton ? "red" : "grey",
        cd: this.cdButton ? "red" : "grey",
        aa: this.aaButton ? "red" : "grey",
      };
    },
    finalDecisions: function() {
      return [
        {
          couple: "Danielle & Cody",
          decision: this.cdButton ? "Married" : "Divorced",
        },
        {
          couple: "Shelia & Nate",
          decision: this.snButton ? "Married" : "Divorced",
        },
        {
          couple: "Ashley & Anthony",
          decision: this.aaButton ? "Married" : "Divorced",
        },
      ];
    },
    dataFormatted: function() {
      return this.surveyResults.map((e) => ({
        ...e,
        AsOf: e.AsOf.replace("Episode ", ""),
        couple: e.couple
          .replace("Danielle & Cody", "D&C")
          .replace("Shelia & Nate", "S&N")
          .replace("Ashley & Anthony", "A&A"),
        decision: this.finalDecisions.find((f) => f.couple === e.couple)
          .decision,
      }));
    },
    finalResults: function() {
      let results = {
        Charlo: 0,
        Dinny: 0,
        Katy: 0,
        Laura: 0,
        Owen: 0,
        Paul: 0,
      };
      this.dataFormatted.forEach((e) => {
        switch (e.viewer) {
          case "Charlo":
            if (e.decision === e.prediction) {
              results.Charlo++;
            } else {
              results.Charlo--;
            }

            break;
          case "Dinny":
            if (e.decision === e.prediction) {
              results.Dinny++;
            } else {
              results.Dinny--;
            }
            break;
          case "Katy":
            if (e.decision === e.prediction) {
              results.Katy++;
            } else {
              results.Katy--;
            }
            break;
          case "Laura":
            if (e.decision === e.prediction) {
              results.Laura++;
            } else {
              results.Laura--;
            }
            break;
          case "Owen":
            if (e.decision === e.prediction) {
              results.Owen++;
            } else {
              results.Owen--;
            }
            break;
          case "Paul":
            if (e.decision === e.prediction) {
              results.Paul++;
            } else {
              results.Paul--;
            }
            break;
        }
      });
      return [
        { viewer: "Charlo", value: results.Charlo },
        { viewer: "Dinny", value: results.Dinny },
        { viewer: "Katy", value: results.Katy },
        { viewer: "Laura", value: results.Laura },
        { viewer: "Owen", value: results.Owen },
        { viewer: "Paul", value: results.Paul },
      ];
    },
    scales: function() {
      const xGroups = d3.map(this.dataFormatted, (e) => e.AsOf).keys();
      const yLeftGroups = d3.map(this.dataFormatted, (e) => e.viewer).keys();
      const yRightGroups = d3.map(this.dataFormatted, (e) => e.couple).keys();
      const x = d3
        .scaleBand()
        .range([0, this.width]) //pixles
        .domain(xGroups);
      const yLeft1 = d3
        .scaleBand()
        .range([0, this.height])
        .domain(yLeftGroups)
        .padding([0.1]);
      const yRight1 = d3
        .scaleBand()
        .range([0, yLeft1.bandwidth()])
        .domain(yRightGroups)
        .padding([0.05]);
      const yRight2 = d3
        .scaleBand()
        .range([0, this.height])
        .domain(yRightGroups)
        .padding([0.1]);
      const yLeft2 = d3
        .scaleBand()
        .range([0, yRight2.bandwidth()])
        .domain(yLeftGroups)
        .padding([0.05]);
      if (this.groupBy === "viewer")
        return { x: x, yLeft: yLeft1, yRight: yRight1 };
      else return { x: x, yLeft: yLeft2, yRight: yRight2 };
    },
    winScales: function() {
      const yGroups = d3.map(this.dataFormatted, (e) => e.viewer).keys();
      const y = d3
        .scaleBand()
        .range([0, 200]) //pixles
        .domain(yGroups);
      const x = d3
        .scaleLinear()
        .range([0, this.width])
        .domain([-21, 21]);
      return { x, y };
    },
  },
  watch: {
    groupBy(next, prev) {
      if (next && prev) this.updateViz();
    },
    finalResults(next, prev) {
      if (next && prev) this.updateWinViz();
    },
  },
  methods: {
    instantiateWinViz: function() {
      const svg = d3
        .select("#winnerViz")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", 200 + this.margin.top + this.margin.bottom);
      svg
        .append("g")
        .call(
          d3
            .axisTop(this.winScales.x)
            .tickSize(2)
            .ticks(5)
        )
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .selectAll(".tick text")
        .style("font-size", 14);
      svg
        .append("g")
        .call(d3.axisLeft(this.winScales.y).tickSize(0))
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .selectAll(".tick text")
        .style("font-size", 14);
      svg.selectAll(".domain").remove();
      svg
        .selectAll("winBars")
        .data(this.finalResults)
        .enter()
        .append("rect")
        .attr("x", (e) =>
          e.value < 0 ? this.winScales.x(e.value) : this.winScales.x(0)
        )
        .attr("y", (d) => this.winScales.y(d.viewer))
        .attr("height", this.winScales.y.bandwidth())
        .attr("width", (e) =>
          e.value < 0
            ? this.winScales.x(0) - this.winScales.x(e.value)
            : this.winScales.x(e.value) - this.winScales.x(0)
        )
        .style("stroke-width", 1)
        .style("stroke", "white")
        .attr("fill", "red")
        .style("opacity", 0.8)
        .attr("rx", 3)
        .attr("ry", 3)
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .attr("id", "winBars");
    },
    updateWinViz: async function() {
      await d3
        .selectAll("#winBars")
        .data(this.finalResults)
        // .enter()
        .transition()
        .duration(500)
        .attr("x", (e) =>
          e.value < 0 ? this.winScales.x(e.value) : this.winScales.x(0)
        )
        .attr("y", (d) => this.winScales.y(d.viewer))
        .attr("height", this.winScales.y.bandwidth())
        .attr("width", (e) =>
          e.value < 0
            ? this.winScales.x(0) - this.winScales.x(e.value)
            : this.winScales.x(e.value) - this.winScales.x(0)
        );
    },
    instantiateViz: function() {
      // make the svg:
      const svg = d3
        .select("#staticViz")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);

      // ----- axes ----
      svg
        .append("g")
        .call(d3.axisTop(this.scales.x).tickSize(0))
        .selectAll(".tick text")
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .style("font-size", 14);
      svg
        .append("g")
        .call(d3.axisLeft(this.scales.yLeft).tickSize(0))
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .style("font-size", 15)
        .attr("class", "leftaxis");
      // add a right axis
      svg
        .append("g")
        .call(d3.axisRight(this.scales.yRight).tickSize(0))
        .attr(
          "transform",
          "translate(" +
            (this.width + this.margin.right) +
            "," +
            (this.margin.top + 8) +
            ")"
        )
        .style("font-size", 15)
        .attr("class", "rightaxis");
      svg.selectAll(".domain").remove();

      // // squares
      svg
        .selectAll("mySquares")
        .data(this.dataFormatted)
        .enter()
        .append("rect")
        .attr("x", (d) => this.scales.x(d.AsOf))
        .attr(
          "y",
          (d) => this.scales.yLeft(d.viewer) + this.scales.yRight(d.couple)
        )
        .attr("height", this.scales.yRight.bandwidth())
        .attr("width", this.scales.x.bandwidth())
        .style("stroke-width", 1)
        .style("stroke", "white")
        .attr("fill", (e) => colorSquare(e.prediction))
        .style("opacity", 0.8)
        .attr("rx", 5)
        .attr("ry", 5)
        .attr(
          "transform",
          "translate(" + this.margin.left + "," + this.margin.top + ")"
        )
        .attr("id", "mySquares");
    },
    updateViz: async function() {
      d3.selectAll(".extraaxis")
        .transition()
        .duration(500)
        .style("opacity", 0)
        .remove();
      await d3
        .selectAll("#mySquares")
        .data(this.dataFormatted)
        .transition()
        .duration(this.transitionDuration)
        .attr(
          "y",
          (d) => this.scales.yLeft(d.viewer) + this.scales.yRight(d.couple)
        );

      const svg = d3.select("#staticViz");
      svg
        .select(".leftaxis")
        .transition()
        .duration(1500)
        .call(d3.axisLeft(this.scales.yLeft).tickSize(0))
        .attr(
          "transform",
          "translate(" +
            this.margin.left +
            "," +
            (this.margin.top + (this.groupBy === "viewer" ? 0 : 12)) +
            ")"
        );
      svg
        .select(".rightaxis")
        .transition()
        .duration(1500)
        .call(d3.axisRight(this.scales.yRight).tickSize(0))
        .attr(
          "transform",
          "translate(" +
            (this.width + this.margin.right) +
            "," +
            (this.margin.top + (this.groupBy === "viewer" ? 8 : 0)) +
            ")"
        );
      switch (this.groupBy) {
        case "couple":
          svg
            .append("g")
            .call(d3.axisLeft(this.scales.yLeft).tickSize(0))
            .attr(
              "transform",
              "translate(" +
                this.margin.left +
                "," +
                (this.margin.top + this.scales.yRight.bandwidth() + 26) +
                ")"
            )
            .style("font-size", 15)
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("class", "extraaxis");

          svg
            .append("g")
            .call(d3.axisLeft(this.scales.yLeft).tickSize(0))
            .attr(
              "transform",
              "translate(" +
                this.margin.left +
                "," +
                (this.margin.top + this.scales.yRight.bandwidth() * 2 + 38) +
                ")"
            )
            .style("font-size", 15)
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("class", "extraaxis");
          break;
        case "viewer":
          svg
            .append("g")
            .call(d3.axisRight(this.scales.yRight).tickSize(0))
            .attr(
              "transform",
              "translate(" +
                (this.width + this.margin.right) +
                "," +
                (this.margin.top +
                  (this.scales.yLeft.bandwidth() + 8) * 3 +
                  2) +
                ")"
            )
            .style("font-size", 15)
            .style("opacity", 0)
            .transition()
            .duration(1000)
            .style("opacity", 1)
            .attr("class", "extraaxis");
          break;
      }
      svg.selectAll(".domain").remove();
    },
  },
};
</script>
