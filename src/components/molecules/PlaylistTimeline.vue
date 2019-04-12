<template>
  <div class="centerWrapper" v-bind:class="{isOpen: isOpen}">
    <div class="timelineContainer d-lg-flex justify-content-center">

      <button class="toggleOpen" @click="toggleOpen">{{timelineText}}</button>
      <button
        v-for="button in buttonDates"
        class="buttonYear"
        @click="scrollTo(button)">
        {{button | ageFormat }}
      </button>

    </div>
  </div>

</template>

<script>
  import moment from 'moment';

  export default {
    name: "PlaylistTimeline",
    data() {
      return {
        isOpen: false
      };
    },
    computed: {
      timelineText: function () {
        if (this.isOpen === true) {
          return 'Close';
        }

        return 'Jump to...';
      }
    },
    props: {
      buttonDates: Array
    },
    methods: {
      scrollTo: function (selectedDate) {
        this.isOpen = false;
        this.$emit('scrollTo', selectedDate);
      },
      toggleOpen: function () {
        this.isOpen = !this.isOpen;
      }
    },
    filters: {
      ageFormat: function (val) {
        let prefix = '';
        let suffix = '';

        if (val === moment().format('YYYY')){
          prefix = 'Today ('
          suffix = ' Years)';
        }
        return prefix + (val - 1986) + suffix;
      }
    }
  };
</script>

<style scoped lang="scss">
  @import "@/styles/main.scss";

  .centerWrapper {
    background-color: transparent;
    bottom: auto;
    left: 1rem;
    overflow: auto;
    position: fixed;
    right: auto;
    top: 4rem;

    .timelineContainer {


      button {
        background-color: $white;
        border-bottom: $border-style;
        border-top: $border-style;
        color: $error;
        padding: map_get($spacers, 2) map_get($spacers, 3);


        &.toggleOpen {
          border: $border-style;
          border-radius: $border-radius;
          display: block;

        }

        &.buttonYear {
          display: none;
        }

        &:hover {
          background-color: $error;
          color: $white;
        }

      }


    }

    &.isOpen {
      background-color: $white;
      bottom: 0;
      position: fixed;
      left: 0;
      overflow: scroll;
      right: 0;
      top: 0;
      width: 100vw;
      z-index: $zindex-popover;

      .timelineContainer {
        button {


          border-top: 0;
          border-left: 0;
          border-bottom: $border-style;
          border-right: $border-style;
          border-radius: 0;
          width: 100%;


          &.toggleOpen {
            border: 0;
            border-radius: 0;
            margin-bottom: map_get($spacers, 3);
            text-align: left;

            &:hover {
              background-color: transparent;
              color: $error;
              text-decoration: underline;
            }
          }


          &.buttonYear {
            display: inline-block;
            width: 50%;

            &:nth-child(2), &:nth-child(3) {
              border-top: $border-style;;
            }


          }


          &:hover {
            background-color: $error;
            color: $white;
          }


        }
      }
    }
  }


  @media (min-width: 1024px) {
    .centerWrapper,
    .centerWrapper.isOpen {
      bottom: auto;
      left: 0;
      position: fixed;
      right: 0;
      top: 4rem;
      text-align: center;


      .timelineContainer {
        bottom: auto;
        left: auto;
        margin: 0 auto;
        max-width: 24rem;
        position: relative;
        right: auto;
        top: 0;


        button {
          border-bottom: $border-style;
          //border-right: $border-style;
          border-top: $border-style;
          flex: 1 1 auto;


          &.toggleOpen {
            display: none;

          }

          &.buttonYear {
            display: block;

          }

          &:hover {
            background-color: $error;
            color: $white;
          }


          &:nth-child(2) {

            border-left: $border-style;


            border-radius: $border-radius 0 0 $border-radius;
            flex: 1 0 auto;
          }

          &:last-child {
            border-right: $border-style;
            border-radius: 0 $border-radius $border-radius 0;
          }
        }

      }
    }
  }
</style>
