<template>
  <div>
    <canvas class="genreChart_canvas"></canvas>
    <div class="genreChart_panel">
      <ul class="genreChart_genreList">
        <li
          v-for="(genre, key) in genresCoordinates"
          @click="setTargetGenre(key)"
          @mouseenter="setTargetGenre(key)"
          @mouseleave="setTargetGenre('')">

          <div class="genreChart_swatch"  v-bind:style="{'background-color': genre.style.hex.color }"></div>

          {{key || decodeASCII}} ({{Object.keys(genre.playlists).length}})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { colorMixin } from "../../mixins/colorMixin";

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
      }
    },
    mixins: [colorMixin],
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


        if (w.w >= 600){
          totalWidth = w.w * 0.6;
          totalHeight = w.h;

          if (w.w >= 1024){
            totalWidth = w.w * 0.8;
          }
        }


        canvas.width = totalWidth;
        canvas.height = totalHeight;

        ctx.clearRect(0, 0, w.w, w.h);


        const playlistCount = Object.keys(this.playlists).length;
        let yOffset = {};
        let rectWidth = 1 / playlistCount * totalWidth;

        for (let genreIndex in this.genresCoordinates) {
          const genre = this.genresCoordinates[genreIndex];

          let alpha = 1;
          if (this.targetGenre !== '') {
            if (genreIndex === this.targetGenre) {
              alpha = 1;
            } else {
              alpha = 0.15;
            }
          }

          const color = genre['style']['original']['color'];
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


        }

      }
    },
    filters: {
      decodeASCII: function (val){
        let e = document.createElement('textarea');
        e.innerHTML = val;
        // handle case of empty input
        return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "@/styles/main.scss";


  .genreChart {
    &_canvas {
      left: 0;
      position: fixed;
      top: 3rem;
      z-index: $zindex-sticky;
    }

    &_panel {
      margin-top: 60vh;
    }

    &_genreList {
      list-style: none;
      padding: 0;

      li {


      }
    }

    &_swatch {
      display: inline-block;
      height: 1rem;
      width: 1rem;
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
        margin-left: 60vw;
        position: relative;
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
        margin-left: 80vw;
        position: relative;
        width: 20vw;
      }

    }
  }
</style>
