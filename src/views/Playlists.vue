<template>
  <div>

    <PlaylistCarousel />

  </div>
</template>

<script>
// @ is an alias to /src
import PlaylistCarousel from '../components/organisms/PlaylistCarousel.vue';

export default {

  name: 'playlists',
  components: {
    PlaylistCarousel
  }
};
</script>
