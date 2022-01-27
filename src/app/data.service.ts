import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private REST_API_SERVER = 'http://localhost:8000/station_status';

  constructor(private httpClient: HttpClient) {}

  public sendGetRequest() {
    return this.httpClient.get<any>(this.REST_API_SERVER);
  }
}
