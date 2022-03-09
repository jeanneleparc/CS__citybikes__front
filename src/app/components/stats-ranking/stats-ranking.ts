import { Component, EventEmitter, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import * as moment from 'moment-timezone';

import { DataService } from 'src/app/data.service';
import {
  MenuIndex,
  MenuItem,
} from 'src/app/components/dropdown-menu/dropdown-menu';

@Component({
  selector: 'stats-ranking',
  templateUrl: './stats-ranking.html',
  styleUrls: ['./stats-ranking.css'],
})
export class StatsRanking implements OnInit {
  topStations: any[] = [];
  loading: boolean = false;
  $onSelectChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  selectedDay: string | null = null;
  selectedTimeSlot: {
    text: string;
    value: number;
  } | null = null;

  weekdays: string[] = [...Array(7).keys()].map((i) =>
    moment().startOf('weeks').add(i, 'days').format('dddd')
  );
  timeslots: any[] = [...Array(24).keys()].map((i) => ({
    // eslint-disable-next-line prettier/prettier
    text: `${moment().startOf('day').add(i, 'hours').format('hh a')} - ${moment().startOf('day').add(i + 1, 'hours').format('hh a')}`,
    value: i,
  }));
  timeslotMenus: MenuItem[] = [
    {
      text: 'Morning',
      subMenu: this.timeslots.slice(4, 12),
    },
    {
      text: 'Afternoon',
      subMenu: this.timeslots.slice(13, 21),
    },
    {
      text: 'Night',
      subMenu: this.timeslots.slice(21, 24).concat(this.timeslots.slice(0, 4)),
    },
  ];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.$onSelectChange
      .pipe(
        filter(() => this.selectedTimeSlot != null && this.selectedDay != null)
      )
      .subscribe(() => {
        this.loading = true;
        this.dataService
          .sendPostRankingStationRequest(
            this.selectedTimeSlot?.value || 8,
            this.selectedDay || 'Wednesday'
          )
          .subscribe((data) => {
            this.topStations = data;
            this.loading = false;
          });
      });
  }

  public onSelectTimeSlot(menuIndex: MenuIndex) {
    this.selectedTimeSlot =
      this.timeslotMenus[menuIndex.menuIndex].subMenu[menuIndex.submenuIndex];
    this.$onSelectChange.emit();
  }

  public onSelectWeekDay(weekday: string) {
    this.selectedDay = weekday;
    this.$onSelectChange.emit(true);
  }
}
