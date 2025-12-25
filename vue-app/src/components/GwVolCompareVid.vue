<template>
  <v-container fluid>
    <v-row justify="center" align="center">
      <v-card outlined tile>
        <iframe
          height="300"
          width="500"
          src="https://www.youtube.com/embed/l8Ga6QP4wgc"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </v-card>
    </v-row>
    <v-row justify="center" align="center">
      <div style="text-align: center; font-size: 0.75rem; max-width: 400px">
        Made this a long time ago in sketchup one afternoon, when I was reading
        about large groundwater volumes in the news and wanted to put them in
        visual context.
      </div>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({}),
};
</script>
