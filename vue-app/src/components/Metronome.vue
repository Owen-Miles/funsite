<template>
  <v-container fill-height fluid>
    <v-row justify="center" align="center" no-gutters>
      <v-col align="center" cols="12">
        <v-card
          class="mx-auto"
          max-width="600"
          flat
          outlined
          color="rgba(0,0,0,0)"
        >
          <v-toolbar flat dense color="rgba(0,0,0,0)">
            <v-toolbar-title>
              <span class="subheading">A BAD METRONOME</span>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row class="mb-4" justify="space-between">
              <v-col class="text-left">
                <span class="display-3 font-weight-light" v-text="bpm"></span>
                <span class="subheading font-weight-light mr-1">BPM</span>
              </v-col>
              <v-col class="text-right">
                <v-btn :color="color" dark depressed fab @click="toggle">
                  <v-icon large>
                    {{ isPlaying ? "mdi-pause" : "mdi-play" }}
                  </v-icon>
                </v-btn>
              </v-col>
            </v-row>

            <v-slider
              v-model="bpm"
              :color="color"
              track-color="grey"
              always-dirty
              min="40"
              max="218"
            >
              <template v-slot:prepend>
                <v-icon :color="color" @click="decrement">
                  mdi-minus
                </v-icon>
              </template>

              <template v-slot:append>
                <v-icon :color="color" @click="increment">
                  mdi-plus
                </v-icon>
              </template>
            </v-slider>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" align="center" no-gutters>
      <v-col align="center">
        <v-card elevation="0" max-width="500" color="rgba(0,0,0,0)">
          <v-card-text>
            This is a metronome I made that does not keep good time. It is a bad metronome.
            <br />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import tickSound from "../assets/click.mp3"; // Tell webpack this JS file uses this image

export default {
  components: {},
  data: () => ({
    bpm: 63,
    interval: null,
    isPlaying: false,
    myInterval: null,
  }),
  watch: {
    bpm() {
      this.stopMetronome();
      this.scheduler();
    },
  },
  computed: {
    color() {
      if (this.bpm < 100) return "indigo";
      if (this.bpm < 125) return "teal";
      if (this.bpm < 140) return "green";
      if (this.bpm < 175) return "orange";
      return "red";
    },
    timeoutDuration() {
      return (60 / this.bpm) * 1000;
    },
  },
  methods: {
    scheduler: function() {
      if (this.isPlaying) {
        this.startMetronome();
      } else this.stopMetronome();
    },
    startMetronome() {
      this.myInterval = setInterval(this.play, this.timeoutDuration);
    },
    stopMetronome() {
      clearInterval(this.myInterval);
    },
    decrement() {
      this.bpm--;
    },
    increment() {
      this.bpm++;
    },
    toggle() {
      this.isPlaying = !this.isPlaying;
      this.scheduler();
    },
    play: async function() {
      let audio = new Audio(tickSound);
      await setTimeout(() => audio.play(), (Math.random() + 1) * 200);
    },
  },
};
</script>
