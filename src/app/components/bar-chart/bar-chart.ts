import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/data.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.html',
  styleUrls: ['./bar-chart.css'],
})
export class BarChart implements OnInit {
  @Input() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  @Input() $lastUpdatedTime: BehaviorSubject<string> = new BehaviorSubject('');
  idStation!: Number;
  day!: String;
  statsAvgFillingRate: any[] = [];
  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.$lastUpdatedTime.subscribe((lastUpdatedTime) => {
      this.day = moment(lastUpdatedTime).clone().format('dddd');
    });
    this.$selectedStation.subscribe((selectedStation) => {
      if (!selectedStation.id) {
        return;
      }
      this.idStation = selectedStation.id;
      this.dataService
        .sendGetAvgFillingRateByIdByDayRequest(this.idStation, this.day)
        .subscribe((data) => {
          this.statsAvgFillingRate = data;
        });
    });
  }
}
