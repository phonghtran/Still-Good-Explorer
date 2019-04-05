<template>
  <div class="infoPanel_wrapper">
    <p>
      <a
        class="infoPanel_closeButton"
        v-on:click.prevent="closePanel">
        Close Panel
      </a>
    </p>

    <h1>{{selectedObject.name}}</h1>
    <h2>{{selectedObject.artist}}</h2>
    <h4>{{selectedObject.genre}}</h4>

    <h4>Playlist Appearances ({{Object.keys(selectedObject.playlists).length}})</h4>
    <ul>
      <li v-for="(position, key) in selectedObject.playlists">
        <a
          v-on:click.prevent="jumpToPlaylist(key)">
          {{key | moment("MMMM Do, YYYY") }}
        </a>
      </li>
    </ul>


  </div>
</template>

<script>
  import { mapState } from "vuex";


  export default {
    name: 'InfoPanel',
    props: {
      objectID: String
    },
    data() {
      return {};
    },
    computed: {
      ...mapState([
        'songs',
        'playlists',
        'songByAppearances'
      ]),
      selectedObject: function () {
        return this.songs[this.objectID];
      }
    },
    methods: {
      closePanel: function () {
        this.$emit('setInfoPanelVisibility', false);
      },
      jumpToPlaylist: function (key) {
        this.$emit('jumpToPlaylist', key);
      }
    },
    filters: {}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "@/styles/main.scss";

  .infoPanel {
    &_wrapper {
      background-color: $dark;
      bottom: 0;
      color: $white;
      padding: map_get($spacers, 4);
      position: fixed;
      right: 0;
      top: 0;
      width: 33vw;
      z-index: $zindex-popover;
    }




  }
  a, a:hover, a:not([href]):hover, a:not([href]):not([tabindex]):hover {
    color: $white !important;
  }

</style>
