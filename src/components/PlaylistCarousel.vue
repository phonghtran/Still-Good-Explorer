<template>
  <div class="d-flex">
    <div v-for="(playlist, key) in playlists" class="playlist">
      <h2>{{key}}</h2>
      <ol>
        <li v-for="item in playlist" v-html="item.name ">

        </li>
      </ol>
    </div>


  </div>
</template>

<script>
  import { mapState } from "vuex";

  export default {
    name: 'PlaylistCarousel',
    props: {

    },
    data() {
      return {

      };
    },
    computed: {
      ...mapState([
        'songs',
        'playlists'
      ]),
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
