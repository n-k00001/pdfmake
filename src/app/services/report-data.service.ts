import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  ApiUrl = 'https://n-k00001.github.io/report_api/data.json'
  constructor(private _HttpClient:HttpClient) { }

  getData(){
    return this._HttpClient.get(this.ApiUrl);
  }
}
