import { Component, OnInit } from '@angular/core';
import * as moment from 'moment-timezone';
import { BehaviorSubject, combineLatest, timer } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  $stations: BehaviorSubject<[]> = new BehaviorSubject([]);
  $stationsStatistics: BehaviorSubject<[]> = new BehaviorSubject([]);
  $isStatistics: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  $lastUpdatedTime: BehaviorSubject<string> = new BehaviorSubject('');
  $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  loading: boolean = false;
  tabs: any[] = [
    {
      name: 'main',
      title: 'Home',
    },
  ];
  statsTabs: any[] = [
    {
      name: 'stats-map',
      title: 'Repartition of the bikes',
    },
    {
      name: 'stats-ranking',
      title: 'Ranking of the stations',
    },
  ];
  currentTab: string = 'main';

  // Statistics variables
  $selectedDay: BehaviorSubject<string> = new BehaviorSubject('Monday');
  $selectedTimeSlot: BehaviorSubject<number> = new BehaviorSubject(0);
  days: string[] = [...Array(7).keys()].map((i) =>
    moment().startOf('weeks').add(i, 'days').format('dddd')
  );
  timeslots: string[] = [...Array(24).keys()].map(
    (i) =>
      `${moment().startOf('day').add(i, 'hours').format('hh a')} - ${moment()
        .startOf('day')
        .add(i + 1, 'hours')
        .format('hh a')}`
  );

  currentDayNumber: number = moment().tz('America/New_York').day();
  currentTimeslotNumber: number = parseInt(
    moment().tz('America/New_York').format('HH'),
    10
  );

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.autoRefreshData();
    this.refreshDataStatistics();
  }

  // Nav bar logic
  changeTab(tab: string) {
    this.currentTab = tab;
    if (tab === 'stats') {
      this.$isStatistics.next(true);
    } else {
      this.$isStatistics.next(false);
    }
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
      this.$lastUpdatedTime.next(
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

  // Statistics functions
  refreshDataStatistics(): void {
    combineLatest([this.$selectedTimeSlot, this.$selectedDay])
      .pipe(
        switchMap(([timeslot, day]) =>
          this.dataService.sendPostAvgFillingRateByTimeslotByDayRequest(
            timeslot,
            day
          )
        )
      )
      .subscribe((result) => {
        this.$stationsStatistics.next(result);
      });
  }

  changeSelectedDay(dayId: number): void {
    this.$selectedDay.next(this.days[dayId]);
  }

  changeSelectedTimeSlot(timeslotId: number): void {
    this.$selectedTimeSlot.next(timeslotId);
  }
}
