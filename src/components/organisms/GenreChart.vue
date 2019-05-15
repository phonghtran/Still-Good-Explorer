<template>
  <div>
    <canvas class="genreChart_canvas"></canvas>
    <div class="genreChart_panel">
      <ul class="genreChart_genreList">
        <li
          v-for="(genre, key) in genresCoordinates"
          class="d-flex justify-content-between align-items-center"
          v-bind:style="{'background-color': genre.style.hex.color }"
          @click="setTargetGenre(key)"
          @mouseenter="setTargetGenre(key)"
          @mouseleave="setTargetGenre('')">

          <span>{{key || decodeASCII}}</span>

          <div class="genreChart_swatch" v-bind:style="{'background-color': genre.style.hex.shade  }">
            {{Object.keys(genre.playlists).length}}
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { colorMixin } from "../../mixins/colorMixin";
  import { stringMixin } from "../../mixins/stringMixin";

  export default {
    name: "GenreChart",
    data() {
      return {
        targetGenre: ''
      };
    },
    computed: {
      ...mapState([
        'songs',
        'playlists'
      ]),
      genresCoordinates: function () {
        let genres = {};

        let currentIndex = 0;
        for (let playlistIndex in this.playlists) {
          let playlist = this.playlists[playlistIndex];
          const songTotal = Object.keys(playlist).length;

          for (let songIndex in playlist) {
            let currentGenre = playlist[songIndex]['genre'];

            if (currentGenre === '') {
              currentGenre = 'Unknown';
            }

            if (typeof genres[currentGenre] === 'undefined') {
              genres[currentGenre] = {
                playlists: {},
                style: this.generateColor()
              };

            }

            if (typeof genres[currentGenre]['playlists'][currentIndex] === 'undefined') {
              genres[currentGenre]['playlists'][currentIndex] = {
                total: 1,
                percentage: 1 / songTotal
              };
            } else {
              genres[currentGenre]['playlists'][currentIndex]['total'] += 1;
              genres[currentGenre]['playlists'][currentIndex]['percentage'] = genres[currentGenre]['playlists'][currentIndex]['total'] / songTotal;
            }

          }

          currentIndex++;
        }

        return genres;
      },
      genresCoordinatesLength: function () {
        return Object.keys(this.genresCoordinates).length;
      },
      genreKeys: function () {
        return Object.keys(this.genresCoordinates);
      }
    },
    mixins: [
      colorMixin,
      stringMixin
    ],
    mounted: function () {
      this.renderChart();
    },
    methods: {
      setTargetGenre: function (newGenre) {
        this.targetGenre = newGenre;
        this.renderChart();
      },
      renderChart: function () {
        const w = {
          x: window.scrollX,
          y: window.scrollY,
          w: window.innerWidth,
          h: window.innerHeight
        };

        const canvas = document.querySelector('.genreChart_canvas');
        const ctx = canvas.getContext('2d');


        let totalWidth = w.w;
        let totalHeight = w.h / 2;


        if (w.w >= 600) {
          totalWidth = w.w * 0.6;
          totalHeight = w.h;

          if (w.w >= 1024) {
            totalWidth = w.w * 0.8;
          }
        }


        canvas.width = totalWidth;
        canvas.height = totalHeight;

        ctx.clearRect(0, 0, w.w, w.h);


        const playlistCount = Object.keys(this.playlists).length;
        let yOffset = {};
        let rectWidth = 1 / playlistCount * totalWidth;

        let highlightGenreFlag = false;
        let targetIndex = 0;
        let maxLoopCount = 0;

        if (this.targetGenre !== '') {
          highlightGenreFlag = true;
          maxLoopCount = Math.floor(this.genresCoordinatesLength / 2);


          for (let genreKey in this.genreKeys) {
            if (this.genreKeys[genreKey] === this.targetGenre) {
              targetIndex = parseInt(genreKey);
              break;
            }
          }

        }

        for (let i = 0; i < this.genresCoordinatesLength; i++) {
          let alpha = 1;
          if (highlightGenreFlag === true) {
            alpha = 0.15;

            if (i !== targetIndex) {
              const genre = this.genresCoordinates[this.genreKeys[i]];

              yOffset = this.renderGenre(genre, ctx, totalHeight, yOffset, rectWidth, alpha);
            }


            if (i === 3) {
              const genre = this.genresCoordinates[this.genreKeys[targetIndex]];

              yOffset = this.renderGenre(genre, ctx, totalHeight, yOffset, rectWidth, 1);
            }
          } else {
            const genre = this.genresCoordinates[this.genreKeys[i]];

            yOffset = this.renderGenre(genre, ctx, totalHeight, yOffset, rectWidth, alpha);
          }


        }


      },
      renderGenre: function (genre, ctx, totalHeight, yOffset, rectWidth, alpha = 1) {

        const color = genre['style']['rgb']['color'];
        const rgba = 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + alpha + ')';

        ctx.fillStyle = rgba;

        for (let playlistPoint in genre.playlists) {
          const playlistIndex = parseInt(playlistPoint);

          if (typeof yOffset[playlistIndex] === 'undefined') {
            yOffset[playlistIndex] = 0;
          }


          const xCoor = playlistIndex * rectWidth;
          const yCoor = genre.playlists[playlistIndex].percentage * totalHeight;


          ctx.beginPath();
          ctx.rect(xCoor, yOffset[playlistIndex], rectWidth, yCoor);
          ctx.fill();


          yOffset[playlistIndex] += yCoor;


        }


        return yOffset;
      }
    },
    filters: {}
  };
</script>

<style scoped lang="scss">
  @import "@/styles/main.scss";


  .genreChart {
    &_canvas {
      background-color: $white;
      left: 0;
      position: fixed;
      top: 3rem;
      z-index: $zindex-sticky;
    }

    &_panel {
      margin-top: 60vh;
      top: 3rem;
    }

    &_genreList {
      list-style: none;
      padding: 0;


      li {
        color: $white;
        cursor: pointer;
        font-weight: bold;
        padding: 0 0 0 map_get($spacers, 2);
      }
    }

    &_swatch {
      color: $white;
      font-weight: normal;
      min-height: 2rem;
      min-width: 3rem;
      padding: map_get($spacers, 1) map_get($spacers, 2);
      text-align: center;
    }
  }

  @media (min-width: 600px) {
    .genreChart {
      &_canvas {
        left: 0;
        position: fixed;
        top: 3rem;
        z-index: -1;
      }

      &_panel {
        margin-top: 0;
        position: absolute;
        right: 0;
        width: 40vw;
      }

    }
  }

  @media (min-width: 1024px) {
    .genreChart {
      &_canvas {
        left: 0;
        position: fixed;
        top: 3rem;
        z-index: -1;
      }

      &_panel {

        right: 0;
        width: 20vw;
      }

    }
  }
</style>
