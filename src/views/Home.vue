<template>
  <div>

    <h1 v-bind:style="{'background-color': getColor() }">Still Good Explorer</h1>

    <p>
      This represents one of the only reasons I'm still using iTunes as my primary music source. I've been keeping a
      running playlist since forever. And iTunes lets you export that playlist from the app. Which means I have years
      worth of what I was listening to at any given point. The main data set goes back to 2011. But in a twist of
      foresight, I digitalized all the mix CDs I made back in high school. Which means I also have insight to 2000 to
      2004 (the ripe age of 14-18.)
    </p>

    <h2 v-bind:style="{'background-color': getColor() }">
      <router-link to="/playlists">Playlists &rarr;</router-link>
    </h2>

    <p>
      This is every playlist visualized next to each other. Every song that stayed on from week-to-week is connected by
      a line.
    </p>

    <h2 v-bind:style="{'background-color': getColor() }">
      <router-link to="/songs">Songs &rarr;</router-link>
    </h2>

    <p>
      A bit slow, but you can search through every song here.
    </p>

    <h2 v-bind:style="{'background-color': getColor() }">
      <router-link to="/genres">Genres &rarr;</router-link>
    </h2>

    <p>
      A visualization of the genre breakdowns. You can tap or hover to see a specific genre.
    </p>

  </div>
</template>

<script>
  // @ is an alias to /src

  import { colorMixin } from "../mixins/colorMixin";

  export default {

    name: 'genres',
    components: {},
    mixins: [
      colorMixin
    ],
    methods: {
      getColor: function () {
        const color = this.generateColor();

        return color.hex.color;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "@/styles/main.scss";

  h1, h2 {
    color: $white;
    display: inline-block;
    padding: 0 map_get($spacers, 2);



  }

  h2 {
    &:hover {
      background-color: $error;
    }

    a,
    a:not([href]),
    a:not([href]):not([tabindex]) {
      background-color: transparent;
      color: $white;
      cursor: pointer;


      &:hover {
        background-color: transparent;
        color: $white;
        text-decoration: none;

      }
    }
  }
  p {
    max-width: 28rem;
    margin-bottom: map_get($spacers, 5);

  }


</style>
