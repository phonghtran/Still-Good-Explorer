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

    },
    mounted: function () {
      const canvas = document.querySelector('.canvas');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const selectedSongs = document.querySelectorAll('.playlist');

      let newArray = [];
      selectedSongs.forEach(function (userItem) {
        newArray.push(userItem.offsetLeft);
      });

      this.playlistPositions = newArray;

      console.log(this.playlistPositions);
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
        console.log(element);
        const pos = element.offsetTop - 100;
        window.scrollTo(0, pos);

        this.timelineActiveButton = activeButton;
      },
      selectTrack(newTrack) {
        this.selectedTrack = newTrack;
        window.addEventListener('scroll', this.handleScroll);
      },
      handleScroll(event) {


        if (this.selectedTrack !== null) {
          const canvas = document.querySelector('.canvas');
          let windowWidth = canvas.width = window.innerWidth;
          let windowHeight = canvas.height = window.innerHeight;
          const scrollX = window.scrollX;
          const ctx = canvas.getContext('2d');
          const widthOfPlaylist = windowWidth * 0.33;;

          // ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
          // ctx.fillRect(0, 0, windowWidth / 2, windowHeight /3);

          const selectedSongs = document.querySelectorAll('.song.active');

          ctx.clearRect(0, 0, windowWidth, windowHeight);

          selectedSongs.forEach(function (userItem) {
            const elementX = userItem.offsetLeft;

            console.log(elementX, widthOfPlaylist, 'window:', scrollX, windowWidth);

            if (elementX + widthOfPlaylist > scrollX && elementX  <  windowWidth + scrollX) {


              ctx.strokeStyle = 'rgba(255, 0, 0, 0.25)';
              ctx.beginPath();       // Start a new path
              ctx.moveTo(0, 0);    // Move the pen to (30, 50)
              ctx.lineTo(elementX - scrollX , userItem.offsetTop);  // Draw a line to (150, 100)
              ctx.stroke();          // Render the path
            }
          });

        }

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
