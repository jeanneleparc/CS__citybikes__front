import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';

import { DataService } from 'src/app/data.service';
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
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  idStation!: number;
  date!: moment.Moment;
  day: string = '';
  hour!: number;
  statsAvgFillingRate: IStatsAvgFillingRate[] = [];

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 100,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            var label = `${tooltipItem.parsed.y}%`;
            return label;
          },
        },
        displayColors: false,
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = false;
  public barChartData!: ChartData<'bar'>;

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
          const labels: string[] = [];
          data.forEach((element: IStatsAvgFillingRate) => {
            labels.push(
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
          this.barChartData = {
            labels,
            datasets: [
              {
                data: avgFillingRatePercent,
                label: 'Average Filling Rate',
                backgroundColor: backgroundColorTab,
                borderColor: borderColorTab,
                hoverBackgroundColor: colors.blue,
                hoverBorderColor: colors.blue,
              },
            ],
          };
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
        this.barChartData.datasets[0].data = avgFillingRatePercent;
        this.chart?.update();
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
