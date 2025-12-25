<template>
  <v-container>
    <v-card-text
      class="pa-1"
      style="font-size: 0.75rem; text-align: center; max-width: 450pt; margin: 0 auto;"
    >
      I made the cover image for
      <a href="https://ngwa.onlinelibrary.wiley.com/doi/abs/10.1111/gwmr.12296"
        >this groundwater paper</a
      >
      using the modeling tool EVS. It is very expensive software if you are a
      student, so I wanted to re-do it in a free, accessible way using python,
      with the packages pykrige and vedo. More information below.
      <br />
      (Click and drag any image to rotate, scroll to zoom, press 't' to reset
      the view.)
    </v-card-text>

    <v-card
      outlined
      color="rgba(0,0,0,0)"
      :width="xDomWidth + 4"
      :height="xDomHeight + 4"
      class="card3d"
      style="border-style: solid; border-width: 1pt; border-color: rgb(80,80,80);"
    >
      <v-card-text class="in3d">
        Input data: detections of an oil are shown in red
      </v-card-text>
      <x3d :width="xDomWidth" :height="xDomHeight" style="margin: 2pt">
        <dye-lif-input />
      </x3d>
      <v-overlay absolute :value="!loaded1">
        <v-progress-circular indeterminate size="39"></v-progress-circular>
      </v-overlay>
    </v-card>

    <v-card
      outlined
      color="rgba(0,0,0,0)"
      :width="xDomWidth + 4"
      :height="xDomHeight + 4"
      class="card3d"
      style="border-style: solid; border-width: 1pt; border-color: rgb(80,80,80);"
    >
      <v-card-text class="in3d">
        A simple 3D linear interpolation (not as good as Kriging)
      </v-card-text>
      <x3d :width="xDomWidth" :height="xDomHeight" style="margin: 2pt">
        <dye-lif-linear @loaded="modelLoaded1" />
      </x3d>
      <v-overlay absolute :value="!loaded1">
        <v-progress-circular indeterminate size="39"></v-progress-circular>
      </v-overlay>
    </v-card>

    <v-card
      outlined
      color="rgba(0,0,0,0)"
      :width="xDomWidth + 4"
      :height="xDomHeight + 4"
      class="card3d"
      style="border-style: solid; border-width: 1pt; border-color: rgb(80,80,80);"
    >
      <v-card-text class="in3d">
        Interpolating Kriging over a grid, blocky to show the grid resolution:
      </v-card-text>
      <x3d :width="xDomWidth" :height="xDomHeight" style="margin: 2pt">
        <dye-lif-lego />
      </x3d>
      <v-overlay absolute :value="!loaded1">
        <v-progress-circular indeterminate size="39"></v-progress-circular>
      </v-overlay>
    </v-card>

    <v-card
      outlined
      color="rgba(0,0,0,0)"
      :width="xDomWidth + 4"
      :height="xDomHeight + 4"
      class="card3d"
      style="border-style: solid; border-width: 1pt; border-color: rgb(80,80,80);"
    >
      <v-card-text class="in3d">
        Interpolating Kriging over a grid, smoothed, shows where oil is most
        likely located:
      </v-card-text>
      <x3d :width="xDomWidth" :height="xDomHeight" style="margin: 2pt">
        <dye-lif-smooth />
      </x3d>
      <v-overlay absolute :value="!loaded1">
        <v-progress-circular indeterminate size="39"></v-progress-circular>
      </v-overlay>
    </v-card>
    <v-row justify="center" align="center" class="pt-2">
      <v-card-text class="pa-2" style="font-size: 0.75rem; max-width: 450pt">
        <ul>
          <li>
            <a href="https://www.ctech.com/"
              >EVS is a widely used 3D modeling tool made by C-Tech</a
            >
            that has useful interpolation tools for earth sciences. It is
            prohibitively expensive for a student. I wanted to re-do my previous
            3D modeling work with free tools.
          </li>
          <li>
            Some other background: When oily substances spill onto the ground,
            they seep down to the groundwater where they slowly dissolve,
            causing contamination that could be hazardous. It is often difficult
            to find the oil in the ground, because we can’t see it easily.
            Usually, we have to drill boreholes and collect samples of the soil,
            which is expensive and time consuming.
            <a
              href="https://ngwa.onlinelibrary.wiley.com/toc/17456592/2018/38/3"
              >A tool was developed
            </a>
            by
            <a href="http://www.dakotatechnologies.com/services/dyelif">
              Dakota Technologies
            </a>
            that can detect oil more easily in the ground using a technology
            called Laser Induced Fluorescence (LIF). This method is really
            effective at some sites at finding the oily substance without
            drilling boreholes and sampling directly. Here, I am simulating
            using Dakota's DyeLIF tool and showing the interpolation that is
            done after.
          </li>
          <li>
            The method for investigating a contaminated site usually involves
            several boreholes or probes with the DyeLIF tool, followed by some
            sort of interpolation to map out where we think the oils are. Here,
            we use the geostatistical method Kriging, which is usually better
            than a simple linear or spline interpolation. Normally, one would do
            this with EVS or some other paid-for tool.
          </li>
          <li>
            I am instead using Python and free packages to do the same work in a
            script. This frees up time, because as long as the input data is in
            the right form, we get the same cool 3D visualization out with out
            any work.
          </li>
          <li>
            I made this data up, but it is based on my experience with the
            technology.
          </li>
          <li>
            It is loosely based on what one may encounter at a
            <a href="https://en.wikipedia.org/wiki/Trichloroethylene">
              TCE site, which is a common contaminant</a
            >
          </li>
          <li>
            <a
              href="https://github.com/Owen-Miles/flopyVedo/blob/main/example_scripts/07_DyeLIF.py"
            >
              Github link</a
            >
            for the Python script.
          </li>
        </ul>
      </v-card-text>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "model",
  data: () => ({
    startLoading: false,
    loaded1: false,
  }),
  components: {
    DyeLifInput: () => import("../assets/x3dModels/DyeLifInput.vue"),
    DyeLifLego: () => import("../assets/x3dModels/DyeLifLego.vue"),
    DyeLifSmooth: () => import("../assets/x3dModels/DyeLifSmooth.vue"),
    DyeLifLinear: () => import("../assets/x3dModels/DyeLifLinear.vue"),
  },
  computed: {
    xDomWidth: function() {
      if (window.innerWidth > 830) return 530;
      if (window.innerWidth < 550) return window.innerWidth - 50;
      return window.innerWidth - 300;
    },
    xDomHeight: function() {
      return this.xDomWidth * 0.8;
    },
  },
  methods: {
    modelLoaded1: async function(value) {
      if (value) setTimeout(() => (this.loaded1 = true), 1500);
    },
  },
};
</script>

<style scoped>
.card3d {
  border-style: solid;
  border-width: 1pt;
  border-color: rgb(80, 80, 80);
  margin: 0 auto;
  margin-top: 4pt;
  padding: 1pt;
}
.in3d {
  font-size: 0.75rem;
  position: absolute;
  padding-top: 0;
  padding-left: 2pt;
  z-index: 100;
}
</style>
