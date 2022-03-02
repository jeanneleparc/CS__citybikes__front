import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/data.service';

@Component({
  selector: 'stats-ranking',
  templateUrl: './stats-ranking.html',
  styleUrls: ['./stats-ranking.css'],
})
export class StatsRanking implements OnInit {
  topStations: any[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService
      .sendPostRankingStationRequest(8, 'wednesday')
      .subscribe((data) => {
        console.log(data);
        this.topStations = data;
      });
  }
}
