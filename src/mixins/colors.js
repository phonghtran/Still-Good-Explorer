export const colorMixin = {
  methods: {
    getHSL: function (originalRGB) {
      let r = originalRGB.r / 255;
      let g = originalRGB.g / 255;
      let b = originalRGB.b / 255;

      let max = Math.max(r, g, b);
      let min = Math.min(r, g, b);
      let maxMinDiff = max - min;

      let convertedHSL = {};

      convertedHSL.l = (max + min) / 2;

      if (maxMinDiff === 0) {
        convertedHSL.h = 0;
        convertedHSL.s = 0;
      } else {
        convertedHSL.s = maxMinDiff / (1 - Math.abs(2 * convertedHSL.l - 1));

        switch (max) {
          case r:
            convertedHSL.h = (g - b) / maxMinDiff;
            break;

          case g:
            convertedHSL.h = ((b - r) / maxMinDiff) + 2;
            break;

          case b:
            convertedHSL.h = ((r - g) / maxMinDiff) + 4;
            break;
        }

        convertedHSL.h *= 60;
      }

      return convertedHSL;
    },
    generateColor: function () {
      const threshold = 105; // larger = wider range of colors
      const offset = 100; // higher = lighter the color

      const r = Math.floor(Math.random() * threshold + offset);
      const g = Math.floor(Math.random() * threshold + offset * 0.25);
      const b = Math.floor(Math.random() * threshold + offset * 0.75);

      // skewing purples with 0.25 green and 0.75 blue
      return {
        r: r,
        g: g,
        b: b,
        hsl: this.getHSL({r, g, b})
      };
    },
    objectToHex: function (obj) {
      let r = obj.r.toString(16);
      let g = obj.g.toString(16);
      let b = obj.b.toString(16);

      if (obj.r < 16) {
        r = '0' + r;
      }

      if (obj.g < 16) {
        g = '0' + g;
      }

      if (obj.b < 16) {
        b = '0' + b;
      }

      return '#' + r + g + b;
    },
    objectToRGBA: function (obj, alpha) {
      return 'rgba(' + obj.r + ',' + obj.g + ',' + obj.b + ',' + alpha + ')';
    },
    getTintShade: function (originalRGB, percentage, mode = 'l') {
      const originalHSL = this.getHSL(originalRGB);

      let shadeTint = {
        shade: {},
        tint: {}
      };

      let tempHSL = originalHSL;
      let delta;

      if (mode === 's') {
        const s = originalHSL.s;

        delta = s + percentage;
        tempHSL.s = Math.min(1, delta);
        shadeTint.tint = this.HSLtoRGB(tempHSL);
        shadeTint.tint.hsl = tempHSL;


        delta = s - percentage;
        tempHSL.s = Math.max(0, delta);
        shadeTint.shade = this.HSLtoRGB(tempHSL);
        shadeTint.shade.hsl = tempHSL;
      } else if (mode === 'h') {
        const h = originalHSL.h;
        delta = h + percentage * 360;
        if (delta > 360) {
          delta -= 360;
        }
        tempHSL.h = delta;
        shadeTint.tint = this.HSLtoRGB(tempHSL);
        shadeTint.tint.hsl = tempHSL;


        delta = h - percentage * 360;
        if (delta < 360) {
          delta += 360;
        }
        tempHSL.h = delta;
        shadeTint.shade = this.HSLtoRGB(tempHSL);
        shadeTint.shade.hsl = tempHSL;

      } else {
        const l = originalHSL.l;
        delta = l - percentage;
        tempHSL.l = Math.max(0, delta);
        shadeTint.shade = this.HSLtoRGB(tempHSL);
        shadeTint.shade.hsl = tempHSL;

        delta = l + percentage;
        tempHSL.l = Math.min(1, delta);
        shadeTint.tint = this.HSLtoRGB(tempHSL);
        shadeTint.tint.hsl = tempHSL;

      }


      return shadeTint;
    },
    HSLtoRGB: function (targetHSL) {
      let newRGB;

      if (targetHSL.s === 0) {
        const gray = Math.ceil(targetHSL.l * 255);
        newRGB = {
          r: gray,
          g: gray,
          b: gray
        };
      } else {
        let c = (1 - Math.abs(2 * targetHSL.l - 1)) * targetHSL.s;
        let x = c * (1 - Math.abs((targetHSL.h / 60) % 2 - 1));
        const m = targetHSL.l - c / 2;


        const z = Math.ceil(Math.abs(m * 255));
        c = Math.ceil(Math.abs((c + m) * 255));
        x = Math.ceil(Math.abs((x + m) * 255));

        const h = targetHSL.h;

        if (h < 60) {
          newRGB = {
            r: c,
            g: x,
            b: z
          };
        } else if (h >= 60 && h < 120) {
          newRGB = {
            r: x,
            g: c,
            b: z
          };
        } else if (h >= 120 && h < 180) {
          newRGB = {
            r: z,
            g: c,
            b: x
          };
        } else if (h >= 180 && h < 240) {
          newRGB = {
            r: z,
            g: x,
            b: c
          };
        } else if (h >= 240 && h < 300) {
          newRGB = {
            r: x,
            g: z,
            b: c
          };
        } else {
          newRGB = {
            r: c,
            g: z,
            b: x
          };
        }

      } // if

      return newRGB;
    },
    generateLinearGradient: function (colorSet) {
      return 'linear-gradient(' + colorSet.hex.color + ', ' + colorSet.hex.shade + ')'
    },
    generateRadialGradient: function (colorSet) {
      return 'radial-gradient( ' +
        this.objectToRGBA(colorSet.original.color, 0.5) + ' 20%, ' +
        this.objectToRGBA(colorSet.original.color, 0.25) + ' 35%,' +
        'transparent ),' +
        'radial-gradient( farthest-side at bottom left, ' +
        this.objectToRGBA(colorSet.original.shade, 1) + ' 20%, ' +
        this.objectToRGBA(colorSet.original.shade, 0.5) + ' 50%,' +
        this.objectToRGBA(colorSet.original.shade, 0.25) + ' 70%, ' +
        'transparent ),' +
        'radial-gradient( farthest-side at top right, ' +
        this.objectToRGBA(colorSet.original.tint, 1) + ' 0, ' +
        this.objectToRGBA(colorSet.original.tint, 0.8) + ' 33%, ' +
        this.objectToRGBA(colorSet.original.color, 0.5) + ' 50%,' +
        this.objectToRGBA(colorSet.original.tint, 0.58) + ' 68%, ' +
        this.objectToRGBA(colorSet.original.color, 0.25) + ' 80%,' +
        'transparent ),' +
        'radial-gradient( farthest-side at top left, ' +
        this.objectToRGBA(colorSet.original.tint, 1) + ' 50%,' +
        this.objectToRGBA(colorSet.original.shade, 0.8) + ' 80%,' +
        ' transparent ),'+
        'radial-gradient( farthest-side at bottom right, ' +
        this.objectToRGBA(colorSet.original.shade, 1) + ' 20%,' +
        this.objectToRGBA(colorSet.original.color, 1) + ' 66%,' +
        ' transparent )';


    }
  }
};
