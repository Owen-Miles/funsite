<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-card outlined tile>
        <iframe
          width="500"
          height="300"
          src="https://www.youtube.com/embed/1dyxK0nCS0I"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </v-card>
    </v-row>
    <v-row justify="center" align="center">
      <div style="text-align: center; font-size: 0.75rem; max-width: 400px">
        Made this video of groundwater depletion while learning a 3D
        modeling tool (EVS by C-Tech). Information and
        data sources are in the Youtube description.
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({}),
};
</script>
