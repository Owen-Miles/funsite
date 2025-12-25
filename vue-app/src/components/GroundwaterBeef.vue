<template>
  <v-container fluid>
    <v-card-text class="pa-1" style="font-size: 0.75rem; text-align: center;">
      Made in Adobe InDesign and ESRI ArcGIS in 2014
    </v-card-text>
    <v-img
      contain
      max-width="700"
      src="../assets/mapArt/beefGroundwaterFun.jpg"
      style="margin: auto; display: block;"
    ></v-img>
    <v-row justify="center" align="center" class="pt-4">
      <v-card-text class="pa-2" style="font-size: 0.75rem; max-width: 400pt">
        Sources:
        <ul>
          <li>
            Production and rainfall data:
            <a href="http://www.agcensus.usda.gov/" rel="nofollow ugc"
              >http://www.agcensus.usda.gov/</a
            >
          </li>
          <li>
            The water per pound estimates are from a few places, I chose the
            more ‘reasonable’ (conservative) of what I found. I leaned on this
            one a lot:
            <a
              href="http://www.waterfootprint.org/?page=files/Animal-products"
              rel="nofollow ugc"
              >http://www.waterfootprint.org/?page=files/Animal-products</a
            >, as well as estimates published on National Geographic website.
            Average american diet (a little dated, but not super sensitive to
            the analysis unless things changed alot:)
            <a href="http://www.usda.gov/factbook/chapter2.pdf"
              >USDA Factbook Chapter2.pdf</a
            >
          </li>
          <li>
            American meat production:
            <a
              href="http://www.meatami.com/ht/d/sp/i/47465/pid/47465"
              rel="nofollow ugc"
              >http://www.meatami.com/ht/d/sp/i/47465/pid/47465</a
            >
          </li>
          <li>
            Groundwater depletion report
            <a href="http://pubs.usgs.gov/sir/2013/5079/SIR2013-5079.pdf"
              >USGS Report SIR2013-5079.pdf</a
            >
          </li>
        </ul>
      </v-card-text>
    </v-row>
  </v-container>
</template>

<script>
export default {};
</script>
