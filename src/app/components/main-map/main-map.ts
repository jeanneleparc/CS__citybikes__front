import { Component, AfterViewInit, Output, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import * as L from 'leaflet';
import 'leaflet.markercluster';

import {
  iconBlue,
  iconYellow,
  iconRed,
  createIconCluster,
  createColorIconFromFillingRate,
  createColorIconFromBikeNumber,
} from 'src/app/components/main-map/icons';
import { IStation, IStationStat } from 'src/app/interfaces';

@Component({
  selector: 'main-map',
  templateUrl: './main-map.html',
  styleUrls: ['./main-map.scss'],
})
export class MainMap implements AfterViewInit {
  @Input() $stations: BehaviorSubject<[]> = new BehaviorSubject([]);
  @Input() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  @Input() $selectedAnalytic: BehaviorSubject<string> = new BehaviorSubject('');
  @Input() $isStatistics: BehaviorSubject<any> = new BehaviorSubject(false);
  @Input() $dynamicSelect: BehaviorSubject<any> = new BehaviorSubject({});
  @Output() $selectedStationChange: BehaviorSubject<any> = new BehaviorSubject(
    {}
  );
  prevSelectedMarker: any;
  prevSelectedStation: any;
  markers: any;
  private map: any;
  stationMarkersDict: any = {};

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
    this.$stations.subscribe(() => {
      this.refreshData();
    });
    // Dynamic select
    this.$dynamicSelect
      .pipe(filter((station) => !!station?.id))
      .subscribe((station) => {
        this.manageSelectedMarker(station, this.stationMarkersDict[station.id]);
        this.zoomOnStationSelected(this.stationMarkersDict[station.id]);
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
    const selectedAnalytic = this.$selectedAnalytic.value;

    // add clusters
    this.markers = L.markerClusterGroup({
      spiderfyOnMaxZoom: false,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      maxClusterRadius: 50,
      iconCreateFunction(cluster) {
        return createIconCluster(isStatistics, selectedAnalytic, cluster);
      },
    });

    // add markers
    for (const station of stations) {
      if (!isStatistics) {
        this.addDefaultMarker(station);
      } else {
        this.addStatMarker(station);
      }
      // marker.bindPopup(this.createMarkerPopup(station)); // to add popup
    }

    // Closing panel
    this.$selectedStation
      .pipe(filter((station) => station === null))
      .subscribe(() => {
        this.resetPrevMarker();
      });
    this.map.addLayer(this.markers);
  }

  addDefaultMarker(station: IStation) {
    const { latitude, longitude } = station;
    var marker = L.marker([latitude, longitude], { icon: iconBlue });
    if (!this.stationIsActive(station)) {
      marker = L.marker([latitude, longitude], { icon: iconRed });
    }

    marker.on('click', (event) => {
      this.manageSelectedMarker(station, event.target);
    });

    if (this.$selectedStation.getValue()?.id == station.id) {
      marker = L.marker([latitude, longitude], { icon: iconYellow });
      this.prevSelectedMarker = marker;
    }
    this.stationMarkersDict[station.id] = marker;
    this.markers.addLayer(marker);
  }

  addStatMarker(station: IStationStat) {
    const selectedAnalytic = this.$selectedAnalytic.value;
    const { latitude, longitude } = station;
    if (selectedAnalytic === 'fillingRate') {
      const fillingRate = station?.fillingRate ?? -1;
      if (fillingRate !== -1) {
        var marker = L.marker([latitude, longitude], {
          icon: createColorIconFromFillingRate(fillingRate),
        });
        // @ts-ignore: Unreachable code error
        marker.fillingRate = fillingRate;
        this.markers.addLayer(marker);
      }
    } else {
      const avgBikesNb = station?.avgBikesNb ?? -1;
      if (avgBikesNb !== -1) {
        var marker = L.marker([latitude, longitude], {
          icon: createColorIconFromBikeNumber(avgBikesNb),
        });
        // @ts-ignore: Unreachable code error
        marker.avgBikesNb = avgBikesNb;
        this.markers.addLayer(marker);
      }
    }
  }

  manageSelectedMarker(station: IStation, newSelectedMarker: any) {
    newSelectedMarker.setIcon(iconYellow);
    if (this.prevSelectedMarker !== newSelectedMarker) this.resetPrevMarker();
    this.$selectedStationChange.next(station);
    this.prevSelectedStation = station;
    this.prevSelectedMarker = newSelectedMarker;
  }

  resetPrevMarker() {
    if (this.prevSelectedMarker) {
      if (!this.stationIsActive(this.prevSelectedStation)) {
        this.prevSelectedMarker.setIcon(iconRed);
      } else {
        this.prevSelectedMarker.setIcon(iconBlue);
      }
    }
  }

  createMarkerPopup(station: IStation): string {
    return (
      `` +
      `<h6>Name: ${station.name}</h6>` +
      `<div>${station.num_bikes_available} available bikes</div>` +
      `<div>${station.num_docks_available} available docks</div>`
    );
  }

  stationIsActive(station: IStation) {
    return station?.station_status == 'active';
  }

  zoomOnStationSelected(marker: any) {
    var latLngs = [marker.getLatLng()];
    var markerBounds = L.latLngBounds(latLngs);
    this.map.fitBounds(markerBounds);
  }
}
