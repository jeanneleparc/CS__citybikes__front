import { Component, AfterViewInit, Output, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/data.service';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {
  iconBlue,
  iconYellow,
  iconRed,
  iconBlueCluster,
  createColoredMarkerStatistics,
} from 'src/app/components/main-map/icons';

@Component({
  selector: 'main-map',
  templateUrl: './main-map.html',
  styleUrls: ['./main-map.css'],
})
export class MainMap implements AfterViewInit {
  @Input() $stations: BehaviorSubject<[]> = new BehaviorSubject([]);
  @Input() $isStatistics: BehaviorSubject<any> = new BehaviorSubject(false);
  @Input() $stationsStatistics: BehaviorSubject<[]> = new BehaviorSubject([]);
  @Output() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  selectedMarker: any;
  markers: any;
  private map: any;
  private red: string = '#cd2d2d';
  private yellow: string = '#f2d164';
  private green: string = '#0e8c38';

  private borderRed: string = '#a82323';
  private borderYellow: string = '#e0b62b';
  private borderGreen: string = '#0a6b2a';

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.$stations.subscribe(() => {
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
    this.markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 50,
      iconCreateFunction() {
        return iconBlueCluster;
      },
    });
    for (const station of stations) {
      const { latitude, longitude } = station;
      const listStations: { stationId: number; fillingRate: number }[] =
        this.$stationsStatistics.getValue();
      const stationStatistic = listStations.find(
        (element: { stationId: number; fillingRate: number }) =>
          element.stationId > station.id
      );
      const fillingRate = stationStatistic?.fillingRate;
      // manage the selected station
      if (!this.$isStatistics.value) {
        var marker = L.marker([latitude, longitude], { icon: iconBlue });
        if (!this.stationIsActive(station)) {
          marker = L.marker([latitude, longitude], { icon: iconRed });
        }
        if (this.$selectedStation.value?.id == station.id) {
          marker = L.marker([latitude, longitude], { icon: iconYellow });
          this.selectedMarker = marker;
        }
        marker.on('click', (event) => {
          this.manageSelectedMarker(station, event.target);
        });
        this.markers.addLayer(marker);
      } else {
        var marker = L.marker([latitude, longitude], {
          icon: createColoredMarkerStatistics('#FFFFFF', '#FFFFFF', undefined),
        });
        if (fillingRate !== undefined && fillingRate < 0.2) {
          marker = L.marker([latitude, longitude], {
            icon: createColoredMarkerStatistics(
              this.red,
              this.borderRed,
              fillingRate
            ),
          });
        } else if (
          fillingRate !== undefined &&
          fillingRate >= 0.2 &&
          fillingRate < 0.55
        ) {
          marker = L.marker([latitude, longitude], {
            icon: createColoredMarkerStatistics(
              this.yellow,
              this.borderYellow,
              fillingRate
            ),
          });
        } else if (fillingRate !== undefined && fillingRate >= 0.55) {
          marker = L.marker([latitude, longitude], {
            icon: createColoredMarkerStatistics(
              this.green,
              this.borderGreen,
              fillingRate
            ),
          });
        }
        this.markers.addLayer(marker);
      }
      // marker.bindPopup(this.createMarkerPopup(station)); // to add popup
    }
    this.map.addLayer(this.markers);
  }

  manageSelectedMarker(station: any, newSelectedMarker: any) {
    if (!this.selectedMarker) {
      newSelectedMarker.setIcon(iconYellow);
    } else if (newSelectedMarker != this.selectedMarker) {
      const prevSelectedStation = this.$selectedStation.getValue();
      if (!this.stationIsActive(prevSelectedStation)) {
        this.selectedMarker.setIcon(iconRed);
      } else {
        this.selectedMarker.setIcon(iconBlue);
      }
      newSelectedMarker.setIcon(iconYellow);
    }
    this.$selectedStation.next(station);
    this.selectedMarker = newSelectedMarker;
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
