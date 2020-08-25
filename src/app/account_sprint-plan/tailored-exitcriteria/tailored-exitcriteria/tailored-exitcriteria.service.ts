import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TailoredExitcriteriaService {
  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient ) {}
  getTailoredECforAccountSpecific(phase:string,IntegrationID:string):any {
    return this._http.get(this.baseURL+"/TailoredECforAccountSpecific/"+phase+"/"+IntegrationID)
  }
  public getECPhaseResult(): any {
    return this._http.get(this.baseURL + '/ECPhaseResult');
  }

  public getTailoredECResult(phase:string, IntegrationID:string): any {
    const newParam = 'phase=' + phase + '&IntegrationID=' + IntegrationID;
    return this._http.get(this.baseURL + '/TailoredEC?' + newParam);
  }

  public getTailoredECAccountResult(phase:string, IntegrationID:string): any {
    const newParam = 'phase=' + phase + '&IntegrationID=' + IntegrationID;
    return this._http.get(this.baseURL + '/TailoredECAccount?' + newParam);
  }

  public postTailoredECAdd(obj:any): any {
    return this._http.post(this.baseURL + '/postTailoredECAdd',  obj);
  }

  public postTailoredEC(obj:any): any {
    console.log("servoce")
    console.log(obj)
    return this._http.post(this.baseURL+ '/postTailoredEC',obj)
  }

  public putTailoredEC(obj:any): any {
    return this._http.put(this.baseURL+"/putTailoredEC",obj)
  }
}
