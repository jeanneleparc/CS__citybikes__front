import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  apiURL = environment.apiURL;
  private REST_API_SERVER = `${this.apiURL}:8000`;

  constructor(private httpClient: HttpClient) {}

  public sendGetStatusRequest() {
    return this.httpClient.get<any>(`${this.REST_API_SERVER}/station_status`);
  }

  public sendPostAvgFillingRateByIdByDayRequest(
    idStation: Number,
    day: String
  ) {
    return this.httpClient.post<any>(
      `${this.REST_API_SERVER}/stats_avg_filling_rate_by_station`,
      { id: idStation, weekDay: day }
    );
  }

  public sendPostAvgFillingRateByTimeslotByDayRequest(
    timeSlot: Number,
    day: String
  ) {
    return this.httpClient.post<any>(
      `${this.REST_API_SERVER}/stats_avg_filling_rate_by_timeslot`,
      { weekDay: day, timeSlot: timeSlot }
    );
  }

  public sendPostRankingStationRequest(timeSlot: Number, weekDay: String) {
    return this.httpClient.post<any>(`${this.REST_API_SERVER}/stats_ranking`, {
      timeSlot,
      weekDay,
    });
  }
}
