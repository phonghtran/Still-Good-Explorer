<template>
  <div>

    <div v-for="item in getColor">
      <div class="colorRow d-flex">

        <template v-for="(hex, key) in item['hex']">
          <div class="swatch d-flex" v-bind:style="{'background-color': hex}">

            <div
              v-bind:style="{color: textColorTest(item['original'][key])}">
              <p>{{key}}</p>
              <p>{{hex}}</p>
              <p> {{item['original'][key]['r']}}<br>{{item['original'][key]['g']}}<br>{{item['original'][key]['b']}}
              </p>
              <p>
                {{item['original'][key]['hsl']['h']}}<br>{{item['original'][key]['hsl']['s']}}<br>{{item['original'][key]['hsl']['l']}}
              </p>
              <p>
                {{item['original'][key]['change']}}
              </p>
            </div>
          </div>

        </template>
      </div>
    </div>
  </div>
</template>

<script>

  import { colorMixin } from "../mixins/colors";

  export default {

    name: 'ColorTest',
    data() {
      return {};
    },
    mixins: [colorMixin],
    computed: {
      getColor: function () {
        let newArray = {};
        const percentage = 0.5;

        for (let i = 0; i < 50; i++) {
          const colors = this.generateColor();


          const saturation = this.getTintShade(colors, percentage, 'h');


          newArray[i] = {
            hex: {
              color: this.objectToHex(colors),

              ss: this.objectToHex(saturation.shade),

              st: this.objectToHex(saturation.tint),

            },

            original: {
              color: colors,

              ss: saturation.shade,
              st: saturation.tint,

            }
          };
        }

        return newArray;
      }
    },
    methods: {
      textColorTest: function (rgbSet) {
        if (rgbSet.r * 0.299 + rgbSet.g * 0.587 + rgbSet.b * 0.114 > 150) {
          return '#000000';
        } else {
          return '#ffffff';
        }
      }
    },
    components: {}
  };
</script>

<style scoped lang="scss">
  @import "@/styles/main.scss";

  .white {
    color: white;
    font-weight: bold;
  }

  .swatch {
    font-size: 1.25rem;
    padding: map_get($spacers, 3);
    margin: map_get($spacers, 3);

    div {
      margin: map_get($spacers, 3);
    }
  }
</style>
