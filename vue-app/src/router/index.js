import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";

Vue.use(VueRouter);
const routes = [
  {
    path: "/",
    redirect: "/gallery",
  },
  {
    path: "/gallery",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/mafs1",
    name: "MarriedAtFirstSightStatic",
    component: () =>
      import(
        /* webpackChunkName: "MafsOne" */
        "../components/MafsOne.vue"
      ),
  },
  {
    path: "/mafs2",
    name: "MarriedAtFirstSightDynamic",
    component: () =>
      import(
        /* webpackChunkName: "MafsTwo" */
        "../components/MafsTwo.vue"
      ),
  },
  {
    path: "/bad-metronome",
    name: "BadMetronome",
    component: () =>
      import(
        /* webpackChunkName: "BadMetronome" */
        "../components/Metronome.vue"
      ),
  },
  {
    path: "/random-wave",
    name: "RandomSinWaveFun",
    component: () =>
      import(
        /* webpackChunkName: "SinWave" */
        "../components/RandomSinWaveFun.vue"
      ),
  },
  {
    path: "/triangle-model",
    name: "TriangleModel",
    component: () =>
      import(
        /* webpackChunkName: "TriangleModel" */
        "../components/TriangleLayer.vue"
      ),
  },
  {
    path: "/dye-lif-model",
    name: "DyeLif",
    component: () =>
      import(
        /* webpackChunkName: "DyeLif" */
        "../components/DyeLif.vue"
      ),
  },
  {
    path: "/two-axis-plot",
    name: "TwoAxisPlot",
    component: () => import("../components/CovidWastewaterPlot.vue"),
  },
  {
    path: "/carbon-fourteen",
    name: "CarbonDating",
    component: () => import("../components/CarbonForteen.vue"),
  },
  {
    path: "/map-art-nj",
    name: "MapArtNj",
    component: () =>
      import(
        /* webpackChunkName: "MapArtNj" */
        "../components/MapArtNj.vue"
      ),
  },
  {
    path: "/groundwater-beef",
    name: "GroundwaterBeef",
    component: () =>
      import(
        /* webpackChunkName: "MapArtNj" */
        "../components/GroundwaterBeef.vue"
      ),
  },
  {
    path: "/tomato-product-cycle",
    name: "TomatoSanky",
    component: () =>
      import(
        /* webpackChunkName: "TomatoSanky" */
        "../components/TomatoSanky.vue"
      ),
  },
  {
    path: "/map-art-radiohead",
    name: "MapArtRadiohead",
    component: () =>
      import(
        /* webpackChunkName: "MapArtRadiohead" */
        "../components/MapArtRadiohead.vue"
      ),
  },
  {
    path: "/map-art-bos",
    name: "MapArtBos",
    component: () =>
      import(
        /* webpackChunkName: "MapArtBos" */
        "../components/MapArtBos.vue"
      ),
  },
  {
    path: "/gw-vol-compare-vid",
    name: "GwVolCompareVid",
    component: () =>
      import(
        /* webpackChunkName: "GwVolCompareVid" */
        "../components/GwVolCompareVid.vue"
      ),
  },
  {
    path: "/gw-vol-deplete-vid",
    name: "GwDepletionVid",
    component: () =>
      import(
        /* webpackChunkName: "GwDepletionVid" */
        "../components/GwDepletionVid.vue"
      ),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
