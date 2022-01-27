import * as L from 'leaflet';

// icon with colors
const blue = '#247dce';
const red = '#f26157';
const yellow = '#f2cd5d';

var caption = '',
  size = 10,
  border = 2;

var captionStyles = `\
  transform: rotate(-45deg); \
  display:block; \
  width: ${size * 3}px; \
  text-align: center; \
  line-height: ${size * 3}px;`;

function getColoredMarker(color: string): string {
  return `\
    background-color: ${color}; \
    width: ${size * 3}px; \
    height: ${size * 3}px; \
    display: block; \
    left: ${size * -1.5}px; \
    top: ${size * -1.5}px; \
    position: relative; \
    border-radius: ${size * 3}px ${size * 3}px 0; \
    transform: rotate(45deg); \
    border: ${border}px solid #FFFFFF;`;
}

function createColoredMarker(color: string): any {
  return L.divIcon({
    className: `color-pin-${color}`,
    iconAnchor: [border, size * 2 + border * 2],
    popupAnchor: [0, -(size * 3 + border)],
    // eslint-disable-next-line prettier/prettier
    html: `<span style="${getColoredMarker(color)}"><span style="${captionStyles}">${caption}</span></span>`
  });
}

export const iconBlue = createColoredMarker(blue);
export const iconRed = createColoredMarker(red);
export const iconYellow = createColoredMarker(yellow);
