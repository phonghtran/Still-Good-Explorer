<template>

  <div class="infoPanel_listWrapper">

    <h4 class="infoPanel_listWrapper__header">Playlist Appearances
      ({{Object.keys(song.playlists).length}})</h4>

    <div v-for="item in durationsObject"
         class="infoPanel_listWrapper__item">
      <p
        class="infoPanel_listWrapper__dates"
        v-bind:style="{'background': colors['hex']['shade']}">
        <template v-if="item.finalDate">
          <a
            class="infoPanel_listItemLink"
            v-on:click.prevent="jumpToPlaylist(item.finalDate)">{{item.finalDate |
              truncateYear(item.initialDate)}}</a>

          &ndash;
        </template>
        <a
          class="infoPanel_listItemLink"
          v-on:click.prevent="jumpToPlaylist(item.initialDate)">{{item.initialDate |
            truncateMonth(item.finalDate)}}</a>

      </p>
      <br>
      <p v-bind:style="{'background': colors['hex']['color']}">About {{item.duration}}</p>


    </div>

  </div>





</template>

<script>
  import { stringMixin } from "../../mixins/stringMixin";

  export default {
    name: "PlaylistAppearancesList",
    props: {
      durationsObject: {},
      colors: Object,
      song: {}
    },

    mixins: [

      stringMixin
    ],
    methods: {
      jumpToPlaylist: function (target) {
        this.$emit('jumpToPlaylist',target);
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "@/styles/main.scss";

  .infoPanel {
    &_listWrapper {
      color: $white;

      padding: 0 0 map_get($spacers, 4);

      &__header {
        display: inline-block;
        margin-bottom: map_get($spacers, 3);
      }

      &__dates {
        padding: 0 map_get($spacers, 2);
      }

      &__item {

        margin-bottom: map_get($spacers, 2);

        p {
          display: inline-block;
          font-size: 1rem;
          line-height: 1.25rem;
          margin-bottom: 0;
          padding: map_get($spacers, 1) map_get($spacers, 2);
        }
      }
    }


    &_list {
      padding: 0;
    }

    &_listItemLink {
      font-weight: bold;
    }
  }





  a, a:not([href]), a:not([href]):not([tabindex]) {

    color: $white;
    cursor: pointer;
    display: inline;
    padding: 0;
    text-decoration: underline;

    &:hover {
      color: $white;
      text-decoration: none;
    }
  }
</style>
