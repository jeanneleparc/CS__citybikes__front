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
} from 'src/app/components/main-map/icons';

@Component({
  selector: 'main-map',
  templateUrl: './main-map.html',
  styleUrls: ['./main-map.css'],
})
export class MainMap implements AfterViewInit {
  @Input() $stations: BehaviorSubject<[]> = new BehaviorSubject([]);
  @Output() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  selectedMarker: any;
  markers: any;
  private map: any;

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
        const icon = L.divIcon({
          iconAnchor: [2, 10 * 2 + 2 * 2],
          popupAnchor: [0, -(10 * 3 + 2)],
          html: '<div>Hello</div>',
        });
        return iconBlueCluster;
      },
    });
    for (const station of stations) {
      const { latitude, longitude } = station;
      var marker = L.marker([latitude, longitude], { icon: iconBlue });
      if (!this.stationIsActive(station)) {
        marker = L.marker([latitude, longitude], { icon: iconRed });
      }
      // manage the selected station
      if (this.$selectedStation.value?.id == station.id) {
        marker = L.marker([latitude, longitude], { icon: iconYellow });
        this.selectedMarker = marker;
      }
      marker.on('click', (event) => {
        this.manageSelectedMarker(station, event.target);
      });
      // marker.bindPopup(this.createMarkerPopup(station)); // to add popup
      this.markers.addLayer(marker);
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
