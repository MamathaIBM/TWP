import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeliverableCompletionService {
  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient ) {}

  public getCDforAccount(IntegrationID:string): any {
    const newParam = 'IntegrationID=' + IntegrationID;
    return this._http.get(this.baseURL + '/CDforAccount?' + newParam);
  }

  public getCDStatusKeywords(): any {
    return this._http.get(this.baseURL + '/CDStatus');
  }

  public putCDAccount(obj:any): any {
    return this._http.put(this.baseURL+"/putCDAccount",obj)
  }
}
