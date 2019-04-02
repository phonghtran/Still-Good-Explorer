<template>
  <div>
    <div class="timelineContainer">
      <div class="timeline">
        <button v-bind:style="{'top': msBetweenDates(date) + '%'}"
                v-bind:class="{'active': (timelineActiveButton===key)}"
                @mouseenter="populateToolTip(date, true, msBetweenDates(date))"
                @mouseleave="populateToolTip('', false, 0)"
                @click="goto('pl' + date, key)"
                v-for="(date,key) in playlistDates">

        </button>
      </div>
      <div class="tooltip" v-bind:class="{active: tooltipIsVisible}" v-bind:style="{'top': tooltipPos}">
        {{tooltipText}}
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div v-bind:id="'pl'+key" v-for="(playlist, key) in playlists" class=" col-6">
          <div class="playlist">
            <h2>{{key}}</h2>
            <ol>
              <li v-for="item in playlist" v-html="item.name ">

              </li>
            </ol>
          </div>
        </div>
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
        timelineActiveButton: 0
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
    methods: {
      msBetweenDates(targetDate) {
        const firstDate = moment(this.playlistDates[0]);
        const lastDate = moment(targetDate);
        return (Math.abs(lastDate - firstDate) / this.playlistDurations.ms * 100) ;
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
        window.scrollTo( 0, pos);

        this.timelineActiveButton = activeButton;
      }
    },
    filters: {}
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "@/styles/main.scss";

  .playlist {
    background-color: $light;
    border-radius: $border-radius;
    margin-bottom: map_get($spacers, 4);
    padding: map_get($spacers, 4);
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
