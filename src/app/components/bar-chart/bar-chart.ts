import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/data.service';
import * as moment from 'moment-timezone';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.html',
  styleUrls: ['./bar-chart.css'],
})
export class BarChart implements OnInit {
  @Input() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});

  idStation!: number;
  day: string = '';
  hour!: number;
  statsAvgFillingRate: any[] = [];

  public barChartOptions: ChartOptions = {};
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.day = moment().tz('America/New_York').format('dddd');
    this.hour = parseInt(moment().tz('America/New_York').format('HH'), 10);
    this.$selectedStation.subscribe((selectedStation) => {
      if (!selectedStation.id) {
        return;
      }
      this.idStation = selectedStation.id;
      this.dataService
        .sendGetAvgFillingRateByIdByDayRequest(this.idStation, this.day)
        .subscribe((data) => {
          this.statsAvgFillingRate = data;
          this.barChartLabels = data.map((element: any) =>
            moment.utc(element.timeSlot * 3600 * 1000).format('hh a')
          );
          const dataTest = data.map((element: any) =>
            Math.round(element.avgFillingRate * 100)
          );
          this.barChartOptions = {
            responsive: true,
            scales: {
              yAxes: [
                {
                  display: true,
                  ticks: {
                    min: 0,
                    max: 100,
                    stepSize: 100,
                  },
                  gridLines: {
                    offsetGridLines: false,
                  },
                },
              ],
              xAxes: [
                {
                  display: true,
                  ticks: {
                    maxTicksLimit: 5,
                  },
                },
              ],
            },
            title: {
              text: this.day,
              display: true,
            },
          };
          const backgroundColorTab: string[] = [];
          const borderColorTab: string[] = [];
          data.forEach(
            (element: { timeSlot: number; avgFillingRate: number }) => {
              if (element.timeSlot !== this.hour) {
                backgroundColorTab.push('#ffa05b');
                borderColorTab.push('#ffa05b');
                return;
              }
              backgroundColorTab.push('#f5812c');
              borderColorTab.push('#f5812c');
            }
          );
          this.barChartData = [
            {
              data: dataTest,
              label: 'Average Filling Rate',
              backgroundColor: backgroundColorTab,
              borderColor: borderColorTab,
              hoverBackgroundColor: '#f2cd5d',
              hoverBorderColor: '#f2cd5d',
            },
          ];
        });
    });
  }
}
