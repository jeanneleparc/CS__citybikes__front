import * as L from 'leaflet';
import { colors } from 'src/colors';

var size = 10,
  border = 2;

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
          }%,${colors.white} ${fillingRate * 100 + 1}%, ${
            colors.white
          } 100%); \ 
        box-shadow : 5px 4px 5px 0px ${colors.boxShadowIcon};`
    }\
    ${!isShifted ? `transform: rotate(45deg);` : ``} \
    border: ${border}px solid ${
    !isStatistics ? `${colors.white}` : borderColor
  };`;
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

export const iconBlue = createColoredMarker(
  colors.blue,
  '',
  null,
  false,
  false
);
export const iconBlueCluster = createColoredMarker(
  colors.blue,
  '',
  null,
  true,
  false
);
export const iconRed = createColoredMarker(colors.red, '', null, false, false);
export const iconYellow = createColoredMarker(
  colors.yellow,
  '',
  null,
  false,
  false
);
