<template>
  <div>

    <song-search></song-search>

  </div>
</template>

<script>
import SongSearch from "../components/organisms/SongSearch.vue";

export default {

  name: 'songs',
  components: {
    SongSearch

  }
};
</script>
