import { Component, AfterViewInit } from '@angular/core';
import { DataService } from './data.service';
import * as L from 'leaflet';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  stations: any = {};
  selectedStation: any = {};
  private map: any;
  sidebar: any;
  sidebarIsVisible: boolean = false;
  lastUpdatedTime: string = '';

  constructor(private dataService: DataService) {}

  ngAfterViewInit(): void {
    this.initMap();

    this.dataService.sendGetRequest().subscribe((data) => {
      this.stations = data;
      this.setUpLastUpdatedTime(data[0].last_updated);
      this.addMarkers();
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

    // sidebar
    this.sidebar = document.getElementById('mySidepanel');
  }

  addMarkers(): void {
    for (const station of this.stations) {
      const { latitude, longitude } = station;
      const marker = L.marker([latitude, longitude]);
      // marker.bindPopup(this.createMarkerPopup(station)); // to add popup

      marker.addTo(this.map).on('click', () => {
        if (this.sidebarIsVisible) {
          if (station != this.selectedStation) {
            this.selectedStation = station;
          } else {
            this.closeSidebar();
          }
        } else {
          this.openSidebar(station);
        }
      });
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

  setUpLastUpdatedTime(brutLastUpdatedTime: string) {
    const lastUpdatedDate = new Date(brutLastUpdatedTime);
    this.lastUpdatedTime = `${lastUpdatedDate.toLocaleTimeString()} on ${lastUpdatedDate.toDateString()} EST`;
  }

  openSidebar(station: any) {
    this.selectedStation = station;
    this.sidebar.style.width = '250px';
    this.sidebarIsVisible = true;
  }

  public closeSidebar() {
    this.sidebar.style.width = '0';
    this.sidebarIsVisible = false;
  }
}
