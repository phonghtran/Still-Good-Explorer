<template>
  <div id="nav" class="d-flex" v-bind:style="{backgroundColor: color}">
    <router-link to="/playlists">Playlists</router-link>
    <router-link to="/songs">Songs</router-link>
    <router-link to="/genres">Genres</router-link>
  </div>

</template>

<script>
  import { colorMixin } from "../../mixins/colorMixin";

  export default {
    name: "NavMain",
    mixins: [
      colorMixin
    ],
    computed: {
      color: function (){
        const colors = this.generateColor(0.2);

        return colors.hex.color;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "@/styles/main.scss";
  #nav {
    background-color: $error;
    color: $white;
    font-size: 0.925rem;
    left: 0;
    padding: map_get($spacers, 2);
    position: fixed;
    top: 0;
    right: 0;
    z-index: $zindex-sticky;

  a {
    color: $white;
    font-weight: normal;
    text-decoration: none;
  }
  }
</style>
