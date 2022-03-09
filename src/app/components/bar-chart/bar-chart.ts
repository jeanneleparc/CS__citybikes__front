import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/data.service';
import * as moment from 'moment-timezone';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import * as _ from 'lodash';
import { colors } from 'src/colors';

export interface IStatsAvgFillingRate {
  timeSlot: number;
  avgFillingRate: number;
}

@Component({
  selector: 'bar-chart',
  templateUrl: './bar-chart.html',
  styleUrls: ['./bar-chart.scss'],
})
export class BarChart implements OnInit {
  @Input() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});

  idStation!: number;
  date!: moment.Moment;
  day: string = '';
  hour!: number;
  statsAvgFillingRate: IStatsAvgFillingRate[] = [];

  public barChartOptions: ChartOptions = {
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
    tooltips: {
      callbacks: {
        label: function (tooltipItem) {
          var label = tooltipItem.yLabel + ' %';
          return label;
        },
      },
      displayColors: false,
    },
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartPlugins = [];
  public barChartData: ChartDataSets[] = [];

  public $loading = new BehaviorSubject<boolean>(false);

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.date = moment().tz('America/New_York');
    this.day = moment().tz('America/New_York').format('dddd');
    this.hour = parseInt(moment().tz('America/New_York').format('HH'), 10);
    this.$selectedStation.subscribe((selectedStation) => {
      if (_.isNil(selectedStation) || _.isEmpty(selectedStation)) {
        return;
      }
      this.$loading.next(true);
      this.idStation = selectedStation.id;
      this.dataService
        .sendPostAvgFillingRateByIdByDayRequest(this.idStation, this.day)
        .subscribe((data) => {
          this.statsAvgFillingRate = data;
          const backgroundColorTab: string[] = [];
          const borderColorTab: string[] = [];
          const avgFillingRatePercent: number[] = [];
          this.barChartLabels = [];
          data.forEach((element: IStatsAvgFillingRate) => {
            this.barChartLabels.push(
              moment.utc(element.timeSlot * 3600 * 1000).format('hh a')
            );
            avgFillingRatePercent.push(
              Math.round(element.avgFillingRate * 100)
            );
            if (element.timeSlot !== this.hour) {
              backgroundColorTab.push(colors.orange);
              borderColorTab.push(colors.orange);
              return;
            }
            backgroundColorTab.push(colors.darkOrange);
            borderColorTab.push(colors.darkOrange);
          });
          this.barChartData = [
            {
              data: avgFillingRatePercent,
              label: 'Average Filling Rate',
              backgroundColor: backgroundColorTab,
              borderColor: borderColorTab,
              hoverBackgroundColor: colors.blue,
              hoverBorderColor: colors.blue,
            },
          ];
          this.$loading.next(false);
        });
    });
  }

  updateDataBarChart(newDate: moment.Moment): void {
    this.day = newDate.clone().format('dddd');
    this.hour = parseInt(newDate.clone().format('HH'), 10);
    this.dataService
      .sendPostAvgFillingRateByIdByDayRequest(this.idStation, this.day)
      .subscribe((dataCall) => {
        this.statsAvgFillingRate = dataCall;
        const avgFillingRatePercent = dataCall.map(
          (element: IStatsAvgFillingRate) =>
            Math.round(element.avgFillingRate * 100)
        );

        this.barChartData[0].data = avgFillingRatePercent;
      });
  }

  goToPreviousDay(): void {
    this.date = this.date.subtract(1, 'day');
    this.updateDataBarChart(this.date);
  }

  goToNextDay(): void {
    this.date = this.date.add(1, 'day');
    this.updateDataBarChart(this.date);
  }
}
