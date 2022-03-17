import * as L from 'leaflet';
import { colors } from 'src/colors';

var size = 10,
  border = 2;

const ICON_COLORS = Object.freeze({
  YELLOW: { color: colors.yellow, borderColor: colors.darkYellow },
  RED: { color: colors.red, borderColor: colors.darkRed },
  GREEN: { color: colors.green, borderColor: colors.darkGreen },
});

function getColoredMarker(
  colorInitial: string,
  fillingRate: any,
  isShifted: boolean
): string {
  var color, borderColor;
  if (!fillingRate) {
    color = colorInitial;
    borderColor = colors.white;
  } else {
    const iconColors = determineColorAccordingToFillingRate(fillingRate);
    color = iconColors.color;
    borderColor = iconColors.borderColor;
  }
  return `\
    width: ${size * 3}px; \
    height: ${size * 3}px; \
    display: block; \
    left: ${!isShifted ? size * -1.5 : -1}px; \
    top: ${!isShifted ? size * -1.5 : 3}px; \
    position: relative; \
    border-radius: ${size * 3}px ${size * 3}px 0;  \
    ${
      !fillingRate
        ? `background-color: ${color};`
        : `background: linear-gradient(315deg, ${color} 0%, ${color} ${fillingRate}%,${
            colors.white
          } ${fillingRate + 1}%, ${colors.white} 100%); \ 
        box-shadow : 5px 4px 5px 0px ${colors.boxShadowIcon};`
    }\
    ${!isShifted ? `transform: rotate(45deg);` : ``} \
    border: ${border}px solid ${borderColor};`;
}

function determineColorAccordingToFillingRate(fillingRate: number): {
  color: string;
  borderColor: string;
} {
  if (fillingRate < 20 && fillingRate >= 0) {
    return ICON_COLORS.RED;
  } else if (fillingRate >= 20 && fillingRate < 55) {
    return ICON_COLORS.YELLOW;
  }
  return ICON_COLORS.GREEN;
}

function createColoredMarker(
  color: string,
  fillingRate: any,
  isCluster: boolean
): any {
  return L.divIcon({
    className: `color-pin-${color}`,
    iconAnchor: [border, size * 2 + border * 2],
    popupAnchor: [0, -(size * 3 + border)],
    // eslint-disable-next-line prettier/prettier
    html: `<span style="${getColoredMarker(color, fillingRate, false)}">${isCluster ? `<span style="${getColoredMarker(color, fillingRate, true)}"></span>`:``} </span>`
  });
}

function createColoredMarkerBikeNumer(
  avgBikesNb: any,
  isCluster: boolean
): any {
  return L.divIcon({
    className: `color-pin-test`,
    iconAnchor: [border, size * 2 + border * 2],
    popupAnchor: [0, -(size * 3 + border)],
    // eslint-disable-next-line prettier/prettier
    html: `<span style="${getColoredMarker(colors.blue, null, false)}">${
      isCluster
        ? `<span style="${getColoredMarker(
            colors.blue,
            null,
            true
          )}"><span style="${getNewIconForNumber()}">${
            avgBikesNb > 999 ? '++' : avgBikesNb
          }</span></span>`
        : `<span style="${getNewIconForNumber()}">${
            avgBikesNb > 999 ? '++' : avgBikesNb
          }</span>`
    }</span>`,
  });
}

function getNewIconForNumber(): string {
  return `\
    width: ${size * 2.5}px; \
    height: ${size * 2.5}px; \
    display: block; \
    left: 0px; \
    top: 0px; \
    text-align: center;\
    position: relative; \
    padding-top: 2px;\
    border-radius: ${size * 3}px;  \
    background-color: ${colors.white};
    color: ${colors.blue};\
    transform: rotate(-45deg);\
    border: ${border}px solid ${colors.blue};`;
}

function createColorIcon(color: any): any {
  return createColoredMarker(color, null, false);
}

export function createColorIconFromFillingRate(fillingRate: any): any {
  return createColoredMarker('', fillingRate, false);
}

export function createColorIconFromBikeNumber(avgBikesNb: any): any {
  return createColoredMarkerBikeNumer(avgBikesNb, false);
}

export function createIconCluster(
  isStatistics: boolean,
  selectedAnalytic: string,
  cluster: L.MarkerCluster
): L.Icon {
  if (!isStatistics) {
    return iconBlueCluster;
  }
  const childMarkers = cluster.getAllChildMarkers();
  const { rates, compteur, bikeNb } = childMarkers.reduce(
    (previousValue, currentValue) => {
      // @ts-ignore: Unreachable code error
      return {
        // @ts-ignore: Unreachable code error
        rates:
          currentValue.fillingRate !== -1
            ? currentValue.fillingRate + previousValue.rates
            : previousValue.rates,
        // @ts-ignore: Unreachable code error
        compteur:
          currentValue.fillingRate !== -1
            ? previousValue.compteur + 1
            : previousValue.compteur,
        // @ts-ignore: Unreachable code error
        bikeNb:
          currentValue.avgBikesNb !== -1
            ? previousValue.bikeNb + currentValue.avgBikesNb
            : previousValue.bikeNb,
      };
    },
    { rates: 0, compteur: 0, bikeNb: 0 }
  );
  const meanClusterFillingRate = rates / compteur;
  if (selectedAnalytic === 'fillingRate') {
    return createColoredMarker('', meanClusterFillingRate, true);
  } else {
    return createColoredMarkerBikeNumer(bikeNb, true);
  }
}

const iconBlueCluster = createColoredMarker(colors.blue, null, true);
export const iconBlue = createColorIcon(colors.blue);
export const iconRed = createColorIcon(colors.red);
export const iconYellow = createColorIcon(colors.yellow);
