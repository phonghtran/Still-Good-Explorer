<template>
  <div>
    <canvas class="canvas"></canvas>
    <div class="timelineContainer d-flex justify-content-center">
      <button v-for="button in buttonDates" @click="scrollTo(button)">{{button}}</button>
    </div>

    <div class="playlistContainer__wrapper d-flex align-items-start">
      <div v-for="(playlist, key) in playlists" v-bind:id="'pl'+key" class="playlist">

        <h4>{{key}}</h4>
        <ol>
          <li
            v-for="item in playlist"
            v-bind:class="{'song': true, 'active': (selectedTrack===item.trackID)}"
            v-bind:trackID="item.trackID"
            @mouseenter="selectTrack(item.trackID)"
          >


            <span class="artist" v-html="item.artist"></span>
            <span class="name" v-html="item.name"></span>
          </li>
        </ol>

      </div>
    </div>

  </div>
</template>

<script>
  import { mapGetters, mapState } from "vuex";
  import moment from 'moment';

  export default {
    name: 'PlaylistCarousel',
    props: {},
    data() {
      return {
        tooltipIsVisible: false,
        tooltipPos: 0,
        tooltipText: '',
        timelineActiveButton: 0,
        selectedTrack: null,
        trackColors: {},
        lineShimmer: 0.5,
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
        const playlists = document.querySelectorAll('.playlist');

        let newArray = [];
        playlists.forEach(function (currentPlaylist) {
          newArray.push(currentPlaylist.offsetLeft);
        });

        return newArray;
      },
      buttonDates: function () {
        let newArray = [];

        let prevYear = '';

        for (let playlist in this.playlists){
          const thisYear = moment(playlist).format('YYYY');

          if (thisYear !== prevYear){
            prevYear = thisYear;
            newArray.push(thisYear);
          }
        }

        return newArray;
      }
    },
    created: function () {
      window.addEventListener('scroll', this.handleScroll);
    },
    mounted: function () {
      const canvas = document.querySelector('.canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;


      this.handleScroll();
    },
    destroyed: function () {
      window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      msBetweenDates(targetDate) {
        const firstDate = moment(this.playlistDates[0]);
        const lastDate = moment(targetDate);
        return (Math.abs(lastDate - firstDate) / this.playlistDurations.ms * 100);
      },
      populateToolTip(dateString, isVisible, position) {
        this.tooltipIsVisible = isVisible;
        this.tooltipText = dateString;
        this.tooltipPos = position * 0.6 + (position * 0.3) + '%';
      },
      scrollTo(targetDate) {

        const playlists = document.querySelectorAll('.playlist');

        for (let index = 0; index < playlists.length ; index++) {

          if (playlists[index].getAttribute('id').indexOf(targetDate) !== -1){

            window.scrollTo(playlists[index].offsetLeft - 100, 0);
            break;
          }
        }


      },
      selectTrack(newTrack) {
        this.selectedTrack = newTrack;
      },
      handleScroll() {
        const w = {
          x: window.scrollX,
          y: window.scrollY,
          w: window.innerWidth,
          h: window.innerHeight
        };

        const canvas = document.querySelector('.canvas');
        const ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, w.w, w.h);

        const playlists = document.querySelectorAll('.playlist');

        let visibleIndices = [];
        let currentIndex = 0;
        for (let pos of this.playlistPositions) {
          if (pos > w.x - w.w * 0.5 && pos + (w.w / 3) < w.x + w.w * 1.5) {
            visibleIndices.push(currentIndex);
          }

          currentIndex++;
        }

        for (let padLoop = 0; padLoop < 3; padLoop++) {
          if (visibleIndices[visibleIndices.length - 1] < this.playlistPositions.length) {
            visibleIndices.push(visibleIndices[visibleIndices.length - 1] + 1);
          }

          if (visibleIndices[0] > 0) {
            visibleIndices.unshift(visibleIndices[0] - 1);
          }
        }


        for (let index = 0; index < visibleIndices.length - 2; index++) {
          const indexOffset = visibleIndices[index];
          const currentPlaylist = playlists[indexOffset];
          const compareToPlaylist = playlists[indexOffset + 1];

          if (currentPlaylist.hasChildNodes() && compareToPlaylist.hasChildNodes()) {
            const currentChildren = currentPlaylist.childNodes[1].childNodes;
            const compareToChildren = compareToPlaylist.childNodes[1].childNodes;

            for (let i = 0; i < currentChildren.length; i++) {
              for (let j = 0; j < compareToChildren.length; j++) {
                if (currentChildren[i].getAttribute('trackID') === compareToChildren[j].getAttribute('trackID')) {
                  const magicPadding = {
                    x: 53,
                    y: 28
                  };

                  const origin = {
                    x: currentPlaylist.offsetLeft + magicPadding.x - w.x,
                    y: currentChildren[i].offsetTop + magicPadding.y - w.y
                  };
                  const target = {
                    x: compareToPlaylist.offsetLeft + magicPadding.x - w.x,
                    y: compareToChildren[j].offsetTop + magicPadding.y - w.y
                  };

                  const distance = {
                    x: this.distanceFormula(target, origin),
                    y: Math.min(origin.y, target.y)

                  };

                  const bezier = {
                    x1: (distance.x * 0.16) + origin.x,
                    y1: distance.y * 3,
                    x2: (distance.x * 0.33) + origin.x,
                    y2: distance.y * 0.25,
                    x3: (distance.x * 0.50) + origin.x,
                    y3: distance.y,
                    x4: (distance.x * 0.7) + origin.x,
                    y4: distance.y * 2,
                    x5: (distance.x * 0.83) + origin.x,
                    y5: distance.y * 0.125,
                    x6: (distance.x * 0.9) + origin.x,
                    y6: distance.y * 0.5,
                    x7: (distance.x * 0.95) + origin.x,
                    y7: distance.y * 0.9,
                    x8: (distance.x * 0.98) + origin.x,
                    y8: distance.y * 0.125,
                  };

                  const isMoreThanNine = {
                    current: (i > 9),
                    compareTo: (j > 9)
                  };

                  this.renderBezier(currentChildren[i].getAttribute('trackID'), origin, target, bezier, isMoreThanNine);

                  break;
                }
              }
            }
          }
        }

      },
      distanceFormula: function (target, origin) {
        return Math.abs(target.x - origin.x);
        //return Math.sqrt(((target.x - origin.x) ^ 2) + ((target.y - origin.y) ^ 2));
      },
      renderBezier: function (trackID, origin, target, bezier, isMoreThanNine) {
        const canvas = document.querySelector('.canvas');
        const ctx = canvas.getContext('2d');

        if (!this.trackColors[trackID]) {
          const threshold = 105;
          const offset = 100;

          const red = Math.floor(Math.random() * threshold + offset);
          const green = Math.floor(Math.random() * threshold + offset * 0.25);
          const blue = Math.floor(Math.random() * threshold + offset * 0.75);

          this.trackColors[trackID] = 'rgba(' + red + ', ' + green + ', ' + blue;
        }

        this.lineShimmer += 0.01;
        if (this.lineShimmer > 0.4) {
          this.lineShimmer = 0.1;
        }

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.trackColors[trackID] + ', ' + (this.lineShimmer * 0.65) + ')';
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.bezierCurveTo(bezier.x1, bezier.y1, bezier.x2, bezier.y2, bezier.x3, bezier.y3);
        ctx.stroke();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle = this.trackColors[trackID] + ', ' + (this.lineShimmer * 0.85) + ')';
        ctx.beginPath();
        ctx.moveTo(bezier.x3, bezier.y3);
        ctx.bezierCurveTo(bezier.x4, bezier.y4, bezier.x5, bezier.y5, bezier.x6, bezier.y6);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = this.trackColors[trackID] + ', ' + this.lineShimmer + ')';
        ctx.beginPath();
        ctx.moveTo(bezier.x6, bezier.y6);
        ctx.bezierCurveTo(bezier.x7, bezier.y7, bezier.x8, bezier.y8, target.x, target.y);
        ctx.stroke();

        const radius = 16;

        ctx.fillStyle = this.trackColors[trackID] + ', 0.25)';
        ctx.lineWidth = 1;
        ctx.strokeStyle = this.trackColors[trackID] + ', 0.5)';

        let nudge = 4;
        if (isMoreThanNine.current === true){
          nudge = 0;
        }

        ctx.beginPath();
        ctx.ellipse(origin.x + nudge, origin.y, radius, radius, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

        if (isMoreThanNine.compareTo === false){
          nudge = 4;
        }

        ctx.beginPath();
        ctx.ellipse(target.x + nudge, target.y, radius, radius, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();

      }
    },
    filters: {}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "@/styles/main.scss";

  .playlistContainer__wrapper {
    margin-top: map_get($spacers, 6);
  }

  .canvas {
    left: 0;
    position: fixed;
    top: 0;
    z-index: -1;
  }

  .playlist {
    background-color: rgba($error, 0.05);
    border: 2px solid rgba($error, 0.5);
    border-radius: $border-radius;
    margin: 0 map_get($spacers, 4);
    min-width: 98vw;
    padding: map_get($spacers, 5);


    h4 {
      text-align: right;
    }

    ol {
      padding-left: map_get($spacers, 4);

      .song {
        padding: map_get($spacers, 2)  map_get($spacers, 2) ;
        margin-bottom: 0;

        &.active {
          background-color: rgba($success, 0.25);
          border-radius: $border-radius;
        }

        span {
          display: block;
        }

        .artist {
          font-size: 0.875rem;
        }

        .name {
          font-size: 1rem;
          font-weight: bold;
          line-height: 1rem;

        }
      }
    }

  }


  .timelineContainer {


    left: 0;
    position: fixed;
    right: 0;
    top: 4rem;


     button {
       background-color: $white;
       border-bottom: 2px solid rgba($error, 0.5);
       border-top: 2px solid rgba($error, 0.5);
       padding: map_get($spacers, 2) map_get($spacers, 3);

       &:hover {
         background-color: lighten($light, 5%);
       }


       &:first-child {
         border-left: 2px solid rgba($error, 0.5);
         border-radius: $border-radius 0 0  $border-radius  ;
       }

       &:last-child {
         border-right: 2px solid rgba($error, 0.5);
         border-radius: 0 $border-radius  $border-radius  0;
       }
     }



    .timeline {
      background-color: $light;
      height: 100%;
      position: relative;
      width: 2rem;

      button {
        background-color: $light;
        height: 0.25rem;
        position: absolute;
        width: 2rem;

        &:hover {
          background-color: $success;
        }

        &.active {
          background-color: $dark;
        }
      }
    }

    .tooltip {
      background-color: $dark;
      border-radius: $border-radius * 2;
      color: $white;
      display: none;
      font-size: 0.75rem;
      font-weight: bold;
      left: 2.5rem;
      padding: map_get($spacers, 1) map_get($spacers, 2);
      position: absolute;
      text-align: center;
      width: 6rem;


      &.active {
        display: block;
      }
    }
  }

  @media (min-width: 768px) {
    .playlist {
      min-width: 33vw;

      ol {


        .song {
          padding: map_get($spacers, 3) 0 map_get($spacers, 3);
          margin-bottom: map_get($spacers, 1);


          .artist {
            font-size: 1rem;
          }
          .name {
            font-size: 1.5rem;

            line-height: 1.5rem;

          }
        }
      }
    }
  }
</style>
