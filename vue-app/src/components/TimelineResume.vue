<template>
  <v-card dark tile>
    <v-row class="text-center">
      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">
          Experience
        </h2>
      </v-col>
    </v-row>
    <v-timeline>
      <v-timeline-item
        v-for="(resumeList, i) in resumeList"
        :key="i"
        small
        left
      >
        <span slot="opposite">{{ resumeList.time }}</span>
        <v-card flat>
          <v-card-title outline tile class="headline">{{
            resumeList.title
          }}</v-card-title>
          <v-card-text>
            {{ resumeList.content }}
          </v-card-text>
        </v-card>
      </v-timeline-item>
    </v-timeline>
  </v-card>
</template>

<script>
export default {
  name: "TimelineResume",

  data: () => ({
    resumeList: [
      {
        title: "REsurety",
        time: "2019",
        content: "Made this front end : link)"
      },
      {
        title: "Haley and Aldrich",
        time: "2013-2019",
        content: "some choice projects/expereinces!"
      },

      {
        title: "Queens University",
        time: "2011-2013",
        content: "Graduate school in Kingston, Ontario"
      },
      {
        title: "Environmental Consulting",
        time: "2006-2011",
        content: "Water Resources Engineering"
      },
      {
        title: "University of Guelph",
        time: "2006-2011",
        content: "Water Resources Engineering"
      }
    ]
  })
};
</script>
