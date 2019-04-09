<template>
  <div class="infoPanel_wrapper"
       v-bind:style="{'background': 'linear-gradient(' + colors['tint'] + ', ' + colors['shade'] + ')', 'border-left': '1px solid ' + darkerShade}">

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
      <h1 v-bind:style="{'background': darkerShade}"
          v-html="selectedObject.name"></h1>
      <br>
      <h2 v-bind:style="{'background':colors['color']}"
          v-html="selectedObject.artist"></h2>
      <br>
      <h4 v-if="selectedObject.genre.length > 0"
          v-bind:style="{'background':colors['color']}"
          v-html="selectedObject.genre"></h4>
    </div>

    <div class="infoPanel_listWrapper">

      <h4 class="infoPanel_listWrapper__header">Playlist Appearances
        ({{Object.keys(selectedObject.playlists).length}})</h4>

      <div v-for="(duration) in durationCalculation"
           class="infoPanel_listWrapper__item">
        <p
          class="infoPanel_listWrapper__dates"
          v-bind:style="{'background': darkerShade}">
          <a
            class="infoPanel_listItemLink"
            v-on:click.prevent="jumpToPlaylist(duration.finalDate)">{{duration.finalDate |
            truncateYear(duration.initialDate)}}</a>
          <template v-if="duration.finalDate">
            &ndash;
            <a
              class="infoPanel_listItemLink"
              v-on:click.prevent="jumpToPlaylist(duration.initialDate)">{{duration.initialDate |
              truncateMonth(duration.finalDate)}}</a>
          </template>
        </p>
        <br>
        <p v-bind:style="{'background': colors['color']}">About {{duration.duration}}</p>


      </div>


    </div>


  </div>
</template>

<script>
  import { mapState } from "vuex";
  import moment from 'moment';
  import { colorMixin } from "../../mixins/colors";

  export default {
    name: 'InfoPanel',
    props: {
      objectID: String,
      colors: Object
    },
    data() {
      return {};
    },
    mixins: [colorMixin],
    computed: {
      ...mapState([
        'songs',
        'playlists',
        'songByAppearances'
      ]),
      darkerShade: function () {
        const shadeTint = this.getTintShade(this.colors.original.color, 0.6, 'l');


        return this.objectToHex(shadeTint.shade);
      },
      selectedObject: function () {
        return this.songs[this.objectID];
      },
      durationCalculation: function () {

        const playlists = this.songs[this.objectID].playlists;
        const keys = Object.keys(playlists);

        const masterPlaylistsKeys = Object.keys(this.playlists);

        if (keys.length > 1) {
          let anchorDate = 0;
          let prevIndex = masterPlaylistsKeys.indexOf(keys[0]);
          let durationCurrentIndex = 0;
          let durations = [];
          const defaultMessage = '<1 week';

          for (let keyIndex = 1; keyIndex < keys.length; keyIndex++) {
            const thisCurrentIndex = masterPlaylistsKeys.indexOf(keys[keyIndex]);


            if (typeof durations[durationCurrentIndex] === 'undefined') {
              durations[durationCurrentIndex] = {
                duration: defaultMessage,
                playlists: [],
                initialDate: keys[anchorDate]
              };
            }

            if (thisCurrentIndex - prevIndex === 1) {
              const thisDate = moment(keys[keyIndex]);

              durations[durationCurrentIndex].duration = thisDate.from(moment(keys[anchorDate]), true);
              durations[durationCurrentIndex].finalDate = keys[keyIndex];


            } else {


              durationCurrentIndex++;
              anchorDate = keyIndex;

              durations[durationCurrentIndex] = {
                duration: '<1 week',
                playlists: [],
                initialDate: keys[keyIndex]
              };
            }

            durations[durationCurrentIndex].playlists.push(keys[keyIndex]);

            prevIndex = thisCurrentIndex;
          }

          return durations;
        }

        return defaultMessage;

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
    filters: {
      truncateYear: function (iniitialDate, compareDate) {
        if (moment(iniitialDate).format('YYYY') === moment(compareDate).format('YYYY')) {
          return moment(iniitialDate).format("MMM D");
        }

        return moment(iniitialDate).format("MMM Do, YYYY");

      },
      truncateMonth: function (iniitialDate, compareDate) {
        if (moment(iniitialDate).format('MMM') === moment(compareDate).format('MMM') &&
          moment(iniitialDate).format('YYYY') === moment(compareDate).format('YYYY')) {
          return moment(iniitialDate).format("Do, YYYY");
        }

        return moment(iniitialDate).format("MMM Do, YYYY");

      }
    }
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
      padding: map_get($spacers, 4) map_get($spacers, 5);
      position: fixed;
      right: 0;
      top: 0;
      width: 33vw;
      z-index: $zindex-popover;
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

</style>
