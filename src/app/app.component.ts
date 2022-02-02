import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  $stations: BehaviorSubject<[]> = new BehaviorSubject([]);
  lastUpdatedTime: string = '';
  $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  loading: boolean = false;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    this.dataService.sendGetRequest().subscribe((data) => {
      this.$stations.next(data);
      this.setUpLastUpdatedTime(data[0].last_updated);
      if (this.$selectedStation.getValue()) {
        this.refreshSelectedStation(data, this.$selectedStation.getValue());
      }
      this.loading = false;
    });
  }

  setUpLastUpdatedTime(brutLastUpdatedTime: string) {
    if (brutLastUpdatedTime != '') {
      const lastUpdatedDate =
        moment(brutLastUpdatedTime).tz('America/New_York');
      this.lastUpdatedTime = `${lastUpdatedDate.format(
        'hh:mm a'
      )} on ${lastUpdatedDate.format('YYYY-MM-DD')} EST`;
    }
  }

  refreshSelectedStation(stations: any[], prevSelectedStation: any): void {
    const newSelectedStation = stations.find((station) => {
      return station.id == prevSelectedStation.id;
    });
    this.$selectedStation.next(newSelectedStation);
  }

  triggerRefresh() {
    this.refreshData();
    this.loading = true;
  }

  changeSelectedStation(newSelectedStation: any) {
    this.$selectedStation.next(newSelectedStation);
  }
}
