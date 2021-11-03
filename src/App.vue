<template>
  <div id="app">
    <nav-main></nav-main>
    <router-view/>
  </div>
</template>

<script>
  import NavMain from "./components/molecules/NavMain";
  export default {
    components: {NavMain}
  };
</script>

<style lang="scss">
  @import "@/styles/main.scss";

  #app {
    margin:  map_get($spacers, 6) map_get($spacers, 4);
  }


</style>
