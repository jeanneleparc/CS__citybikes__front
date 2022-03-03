import * as L from 'leaflet';

// icon with colors
const blue = '#247dce';
const red = '#f26157';
const yellow = '#f2cd5d';

var size = 10,
  border = 2;

// function getColoredMarker(color: string, isShifted: boolean): string {
//   return `\
//     background-color: ${color}; \
//     width: ${size * 3}px; \
//     height: ${size * 3}px; \
//     display: block; \
//     left: ${!isShifted ? size * -1.5 : -1}px; \
//     top: ${!isShifted ? size * -1.5 : 3}px; \
//     position: relative; \
//     border-radius: ${size * 3}px ${size * 3}px 0; \
//     ${!isShifted ? `transform: rotate(45deg);` : ``} \
//     border: ${border}px solid #FFFFFF;`;
// }

// function createColoredMarker(color: string, isCluster: boolean): any {
//   return L.divIcon({
//     className: `color-pin-${color}`,
//     iconAnchor: [border, size * 2 + border * 2],
//     popupAnchor: [0, -(size * 3 + border)],
//     // eslint-disable-next-line prettier/prettier
//     html: `<span style="${getColoredMarker(color, false)}">${isCluster ? `<span style="${getColoredMarker(color, true)}"></span>`:``} </span>`
//   });
// }

function getColoredMarker(
  color: string,
  borderColor: string,
  fillingRate: number,
  isShifted: boolean,
  isStatistics: boolean
): string {
  return `\
    width: ${size * 3}px; \
    height: ${size * 3}px; \
    display: block; \
    left: ${!isShifted ? size * -1.5 : -1}px; \
    top: ${!isShifted ? size * -1.5 : 3}px; \
    position: relative; \
    border-radius: ${size * 3}px ${size * 3}px 0;  \
    ${
      !isStatistics
        ? `background-color: ${color};`
        : `background: linear-gradient(315deg, ${color} 0%, ${color} ${
            fillingRate * 100
          }%,#FFFFFF ${fillingRate * 100 + 1}%, #FFFFFF 100%); \ 
        box-shadow : 5px 4px 5px 0px rgba(55,55,55,0.3);`
    }\
    ${!isShifted ? `transform: rotate(45deg);` : ``} \
    border: ${border}px solid ${!isStatistics ? `#FFFFFF` : borderColor};`;
}

export function createColoredMarker(
  color: string,
  borderColor: string,
  fillingRate: any,
  isCluster: boolean,
  isStatistics: boolean
): any {
  return L.divIcon({
    className: `color-pin-${color}`,
    iconAnchor: [border, size * 2 + border * 2],
    popupAnchor: [0, -(size * 3 + border)],
    // eslint-disable-next-line prettier/prettier
    html: `<span style="${getColoredMarker(color, borderColor, fillingRate, false, isStatistics)}">${isCluster ? `<span style="${getColoredMarker(color, borderColor, fillingRate, true, isStatistics)}"></span>`:``} </span>`
  });
}

export const iconBlue = createColoredMarker(blue, '', null, false, false);
export const iconBlueCluster = createColoredMarker(blue, '', null, true, false);
export const iconRed = createColoredMarker(red, '', null, false, false);
export const iconYellow = createColoredMarker(yellow, '', null, false, false);
