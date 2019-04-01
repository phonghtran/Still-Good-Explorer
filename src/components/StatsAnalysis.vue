<template>
  <div>
    <p>Unique Songs: {{getTotal(songs)}}</p>
    <p>Unique Playlists: {{getTotal(playlists)}}</p>

    <div v-for="(set,key) in songByAppearances">
      <h2>{{key}}</h2>
      {{getTotal(set)}}

<!--      <ol>-->
<!--        <li v-for="item in set">-->
<!--          {{item.name}} - {{item.artist}}-->
<!--        </li>-->
<!--      </ol>-->
    </div>

  </div>
</template>

<script>


  import {  mapState } from "vuex";

  export default {
    name: 'StatsAnalysis',
    props: {

    },
    data() {
      return {

      };
    },
    computed: {
      ...mapState([
        'songs',
        'playlists',
        'songByAppearances'
      ])
    },
    methods: {
      getTotal: function (obj) {
        return Object.keys(obj).length;
      }
    },
    filters: {

    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "@/styles/main.scss";

  .playlist {
    background-color: $light;
    border-radius: $border-radius;
    margin: map_get($spacers, 2);
    min-width: 33vw;
    padding: map_get($spacers, 4);
  }
</style>
