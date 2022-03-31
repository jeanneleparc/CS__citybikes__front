import * as _ from 'lodash';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  Chart,
  ChartConfiguration,
  ChartData,
  ChartType,
  registerables,
} from 'chart.js';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
import { BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject } from 'rxjs';

Chart.register(...registerables);
Chart.register(MatrixController, MatrixElement);

import { DataService } from 'src/app/data.service';
import { WEEK_DAYS } from 'src/app/interfaces';
import * as moment from 'moment-timezone';

import { getBackgroundColor } from 'src/app/components/matrix-chart/matrix-chart-color';

@Component({
  selector: 'matrix-chart',
  templateUrl: './matrix-chart.html',
  styleUrls: ['./matrix-chart.scss'],
})
export class MatricChart implements OnInit {
  @Input() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  idStation!: number;
  stationStats: any = {};
  loading: boolean = false;

  firstHour = 6;
  lastHour = 22;
  timeslotLabels: string[] = [
    ...Array(this.lastHour - this.firstHour).keys(),
  ].map(
    (i) =>
      `${moment()
        .startOf('day')
        .add(i + this.firstHour, 'hours')
        .format('hh a')} - ${moment()
        .startOf('day')
        .add(i + this.firstHour + 1, 'hours')
        .format('hh a')}`
  ); // form of the label : "6:00 - 7:00"

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.$selectedStation.subscribe((selectedStation) => {
      if (_.isNil(selectedStation) || _.isEmpty(selectedStation)) {
        return;
      }
      if (selectedStation.id == this.idStation) return;
      this.loading = true;
      this.idStation = selectedStation.id;
      this.dataService
        .sendPostStatsByStationIdRequest(this.idStation)
        .subscribe((data) => {
          this.stationStats = data;
          this.barChartData = {
            datasets: [
              {
                data: this.generateMatrixData(),
                backgroundColor: function (ctx) {
                  const pointData: any = { ...ctx.dataset.data[ctx.dataIndex] };
                  const value = pointData.v;
                  return getBackgroundColor(value);
                },
              },
            ],
          };
          this.loading = false;
        });
    });
  }

  getHours() {
    const hours: any[] = [];
    for (let i = this.firstHour; i <= this.lastHour; i++) {
      hours.push(i);
    }
    return hours;
  }

  generateMatrixData(): Array<{ x: number; y: number; v: number }> {
    const matrixData: any[] = [];

    WEEK_DAYS.forEach((weekday) => {
      for (
        let timeSlot = this.firstHour;
        timeSlot <= this.lastHour;
        timeSlot++
      ) {
        matrixData.push({
          y: this.timeslotLabels[timeSlot - this.firstHour],
          x: weekday,
          v: Math.round(
            this.stationStats[weekday][timeSlot].avgFillingRate * 100
          ),
        });
      }
    });
    return matrixData;
  }

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category',
        labels: WEEK_DAYS,
        grid: {
          display: false,
          drawBorder: false,
        },
      },
      y: {
        type: 'category',
        labels: this.timeslotLabels.reverse(),
        grid: {
          display: false,
          drawBorder: false,
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const item: any = tooltipItem.raw;
            var label = [`${item.y}`, `${item.v}%`];
            return label;
          },
        },
        displayColors: false,
      },
    },
  };
  public barChartType: ChartType = 'matrix';
  public barChartLegend = false;
  public barChartData!: ChartData<'matrix'>;
}
