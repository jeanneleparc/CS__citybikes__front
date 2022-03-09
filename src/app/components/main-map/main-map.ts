import { Component, AfterViewInit, Output, Input } from '@angular/core';
import { BehaviorSubject, combineLatest } from 'rxjs';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { colors } from 'src/colors';
import {
  iconBlue,
  iconYellow,
  iconRed,
  iconBlueCluster,
  createColoredMarker,
} from 'src/app/components/main-map/icons';

const determineColorAccordingToFillingRate = (
  fillingRate: number
): { color: string; borderColor: string } => {
  if (fillingRate < 0.2 && fillingRate >= 0) {
    return {
      color: colors.red,
      borderColor: colors.darkRed,
    };
  } else if (fillingRate >= 0.2 && fillingRate < 0.55) {
    return {
      color: colors.yellow,
      borderColor: colors.darkYellow,
    };
  }
  return {
    color: colors.green,
    borderColor: colors.darkGreen,
  };
};

const createIconCluster = (
  isStatistics: boolean,
  cluster: L.MarkerCluster
): L.Icon => {
  if (!isStatistics) {
    return iconBlueCluster;
  }
  const childMarkers = cluster.getAllChildMarkers();
  const { rates, compteur } = childMarkers.reduce(
    (previousValue, currentValue) => {
      // @ts-ignore: Unreachable code error
      if (currentValue.fillingRate !== -1) {
        return {
          // @ts-ignore: Unreachable code error
          rates: currentValue.fillingRate + previousValue.rates,
          compteur: previousValue.compteur + 1,
        };
      }
      return previousValue;
    },
    { rates: 0, compteur: 0 }
  );
  const meanClusterFillingRate = rates / compteur;
  const { color, borderColor } = determineColorAccordingToFillingRate(
    meanClusterFillingRate
  );
  return createColoredMarker(
    color,
    borderColor,
    meanClusterFillingRate,
    true,
    true
  );
};

@Component({
  selector: 'main-map',
  templateUrl: './main-map.html',
  styleUrls: ['./main-map.scss'],
})
export class MainMap implements AfterViewInit {
  @Input() $stations: BehaviorSubject<[]> = new BehaviorSubject([]);
  @Input() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  @Input() $isStatistics: BehaviorSubject<any> = new BehaviorSubject(false);
  @Input() $stationsStatistics: BehaviorSubject<[]> = new BehaviorSubject([]);
  @Output() $selectedStationChange: BehaviorSubject<any> = new BehaviorSubject(
    {}
  );
  selectedMarker: any;
  markers: any;
  private map: any;

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    combineLatest([this.$stations, this.$selectedStation]).subscribe(() => {
      this.refreshData();
    });
    this.$stationsStatistics.subscribe(() => {
      this.refreshData();
    });
  }

  private initMap(): void {
    this.map = L.map('map').setView([40.77, -73.968565], 13);
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken:
          'pk.eyJ1IjoiY2xhcmEtbmkiLCJhIjoiY2t5MzQ3cXQ2MHJ5ZjJybWtmN2w5b3dqMSJ9.zrQ2bq62jaJdYXSPmvxMKA',
      }
    ).addTo(this.map);
  }

  refreshData(): void {
    if (this.markers) this.clearMap();
    this.addMarkers(this.$stations.getValue());
  }

  clearMap(): void {
    this.markers.clearLayers();
  }

  addMarkers(stations: any[]): void {
    const isStatistics = this.$isStatistics.value;
    this.markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 50,
      iconCreateFunction(cluster) {
        return createIconCluster(isStatistics, cluster);
      },
    });
    for (const station of stations) {
      const { latitude, longitude } = station;
      // manage the selected station
      if (!this.$isStatistics.value) {
        var marker = L.marker([latitude, longitude], { icon: iconBlue });
        if (!this.stationIsActive(station)) {
          marker = L.marker([latitude, longitude], { icon: iconRed });
        }

        marker.on('click', (event) => {
          this.manageSelectedMarker(station, event.target);
        });

        if (this.$selectedStation.getValue()?.id == station.id) {
          marker = L.marker([latitude, longitude], { icon: iconYellow });
          this.selectedMarker = marker;
        }
        this.markers.addLayer(marker);
      } else {
        const listStations: { stationId: number; fillingRate: number }[] =
          this.$stationsStatistics.getValue();
        const stationStatistic = listStations.find(
          (element: { stationId: number; fillingRate: number }) =>
            element.stationId === station.id
        );
        const fillingRate = stationStatistic?.fillingRate ?? -1;
        const { color, borderColor } =
          determineColorAccordingToFillingRate(fillingRate);
        if (fillingRate !== -1) {
          marker = L.marker([latitude, longitude], {
            icon: createColoredMarker(
              color,
              borderColor,
              fillingRate,
              false,
              true
            ),
          });
          // @ts-ignore: Unreachable code error
          marker.fillingRate = fillingRate;
          this.markers.addLayer(marker);
        }
      }
      // marker.bindPopup(this.createMarkerPopup(station)); // to add popup
    }
    this.map.addLayer(this.markers);
  }

  manageSelectedMarker(station: any, newSelectedMarker: any) {
    this.$selectedStationChange.next(station);
    if (!this.selectedMarker) {
      newSelectedMarker.setIcon(iconYellow);
    }
  }

  createMarkerPopup(station: any): string {
    return (
      `` +
      `<h6>Name: ${station.name}</h6>` +
      `<div>${station.num_bikes_available} available bikes</div>` +
      `<div>${station.num_docks_available} available docks</div>`
    );
  }

  stationIsActive(station: any) {
    return station.station_status == 'active';
  }
}
