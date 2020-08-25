import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExitcriteriaaccountsService {
  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient ) {}

  public getExitCriteriaforAccount(IntegrationID:string): any {
    const newParam = 'IntegrationID=' + IntegrationID;
    return this._http.get(this.baseURL + '/ExitCriteriaforAccount?' + newParam);
  }

  public getECStatusKeywords(): any {
    return this._http.get(this.baseURL + '/ExitCriteriaStatus');
  }

  public putExitCriteriaAccount(obj:any): any {
    return this._http.put(this.baseURL+"/putExitCriteriaAccount",obj)
  }

}
