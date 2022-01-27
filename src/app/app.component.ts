import { Component } from '@angular/core';
import * as moment from 'moment-timezone';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  sidebarIsVisible: boolean = false;
  lastUpdatedTime: string = '';
  $refresh: Subject<boolean> = new Subject();
  $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  loading: boolean = false;

  constructor() {}

  setUpLastUpdatedTime(brutLastUpdatedTime: string) {
    if (brutLastUpdatedTime != '') {
      const lastUpdatedDate =
        moment(brutLastUpdatedTime).tz('America/New_York');
      this.lastUpdatedTime = `${lastUpdatedDate.format(
        'hh:mm:ss a'
      )} on ${lastUpdatedDate.format('YYYY-MM-DD')} EST`;
    }
    this.loading = false;
  }

  triggerRefresh() {
    this.$refresh.next(true);
    this.loading = true;
  }

  changeSelectedStation(newSelectedStation: any) {
    this.$selectedStation.next(newSelectedStation);
  }
}
