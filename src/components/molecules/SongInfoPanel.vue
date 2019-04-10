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

      <div class="infoPanel_listWrapper">

        <h4 class="infoPanel_listWrapper__header">Playlist Appearances
          ({{Object.keys(selectedObject.playlists).length}})</h4>

        <playlist-appearances-list
          v-bind:durationsObject="durationCalculation[objectID]"
          v-bind:colors="colors"
          @jumpToPlaylist="jumpToPlaylist">

        </playlist-appearances-list>



      </div>


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
      margin-top: map_get($spacers, 5);

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


    &_listWrapper {

      padding: map_get($spacers, 5) 0 map_get($spacers, 4);

      &__header {
        display: inline-block;
        margin-bottom: map_get($spacers, 3);
      }

      &__dates {
        padding: 0 map_get($spacers, 2);
      }

      &__item {
        margin-bottom: map_get($spacers, 2);

        p {
          display: inline-block;
          font-size: 1rem;
          line-height: 1.25rem;
          margin-bottom: 0;
          padding: map_get($spacers, 1) map_get($spacers, 2);
        }
      }
    }

    &_list {
      padding: 0;
    }

    &_listItemLink {
      font-weight: bold;
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
