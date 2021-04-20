<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-card
        :width="xDomWidth + 10"
        :height="xDomHeight + 100"
        outlined
        color="rgba(0,0,0,0.2)"
      >
        <v-card-text class="pa-1" style="font-size: 0.75rem; text-align: center;">
          Click and drag to rotate, press 't' to reset the view to top
        </v-card-text>
        <x3d :width="xDomWidth" :height="xDomHeight">
          <triangles @loaded="modelLoaded" />
        </x3d>
        <v-overlay absolute :value="!loaded">
          <v-progress-circular indeterminate size="39"></v-progress-circular>
        </v-overlay>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: "model",
  data: () => ({
    loaded: false,
  }),
  components: {
    triangles: () => import("../assets/x3dModels/triangleLayer.vue"),
  },
  computed: {
    xDomWidth: function() {
      return 400;
    },
    xDomHeight: function() {
      return 350;
    },
  },
  methods: {
    modelLoaded: async function(value) {
      if (value) setTimeout(() => (this.loaded = true), 1500);
    },
  },
};
</script>