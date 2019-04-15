<template>
  <div>
    <canvas class="genreChart_canvas"></canvas>

  </div>
</template>

<script>
  import { mapState } from "vuex";
  import { colorMixin } from "../../mixins/colorMixin";

  export default {
    name: "GenreChart",
    data() {
      return {};
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
      renderChart: function () {
        const w = {
          x: window.scrollX,
          y: window.scrollY,
          w: window.innerWidth,
          h: window.innerHeight
        };

        const canvas = document.querySelector('.genreChart_canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        ctx.clearRect(0, 0, w.w, w.h);


        const playlistCount = Object.keys(this.playlists).length;
        let yOffset = {};
        let rectWidth = 1 / playlistCount * w.w;

        for (let genreIndex in this.genresCoordinates) {
          const genre = this.genresCoordinates[genreIndex];

          ctx.fillStyle = genre['style']['hex']['color'];
          ctx.strokeStyle = genre['style']['hex']['color'];


          for (let playlistPoint in genre.playlists) {
            const playlistIndex = parseInt(playlistPoint);

            if (typeof yOffset[playlistIndex] === 'undefined') {
              yOffset[playlistIndex] = 0;
            }

            const xCoor = playlistIndex * rectWidth;
            const yCoor = genre.playlists[playlistIndex].percentage * w.h;


            ctx.beginPath();
            ctx.rect(xCoor, yOffset[playlistIndex], rectWidth, yCoor);
            // ctx.stroke();
            ctx.fill();


            yOffset[playlistIndex] += yCoor;


          }


        }

      }
    }
  };
</script>

<style scoped lang="scss">
  @import "@/styles/main.scss";


  .genreChart_canvas {
    left: 0;
    position: fixed;
    top: 3rem;
    z-index: -1;
  }
</style>
