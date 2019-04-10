<template>
  <div>


    <div class=" d-flex flex-wrap align-items-stretch">
      <div class="search_wrapper col-12">
        <input
          class="search_textBox"
          placeholder="Search..."
          v-model="searchTerm"
          type="text">
      </div>


      <div
        v-for="song in filteredSongs"
        class="songItem col-3"
        trackID="song.trackID">

        <div class="songItem_contents"
             v-bind:style="{'background': generateLinearGradient(songStyle[song.trackID]) }">

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


  export default {
    name: 'SongSearch',
    components: {PlaylistAppearancesList},
    props: {},
    data() {
      return {
        searchTerm: ''
      };
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
        'durationCalculation',
        'songsAsArray'
      ]),
      filteredSongs: function () {
        return this.songsAsArray.filter(post => {
          const keys = Object.keys(post);
          const searchFor = this.searchTerm.toLowerCase();
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
      },
      songStyle: function () {
        let newArray = {};
        const percentage = 0.2;

        for (let song in this.songs) {

          newArray[song] = this.generateColor(percentage, 'l');

        }

        return newArray;
      }
    },
    methods: {},
    filters: {}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "@/styles/main.scss";

  .search {
    &_wrapper {
      margin-bottom: map_get($spacers, 4);
    }
    &_textBox {
      border: $border-style;
      display: block;
      font-size: 2rem;
      font-weight: bold;
      padding:  map_get($spacers, 2);
      width: 100%;
    }
  }

  .songItem {
    &_contents {
      margin-bottom: map_get($spacers, 4);
      padding: map_get($spacers, 4);
    }

    &_header {
      color: $white;
      margin: map_get($spacers, 3) 0;

      h1 {
        font-size: 1.25rem;
        line-height: 1rem;
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
