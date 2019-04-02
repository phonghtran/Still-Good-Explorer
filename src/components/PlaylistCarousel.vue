<template>
  <div>
    <canvas class="canvas"></canvas>
    <div class="timelineContainer">
      <div class="timeline">
        <button v-for="(date,key) in playlistDates"
                v-bind:style="{'top': msBetweenDates(date) + '%'}"
                v-bind:class="{'active': (timelineActiveButton===key)}"
                @mouseenter="populateToolTip(date, true, msBetweenDates(date))"
                @mouseleave="populateToolTip('', false, 0)"
                @click="goto('pl' + date, key)">

        </button>
      </div>
      <div class="tooltip" v-bind:class="{active: tooltipIsVisible}" v-bind:style="{'top': tooltipPos}">
        {{tooltipText}}
      </div>
    </div>

    <div class="d-flex align-items-start">
      <div v-for="(playlist, key) in playlists" v-bind:id="'pl'+key" class="playlist">

        <h4>{{key}}</h4>
        <ol>
          <li
            v-for="item in playlist"
            v-bind:class="{'song': true, 'active': (selectedTrack===item.trackID)}"
            v-bind:trackID="item.trackID"
            @click="selectTrack(item.trackID)"
            v-html="item.trackID + ' ' +  item.artist + ' - ' + item.name">

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
        playlistPositions: []
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
      ])
    },
    created: function () {
      window.addEventListener('scroll', this.handleScroll);
    },
    mounted: function () {
      const canvas = document.querySelector('.canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const playlists = document.querySelectorAll('.playlist');

      let newArray = [];
      playlists.forEach(function (currentPlaylist) {
        newArray.push(currentPlaylist.offsetLeft);
      });

      this.playlistPositions = newArray;
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
      goto(refName, activeButton) {
        const element = document.getElementById(refName);
        const pos = element.offsetTop - 100;
        window.scrollTo(0, pos);

        this.timelineActiveButton = activeButton;
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
          if (pos > w.x && pos + (w.w / 3) < w.x + w.w) {
            visibleIndices.push(currentIndex);
          }

          currentIndex++;
        }

        visibleIndices.push(visibleIndices[visibleIndices.length - 1] + 1);
        visibleIndices.unshift(visibleIndices[0] - 1);

        console.log(visibleIndices);

        for (let index = 0; index < visibleIndices.length - 2; index++) {
          const currentPlaylist = playlists[index];
          const compareToPlaylist = playlists[index + 1];

          // find array of songs of each
          // loop inside loop
          // if match draw bezier

          if (currentPlaylist.hasChildNodes() && compareToPlaylist.hasChildNodes()) {
            const currentChildren = currentPlaylist.childNodes[1].childNodes;
            const compareToChildren = compareToPlaylist.childNodes[1].childNodes;


            for (let i = 0; i < currentChildren.length; i++) {
              for (let j = 0; j < compareToChildren.length; j++) {
                if (currentChildren[i].getAttribute('trackID') === compareToChildren[j].getAttribute('trackID')) {


                  const origin = {
                    x: currentPlaylist.offsetLeft  ,
                    y: currentChildren[i].offsetTop + (currentChildren[i].offsetHeight / 2)- w.y
                  };
                  const target = {
                    x: compareToPlaylist.offsetLeft ,
                    y: compareToChildren[j].offsetTop + (compareToChildren[j].offsetHeight / 2) - w.y
                  };
                  const bezier = {
                    x1: (this.distanceFormula(target.x, origin.x) * 0.33) + origin.x,
                    x2: (this.distanceFormula(target.x,  origin.x) * 0.66) + origin.x,
                    y1: origin.y * 1.5,
                    y2: target.y * 0.5
                  };

                  this.renderBezier(origin, target, bezier);

                  break;
                }
              }
            }
          }
        }

      },
      distanceFormula: function(x1, x2){
        return Math.sqrt((x1 + x2) ^ 2);
      },
      renderBezier: function (origin, target, bezier) {
        const canvas = document.querySelector('.canvas');
        const ctx = canvas.getContext('2d');

        console.log(origin.x, target.x);

        const red = Math.floor(Math.random() * 255);
        const green = Math.floor(Math.random() * 255);
        const blue = Math.floor(Math.random() * 255);

        ctx.strokeStyle = 'rgba(' + red + ', ' + green + ', ' + blue + ', 1)';
        ctx.beginPath();
        ctx.moveTo(origin.x, origin.y);
        ctx.lineTo(target.x, target.y);
        // ctx.bezierCurveTo(bezier.x1, bezier.y1, bezier.x2, bezier.y2, target.x, target.y);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(origin.x, origin.y, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(target.x, target.y, 20, 20, Math.PI / 4, 0, 2 * Math.PI);
        ctx.stroke();
      }
    },
    filters: {}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "@/styles/main.scss";

  .canvas {
    left: 0;
    position: fixed;
    top: 0;
    z-index: -1;
  }

  .playlist {
    background-color: rgba($light, 0.25);
    border-radius: $border-radius;
    margin: 0 map_get($spacers, 4);
    min-width: 33vw;
    padding: map_get($spacers, 4);

    ol {
      padding-left: map_get($spacers, 3);

      .song {
        font-size: 0.75rem;

        &.active {
          background-color: rgba($success, 0.25);
        }
      }
    }

  }


  .timelineContainer {
    bottom: 0;
    left: 0;
    padding: map_get($spacers, 4) 0;
    position: fixed;
    top: 3rem;


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
</style>
