import { colors } from 'src/colors';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function componentToHex(c: number): string {
  var hex = c.toString(16);
  return hex.length == 1 ? `0${hex}` : hex;
}

function rgbToHex(colorRGB: { r: number; g: number; b: number }): string {
  // eslint-disable-next-line prettier/prettier
  return `#${componentToHex(colorRGB.r)}${componentToHex(colorRGB.g)}${componentToHex(colorRGB.b)}`
}

export function getBackgroundColor(weight: number): string {
  const colorStationEmpty = hexToRgb(colors.white);
  const colorStationFull = hexToRgb(colors.green);
  if (!colorStationFull || !colorStationEmpty) return colors.white;

  const w1 = weight / 100;
  const w2 = 1 - w1;
  const colorRGB = {
    r: Math.round(colorStationFull.r * w1 + colorStationEmpty.r * w2),
    g: Math.round(colorStationFull.g * w1 + colorStationEmpty.g * w2),
    b: Math.round(colorStationFull.b * w1 + colorStationEmpty.b * w2),
  };

  return rgbToHex(colorRGB);
}
