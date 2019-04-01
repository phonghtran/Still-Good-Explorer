<template>
  <div class="container">
    <div class="row">
    <div class="col-3">


      <ul>
        <li v-for="(item,date) in playlists">

          <router-link :to="{ path: 'home', query: { playlist: date }}">{{date}}</router-link>
        </li>
      </ul>
    </div>
      <div class="col-9" v-if="this.$route.query.playlist">
        <div class="is-sticky">
          {{targetPlaylist}}
          <ul>
            <li v-for="item in targetPlaylist" v-html="item.name ">

            </li>
          </ul>
        </div>

      </div>
    </div>





  </div>
</template>

<script>
  const playlists = require('../services/playlists.json');
  const songs = require('../services/songs.json');

  export default {
    name: 'HelloWorld',
    props: {

    },
    data() {
      return {
        playlists: playlists,
        songs: songs
      }
    },
    computed: {
      targetPlaylist: function(){
        if (this.$route.query.playlist){
          return this.playlists[this.$route.query.playlist]
        }

        return null;
      }
    },
    filters: {
      removeSlash: function(value){
        return value.replace(/\\'/, "'");
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .is-sticky {
    position: sticky;
    position: -webkit-sticky;
    top: 2rem;
  }
</style>
