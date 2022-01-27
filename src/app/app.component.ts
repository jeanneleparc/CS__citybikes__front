import { Component } from '@angular/core';
import * as moment from 'moment-timezone';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  sidebarIsVisible: boolean = false;
  lastUpdatedTime: string = '';
  $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});

  constructor() {}

  setUpLastUpdatedTime(brutLastUpdatedTime: string) {
    if (brutLastUpdatedTime != '') {
      const lastUpdatedDate =
        moment(brutLastUpdatedTime).tz('America/New_York');
      this.lastUpdatedTime = `${lastUpdatedDate.format(
        'hh:mm:ss a'
      )} on ${lastUpdatedDate.format('YYYY-MM-DD')} EST`;
    }
  }

  changeSelectedStation(newSelectedStation: any) {
    this.$selectedStation.next(newSelectedStation);
  }
}
