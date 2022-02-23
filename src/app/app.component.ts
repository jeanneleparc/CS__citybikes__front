import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  tabs: any[] = [
    {
      name: 'main',
      title: 'NYC Citibikes',
    },
    {
      name: 'stats',
      title: 'Statistics',
    },
  ];
  currentTab: string = 'main';

  // Statistics variables
  selectedDay$: BehaviorSubject<string> = new BehaviorSubject('Monday');
  selectedTimeSlot$: BehaviorSubject<number> = new BehaviorSubject(0);
  days: string[] = [...Array(7).keys()].map((i) =>
    moment().add(i, 'days').format('dddd')
  );
  timeslots: string[] = [...Array(24).keys()].map(
    (i) =>
      `${moment().add(i, 'hours').format('hh a')} - ${moment()
        .add(i + 1, 'hours')
        .format('hh a')}`
  );

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.refreshDataMain();
    this.refreshDataStatistics();
  }

  // Nav bar logic
  changeTab(tab: string) {
    this.currentTab = tab;
  }

  refreshDataMain(): void {
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
    this.refreshDataMain();
    this.loading = true;
  }

  changeSelectedStation(newSelectedStation: any) {
    this.$selectedStation.next(newSelectedStation);
  }

  // Statistics functions
  refreshDataStatistics(): void {
    combineLatest([this.selectedTimeSlot$, this.selectedDay$])
      .pipe(
        switchMap(([timeslot, day]) =>
          this.dataService.getStatsAvgFillingRateByTimeslot(timeslot, day)
        )
      )
      .subscribe((result) => {
        console.log(result);
      });
  }

  changeSelectedDay(dayId: number): void {
    this.selectedDay$.next(this.days[dayId]);
  }

  changeSelectedTimeSlot(timeslotId: number): void {
    this.selectedTimeSlot$.next(timeslotId);
  }
}
