<template>
  <div class="playlistCarousel_wrapper">
    <transition name="slide">
    <info-panel
      v-bind:objectID="showObjectID"
      v-bind:colors="infoPanelColor"
      v-on:setInfoPanelVisibility="setInfoPanelVisibility"
      v-on:jumpToPlaylist="scrollTo"
      v-if="showInfoPanel"></info-panel>
    </transition>
    <canvas class="playlistCarousel_canvas"></canvas>
    <div class="playlistCarousel_timelineContainer d-flex justify-content-center">
      <button v-for="button in buttonDates" @click="scrollTo(button)">{{button}}</button>
    </div>


    <div class="playlistCarousel_playlistContainer d-flex align-items-start">
      <div v-for="(playlist, key, index) in playlists" v-bind:date="key" class="playlistCarousel_playlist">

        <h4>{{key | moment("MMMM Do, YYYY")}}</h4>

        <ol
          class="playlistCarousel_songList"
          v-bind:style="{'background': 'linear-gradient(' + playlistStyle[key]['color'] + ', ' + playlistStyle[key]['shade'] + ')'}">

          <li
            v-for="(item, index) in playlist"
            class="playlistCarousel_songListItem d-flex"
            v-bind:class="{'song': true, 'active': (selectedTrack===item.trackID)}"
            v-bind:style="{'border-color': playlistStyle[key]['color']}"
            v-bind:trackID="item.trackID"
            @mouseenter="selectTrack(item.trackID)"
            @click="showInfo(item.trackID, key)"
          >
            <span>{{index}}</span>
            <span>
              <span class="name" v-html="item.name"></span>
              <span class="artist" v-html="item.artist"></span>
            </span>


          </li>
        </ol>

      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters, mapState } from "vuex";
  import moment from 'moment';
  import InfoPanel from "./molecules/InfoPanel";

  export default {
    name: 'PlaylistCarousel',
    components: {InfoPanel},
    props: {},
    data() {
      return {
        selectedTrack: null,
        showObjectID: '',
        showInfoPanel: false,
        infoPanelColor: {}
      };
    },
    computed: {
      ...mapState([
        'songs',
        'playlists'
      ]),
      ...mapGetters([
        'playlistDates',
        'playlistDurations'
      ]),
      playlistPositions: function () {
        const playlists = document.querySelectorAll('.playlistCarousel_playlist');

        let newArray = [];
        playlists.forEach(function (currentPlaylist) {
          newArray.push(currentPlaylist.offsetLeft);
        });

        return newArray;
      },
      playlistMatches: function (){
        let newArray = {};
        const keys = Object.keys(this.playlists);
        const maxLength = keys.length;

        let currentIndex = 0;
        let compareToIndex = 0;

        for (let index = 0; index < maxLength - 1; index++){
          const currentPlaylist = this.playlists[keys[index]];
          const compareToPlaylist = this.playlists[keys[index + 1]];

          currentIndex = 0;


          newArray[keys[index]] = [];

          for (let currrentSong in currentPlaylist){
            compareToIndex = 0;

            for (let compareToSong in compareToPlaylist){
              if (currentPlaylist[currrentSong].trackID === compareToPlaylist[compareToSong].trackID){
                newArray[keys[index]].push([currentIndex, compareToIndex]);

                break;
              }

              compareToIndex++;
            }

            currentIndex++;
          }
        }

        return newArray;
      },
      buttonDates: function () {
        let newArray = [];

        let prevYear = '';

        for (let playlist in this.playlists) {
          const thisYear = moment(playlist).format('YYYY');

          if (thisYear !== prevYear) {
            prevYear = thisYear;
            newArray.push(thisYear);
          }
        }

        return newArray;
      },
      playlistStyle: function () {
        let newArray = {};

        for (let playlist in this.playlists) {
          const colors = this.generateColor();

          const nudge = 25;
          const shade = {
            r: Math.max(colors.r - nudge, 0),
            g: Math.max(colors.g - nudge, 0),
            b: Math.max(colors.b - nudge, 0)
          };
          const tint = {
            r: Math.min(colors.r + nudge, 255),
            g: Math.min(colors.g + nudge, 255),
            b: Math.min(colors.b + nudge, 255)
          };

          newArray[playlist] = {
            color: '#' + colors.r.toString(16) + colors.g.toString(16) + colors.b.toString(16),
            shade: '#' + shade.r.toString(16) + shade.g.toString(16) + shade.b.toString(16),
            tint: '#' + tint.r.toString(16) + tint.g.toString(16) + tint.b.toString(16),
            original: {
              color: colors,
              shade: shade,
              tint: tint
            }
          };
        }

        return newArray;
      }
    },
    created: function () {

    },
    mounted: function () {
      this.handleScroll();
      window.addEventListener('scroll', this.handleScroll );

    },
    destroyed: function () {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      scrollTo(targetDate) {
        const playlists = document.querySelectorAll('.playlistCarousel_playlist');

        for (let index = 0; index < playlists.length; index++) {
          if (playlists[index].getAttribute('date').indexOf(targetDate) !== -1) {

            window.scrollTo(playlists[index].offsetLeft - 100, 0);
            break;
          }
        }
      },
      selectTrack(newTrack) {
        this.selectedTrack = newTrack;
      },
      showInfo(objectID, keyColor){
        this.showObjectID = objectID;
        this.showInfoPanel = true;
        this.infoPanelColor = this.playlistStyle[keyColor];
      },
      setInfoPanelVisibility: function (state) {
        this.showInfoPanel = state;
      },
      generateColor: function () {
        const threshold = 105; // larger = wider range of colors
        const offset = 100; // higher = lighter the color

        // skewing purples with 0.25 green and 0.75 blue
        return {
          r: Math.floor(Math.random() * threshold + offset),
          g: Math.floor(Math.random() * threshold + offset * 0.25),
          b: Math.floor(Math.random() * threshold + offset * 0.75)
        };
      },
      handleScroll: function (){
        const w = {
          x: window.scrollX,
          y: window.scrollY,
          w: window.innerWidth,
          h: window.innerHeight
        };

        const canvas = document.querySelector('.playlistCarousel_canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, w.w, w.h);

        const playlists = document.querySelectorAll('.playlistCarousel_playlist');

        let currentIndex = 0;
        for (let i = 0; i < this.playlistPositions.length - 1; i++) {
          const pos = this.playlistPositions[i];

          if (pos > w.x - w.w * 0.5 && pos + (w.w / 3) < w.x + w.w * 2) {


            const currentPlaylist = playlists[currentIndex];
            const compareToPlaylist = playlists[currentIndex + 1];

            const currentDate = currentPlaylist.getAttribute('date');

            const checkMatches = this.playlistMatches[currentDate];


            const colors = {
              origin: this.playlistStyle[currentDate],
              target: this.playlistStyle[compareToPlaylist.getAttribute('date')]
            };

            if (currentPlaylist.hasChildNodes() && compareToPlaylist.hasChildNodes()) {
              const currentChildren = currentPlaylist.childNodes[1].childNodes;
              const compareToChildren = compareToPlaylist.childNodes[1].childNodes;

              for (let currentMatch in checkMatches) {
                const magicPadding = {
                  x: 53,
                  y: 28
                };

                const currentSongIndex = checkMatches[currentMatch][0];
                const compareToSongIndex = checkMatches[currentMatch][1];


                const origin = {
                  x: currentPlaylist.offsetLeft + currentPlaylist.offsetWidth - w.x,
                  y: currentChildren[currentSongIndex].offsetTop + magicPadding.y - w.y
                };
                const target = {
                  x: compareToPlaylist.offsetLeft - w.x,
                  y: compareToChildren[compareToSongIndex].offsetTop + magicPadding.y - w.y
                };

                this.renderBezier(currentChildren[currentSongIndex].getAttribute('trackID'), origin, target, colors);

              } // each match / song
            } // if list has nodes
          } // if is in the window view

          currentIndex++;
        } // check each playlist offset left
      },
      renderBezier: function (trackID, origin, target, colors) {
        const canvas = document.querySelector('.playlistCarousel_canvas');
        const ctx = canvas.getContext('2d');

        const radius = 8;

        const gradient = ctx.createLinearGradient(origin.x + radius, origin.y, target.x - radius, target.y);

        gradient.addColorStop(0, colors.origin.tint);
        gradient.addColorStop(1, colors.target.tint);

        ctx.lineWidth = 2;
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(origin.x + radius * 2, origin.y);
        ctx.lineTo(target.x - radius * 3, target.y);
        ctx.lineTo(target.x - radius, target.y);
        ctx.stroke();

        ctx.strokeStyle = colors.origin.tint;
        ctx.fillStyle = colors.origin.color;
        ctx.beginPath();
        ctx.ellipse(origin.x, origin.y, radius, radius, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();




        ctx.strokeStyle = colors.target.tint;
        ctx.fillStyle = colors.target.color;
        ctx.beginPath();
        ctx.ellipse(target.x, target.y, radius, radius, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
      }
    }
    ,
    filters: {}
  }
  ;
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "@/styles/main.scss";

  $border-style: 2px solid rgba($error, 1);


  .playlistCarousel {
    &_wrapper {

    }

    &_playlistContainer {
      margin-top: map_get($spacers, 7);
      padding-top: map_get($spacers, 3);
    }

    &_canvas {
      left: 0;
      position: fixed;
      top: 0;
      z-index: -1;
    }

    &_playlist {
      margin-right: map_get($spacers, 6);


      h4 {
        text-align: right;
      }

      ol {
        background-color: $error;
        list-style: none;
        padding: 0;


        $font-size: 0.875rem;

        li {
          border: $border-style;
          border-top: 0;
          color: $white;
          cursor: pointer;
          font-size: $font-size;
          line-height: $font-size * 1.25;
          min-width: 15rem;
          padding: map_get($spacers, 3) map_get($spacers, 4);


          &.active {
            background-color: rgba($white, 0.85);
            color: $black;

          }

          &:first-child {

            border-top: $border-style;

          }

          &:last-child {
            border-bottom: $border-style;
          }

          span {
            display: block;
          }


          .artist {
            font-size: $font-size;
            padding-left: map_get($spacers, 3);
          }

          .name {
            font-weight: bold;
            padding-left: map_get($spacers, 3);

          }
        }
      }

    }

    &_timelineContainer {
      left: 0;
      position: fixed;
      right: 0;
      top: 4rem;


      button {
        background-color: $white;
        border-bottom: $border-style;
        border-top: $border-style;
        color: $error;
        padding: map_get($spacers, 2) map_get($spacers, 3);

        &:hover {
          background-color: $error;
          color: $white;
        }


        &:first-child {
          border-left: $border-style;
          border-radius: $border-radius 0 0 $border-radius;
        }

        &:last-child {
          border-right: $border-style;
          border-radius: 0 $border-radius $border-radius 0;
        }
      }


    }


  } // playlistCarousel



  .slide-enter-active, .slide-leave-active {
    transition: max-width 500ms;
  }
  .slide-enter, .slide-leave-to  {
    max-width: 0;
  }


  @media (min-width: 768px) {

  }
</style>
