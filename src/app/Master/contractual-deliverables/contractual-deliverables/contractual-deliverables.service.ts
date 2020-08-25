import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContractualDeliverablesService {
  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient ) {
   // this.StakeLength = 0;
   }

  public getDelivnameKeywordResult(): any {
       return this._http.get(this.baseURL + '/DelivnameKeyword');
  }

  public getContractualDeliverablesResult(id: string): any {
     return this._http.get(this.baseURL + '/ContractualDeliverablesResult/' + id);
  }

  public postCD(obj: any ): any {
    return this._http.post(this.baseURL + '/CDSave', obj);
  }

  public postCDMandatory(obj: any ): any {
    return this._http.post(this.baseURL + '/CDMandatorySave', obj);
  }

  public putCD(obj: any ): any {
    return this._http.put(this.baseURL + '/CDUpdate', obj);
  }

  public deleteCD(obj: string): any {
    return this._http.delete(this.baseURL + '/CDDelete/' + obj);
  }

  public getDuplicateCDResult(obj: any): any {
    const newParam = 'DeliverableValues=' + obj.DeliverableValue + '&IntegrationID=' + obj.IntigrationID;
     return this._http.get(this.baseURL + '/DuplicateCDResult?' + newParam);
  }

  getEmployeeDirectory(obj: string): any {
    const newParam = 'USERNAME=' + obj;
       return this._http.get(this.baseURL + '/getEmployeeDirectory?' + newParam );
  }

  public getDelVal(CDName:string):any{
    return this._http.get(this.baseURL+'/getDelVal/'+CDName);
  }

  public getCDMandatoryFields(): any {
    return this._http.get(this.baseURL + '/CDMandatoryFields');
}
  
}
