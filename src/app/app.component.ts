import { Component, AfterViewInit } from '@angular/core';
import { DataService } from './data.service';
import * as L from 'leaflet';
import 'leaflet.markercluster';

// icon de base
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

// icon 2
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

const iconBlue = createColoredMarker(blue);
const iconRed = createColoredMarker(red);
const iconYellow = createColoredMarker(yellow);

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

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit {
  stations: any = {};
  selectedStation: any = {};
  selectedMarker: any;
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

  setUpLastUpdatedTime(brutLastUpdatedTime: string) {
    const lastUpdatedDate = new Date(brutLastUpdatedTime);
    this.lastUpdatedTime = `${lastUpdatedDate.toLocaleTimeString()} on ${lastUpdatedDate.toDateString()} EST`;
  }

  addMarkers(): void {
    const markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: false,
      maxClusterRadius: 50,
    });
    for (const station of this.stations) {
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
    if (station != this.selectedStation) {
      if (this.selectedMarker) this.selectedMarker.setIcon(iconBlue);
      if (!this.sidebarIsVisible) this.openSidebar(station);
    } else {
      if (this.sidebarIsVisible) this.closeSidebar();
      else this.openSidebar(station);
    }
    this.selectedStation = station;
    this.selectedMarker = newSelectedMarker;
    newSelectedMarker.setIcon(iconYellow);
  }

  createMarkerPopup(station: any): string {
    return (
      `` +
      `<h6>Name: ${station.name}</h6>` +
      `<div>${station.num_bikes_available} available bikes</div>` +
      `<div>${station.num_docks_available} available docks</div>`
    );
  }

  openSidebar(station: any) {
    this.selectedStation = station;
    this.sidebar.style.width = '25%';
    this.sidebarIsVisible = true;
  }

  public closeSidebar() {
    this.sidebar.style.width = '0';
    this.sidebarIsVisible = false;
  }
}
