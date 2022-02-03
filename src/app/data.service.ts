import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private REST_API_SERVER = 'http://localhost:8000';

  constructor(private httpClient: HttpClient) {}

  public sendGetStatusRequest() {
    return this.httpClient.get<any>(`${this.REST_API_SERVER}/station_status`);
  }

  public sendGetAvgFillingRateByIdByDayRequest(idStation: Number, day: String) {
    return this.httpClient.get<any>(
      `${this.REST_API_SERVER}/stats_avg_filling_rate/${idStation}/${day}`
    );
  }
}
