<template>
  <div class="scrollWrapper" v-bind:style="{'background': generateRadialGradient(colors), 'border-left': '1px solid ' + colors['shade']}">
    <div class="infoPanel_wrapper">
      <p>
        <a
          class="infoPanel_closeButton"
          v-on:click.prevent="closePanel">
          Close Panel
        </a>
      </p>

      <div
        class="infoPanel_header"
      >
        <h1 v-bind:style="{'background': colors['hex']['shade']}"
            v-html="selectedObject.name"></h1>
        <br>
        <h2 v-bind:style="{'background':colors['hex']['color']}"
            v-html="selectedObject.artist"></h2>
        <br>
        <h4 v-if="selectedObject.genre.length > 0"
            v-bind:style="{'background':colors['hex']['color']}"
            v-html="selectedObject.genre"></h4>
      </div>

      <playlist-appearances-list
        v-bind:song="selectedObject"
        v-bind:durationsObject="durationCalculation[objectID]"
        v-bind:colors="colors"
        @jumpToPlaylist="jumpToPlaylist">

      </playlist-appearances-list>


    </div>
  </div>
</template>

<script>
  import { mapState, mapGetters } from "vuex";
  import { colorMixin } from "../../mixins/colorMixin";
  import { stringMixin } from "../../mixins/stringMixin";
  import PlaylistAppearancesList from "../atoms/PlaylistAppearancesList";

  export default {
    name: 'SongInfoPanel',
    components: {PlaylistAppearancesList},
    props: {
      objectID: String,
      colors: Object
    },
    data() {
      return {};
    },
    mixins: [
      colorMixin,
      stringMixin
    ],
    computed: {
      ...mapState([
        'songs',
        'playlists',
        'songByAppearances'
      ]),
      ...mapGetters([
        'durationCalculation'
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
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "@/styles/main.scss";

  .scrollWrapper {
    background-color: $dark;
    bottom: 0;
    overflow: scroll;
    position: fixed;
    right: 0;
    top: 0;
    width: 100vw;
    z-index: $zindex-popover;
  }

  .infoPanel {
    &_wrapper {
      color: $white;
      padding: map_get($spacers, 4);
    }

    &_header {
      margin: map_get($spacers, 5) 0 map_get($spacers, 3);

      h1 {
        font-size: 2rem;
        line-height: 2rem;
      }

      * {
        display: inline-block;
        padding: 0 map_get($spacers, 2) map_get($spacers, 2);
        margin-bottom: 0;
      }
    }






  }

  a, a:not([href]), a:not([href]):not([tabindex]) {

    color: $white;
    cursor: pointer;
    display: inline;
    padding: 0;
    text-decoration: underline;

    &:hover {
      color: $white;
      text-decoration: none;
    }
  }

  @media (min-width: 768px) {
    .scrollWrapper {
      width: 50vw;
    }
    .infoPanel {
      &_wrapper {
        padding: map_get($spacers, 4) map_get($spacers, 5);

      }
    }
  }

  @media (min-width: 1024px) {
    .scrollWrapper {
      width: 33vw;
    }
    .infoPanel {
      &_wrapper {

      }
    }
  }

</style>
