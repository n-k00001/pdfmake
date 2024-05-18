import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  ApiUrl = 'http://localhost:3000/chartData'
  constructor(private _HttpClient:HttpClient) { }

  getData(){
    return this._HttpClient.get(this.ApiUrl);
  }
}
