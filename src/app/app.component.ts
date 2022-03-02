import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { BehaviorSubject, timer } from 'rxjs';
import { DataService } from './data.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  $stations: BehaviorSubject<[]> = new BehaviorSubject([]);
  lastUpdatedTime$: BehaviorSubject<string> = new BehaviorSubject('');
  $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  loading: boolean = false;
  tabs: any[] = [
    {
      name: 'main',
      title: 'Home',
    },
    {
      name: 'stats',
      title: 'Statistics',
    },
  ];
  currentTab: string = 'main';

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.autoRefreshData();
  }

  autoRefreshData(): void {
    timer(0, 1 * 60 * 1000) //  refresh automatically every minute
      .pipe(mergeMap(() => this.dataService.sendGetStatusRequest()))
      .subscribe((data) => {
        this.$stations.next(data);
        this.setUpLastUpdatedTime(data[0].last_updated);
        if (this.$selectedStation.getValue()) {
          this.refreshSelectedStation(data, this.$selectedStation.getValue());
        }
      });
  }

  forceRefreshData(): void {
    this.dataService.sendGetStatusRequest().subscribe((data) => {
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
      this.lastUpdatedTime$.next(
        `${lastUpdatedDate.format('hh:mm a')} on ${lastUpdatedDate.format(
          'YYYY-MM-DD'
        )} EST`
      );
    }
  }

  refreshSelectedStation(stations: any[], prevSelectedStation: any): void {
    const newSelectedStation = stations.find((station) => {
      return station.id == prevSelectedStation.id;
    });
    this.$selectedStation.next(newSelectedStation);
  }

  triggerRefresh() {
    this.forceRefreshData();
    this.loading = true;
  }

  changeSelectedStation(newSelectedStation: any) {
    this.$selectedStation.next(newSelectedStation);
  }

  changeTab(tab: string) {
    this.currentTab = tab;
  }
}
