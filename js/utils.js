// js/utils.js

function hexToHsb(hex) {
  let c = color(hex);
  colorMode(RGB);
  let hh = hue(c), ss = saturation(c), bb = brightness(c);
  colorMode(HSB, 360, 100, 100);
  return { h: hh, s: ss, b: bb };
}
