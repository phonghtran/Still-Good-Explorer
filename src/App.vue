<template>
  <div id="app">
    <div id="nav" class="d-flex">
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/playlists">Playlists</router-link>
      <router-link to="/stats">Stats</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
  @import "@/styles/main.scss";

  #app {
    margin:  map_get($spacers, 6) map_get($spacers, 4);
  }

  #nav {
    background-color: $dark;
    color: $white;
    font-size: 0.925rem;
    left: 0;
    padding: map_get($spacers, 2);
    position: fixed;
    top: 0;
    right: 0;
    z-index: $zindex-sticky;

    a {
      color: $white;
    }
  }
</style>
