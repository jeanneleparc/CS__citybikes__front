import { Component, AfterViewInit, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/data.service';
import {
  iconBlue,
  iconYellow,
  iconRed,
} from 'src/app/components/main-map/icons';

@Component({
  selector: 'main-map',
  templateUrl: './main-map.html',
  styleUrls: ['./main-map.css'],
})
export class MainMap implements AfterViewInit {
  stations: any[] = [];
  @Output() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  @Output() $lastUpdatedTime: BehaviorSubject<string> = new BehaviorSubject('');
  selectedMarker: any;
  private map: any;

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.dataService.sendGetRequest().subscribe((data) => {
      this.stations = data;
      this.$lastUpdatedTime.next(data[0].last_updated);
      this.addMarkers(data);
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

  addMarkers(stations: any[]): void {
    const markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      maxClusterRadius: 50,
    });
    for (const station of stations) {
      const { latitude, longitude } = station;
      var marker = L.marker([latitude, longitude], { icon: iconBlue });
      if (station.station_status != 'active' || !station.is_installed) {
        marker = L.marker([latitude, longitude], { icon: iconRed });
      }
      marker.on('click', (event) => {
        this.manageSelectedMarker(station, event.target);
      });
      // marker.bindPopup(this.createMarkerPopup(station)); // to add popup
      markers.addLayer(marker);
    }
    this.map.addLayer(markers);
  }

  manageSelectedMarker(station: any, newSelectedMarker: any) {
    if (!this.selectedMarker) {
      newSelectedMarker.setIcon(iconYellow);
    } else if (newSelectedMarker != this.selectedMarker) {
      this.selectedMarker.setIcon(iconBlue);
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
}
