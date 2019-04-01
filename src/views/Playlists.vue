<template>
  <div>

    <PlaylistCarousel />

  </div>
</template>

<script>
// @ is an alias to /src
import PlaylistCarousel from '@/components/PlaylistCarousel.vue';

export default {

  name: 'playlists',
  components: {
    PlaylistCarousel
  }
};
</script>
