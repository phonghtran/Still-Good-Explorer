<template>
  <div>

    <div class=" d-flex flex-wrap">
      <div class="search_wrapper col-12">
        <input
          class="search_textBox"
          placeholder="Search..."
          v-bind:style="{'background-color':  searchColor['hex']['tint'], 'border-color': searchColor['hex']['color'] }"
          v-model="filteredSongs"

          type="text">
      </div>

      <div class="col-12">
        <h2>{{totalResults}} Songs</h2>

      </div>


      <div
        v-for="song in searchList"
        class="songItem col-12 col-md-6 col-lg-3"
        trackID="song.trackID">

        <div class="songItem_contents"
             v-bind:style="{'background': generateLinearGradient(songStyle[song.trackID]), 'border': '2px solid ' + songStyle[song.trackID]['hex']['color'] }">

          <div class="songItem_header">
            <h1
              class="songItem_name"
              v-bind:style="{'background': songStyle[song.trackID]['hex']['shade']}"
              v-html="song.name"></h1>
            <br>
            <h2
              class="songItem_artist"
              v-bind:style="{'background': songStyle[song.trackID]['hex']['color']}"
              v-html="song.artist"></h2>
            <br>
            <h4
              v-if="song.genre.length > 0"
              class="songItem_genre"
              v-bind:style="{'background': songStyle[song.trackID]['hex']['color']}"
              v-html="song.genre"></h4>

          </div>


          <playlist-appearances-list
            v-bind:song="song"
            v-bind:durationsObject="durationCalculation[song.trackID]"
            v-bind:colors="songStyle[song.trackID]"
          >

          </playlist-appearances-list>


        </div>

      </div>
    </div>


  </div>
</template>

<script>
  import { mapGetters, mapState } from "vuex";
  import { colorMixin } from "../../mixins/colorMixin";
  import { stringMixin } from "../../mixins/stringMixin";
  import PlaylistAppearancesList from "../atoms/PlaylistAppearancesList";
  import _ from 'lodash';

  export default {
    name: 'SongSearch',
    components: {PlaylistAppearancesList},
    props: {},
    data() {
      return {
        searchTerm: '',
        searchList: []
      };
    },
    mixins: [
      colorMixin,
      stringMixin
    ],
    mounted: function () {
      this.searchList = this.songsAsArray;
    },
    computed: {
      ...mapState([
        'songs',
        'playlists',
        'songByAppearances'
      ]),
      ...mapGetters([
        'durationCalculation',
        'songsAsArray'
      ]),
      searchColor: function () {
        return this.generateColor(0.2);
      },
      filteredSongs: {
        get: function () {
          return this.searchTerm;
        },
        set: _.debounce(function (newSearchTerm) {
          this.searchTerm = newSearchTerm;

          this.searchList =  this.songsAsArray.filter(post => {
            const keys = Object.keys(post);
            const searchFor = this.searchTerm.toLowerCase().trim();
            let haystack;

            let isMatch = false;

            for (let key in keys) {
              haystack = post[keys[key]];


              if (typeof haystack === 'string') {
                if (haystack.toLowerCase().includes(searchFor)) {
                  isMatch = true;
                  break;
                } // is match
              } else if (keys[key] === 'playlists') {
                const keysPlaylist = Object.keys(haystack);

                for (let pl in keysPlaylist) {
                  if (keysPlaylist[pl].toLowerCase().includes(searchFor)) {
                    isMatch = true;
                    break;
                  } // is match
                }

                if (isMatch === true) {
                  break;
                }
              }// is string or object

            } // loop all items
            return isMatch;
          }); // filter

          this.userIsTyping = false;
        }, 350)
      }

      ,
      totalResults: function () {

        if (typeof this.searchList !== 'undefined') {
          return this.searchList.length;
        }

        return 0;
      },
      songStyle: function () {
        let newArray = {};

        for (let song in this.songs) {

          newArray[song] = this.generateColor();

        }

        return newArray;
      }
    },
    methods: {

    },
    filters: {}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "@/styles/main.scss";

  .search {
    &_wrapper {
      margin-bottom: map_get($spacers, 4);
      position: sticky;
      position: -webkit-sticky;
      top:  map_get($spacers, 6);
      z-index: $zindex-sticky;
    }

    &_textBox {
      background-color: $error;
      border: $border-style;
      color: $white;
      display: block;
      font-size: 2rem;
      font-weight: bold;
      padding: map_get($spacers, 2) map_get($spacers, 3);
      width: 100%;

      &::placeholder {
        color: $white;
      }
    }
  }

  .songItem {
    &_contents {
      margin-bottom: map_get($spacers, 4);
      padding: map_get($spacers, 4);
    }

    &_header {
      color: $white;
      margin: map_get($spacers, 3) 0 map_get($spacers, 5);

      h1 {
        font-size: 1.25rem;
        line-height: 1.5rem;
      }

      h2 {
        font-size: 1rem;
        line-height: 1rem;
      }

      * {
        display: inline-block;
        padding: map_get($spacers, 1) map_get($spacers, 2);
        margin-bottom: 0;
      }
    }


    &_name {

    }

    &_artist {

    }

    &_genre {

    }
  }
</style>
