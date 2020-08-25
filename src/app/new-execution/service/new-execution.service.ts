import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class NewExecutionService {
  baseURL = environment.baseUrl;
  TranVal: any;
  constructor(private _http: HttpClient) { }

  public getOwnTTSKeywordResult(): any {
    return this._http.get(this.baseURL + '/OwnTTSKeyword');
  }

  public getSectorKeywordResult(): any {
    return this._http.get(this.baseURL + '/SectorKeyword');
  }


  public getIndPubKeywordResult(): any {
    return this._http.get(this.baseURL + '/IndPubKeyword');
  }


  public getIndFSSKeywordResult(): any {
    return this._http.get(this.baseURL + '/IndFSSKeyword');
  }

  public getIndIndKeywordResult(): any {
    return this._http.get(this.baseURL + '/IndIndKeyword');
  }

  public getIndDisKeywordResult(): any {
    return this._http.get(this.baseURL + '/IndDisKeyword');
  }

  public getIndComKeywordResult(): any {
    return this._http.get(this.baseURL + '/IndComKeyword');
  }

  public getSolYearKeywordResult(): any {
    return this._http.get(this.baseURL + '/SolYearKeyword');
  }

  public getIncumbentVendorResult(): any {
    return this._http.get(this.baseURL + '/IncumbentVendorkeyword');
  }

  public getIOTResult(): any {
    return this._http.get(this.baseURL + '/IOTkeyword');
  }

  public getTransStatusResult(): any {
    return this._http.get(this.baseURL + '/Transtatuskeyword');
  }

  public getCICLocationsResult(): any {
    return this._http.get(this.baseURL + '/CICLocationsKeyword');
  }

  public getAPIOTKeywordResult(): any {
    return this._http.get(this.baseURL + '/APIOTKeyword');
  }

  public getEuropeIOTKeywordResult(): any {
    return this._http.get(this.baseURL + '/EuropeIOTKeyword');
  }

  public getNAIOTKeywordResult(): any {
    return this._http.get(this.baseURL + '/NAIOTKeyword');
  }

  public getLAIOTKeywordResult(): any {
    return this._http.get(this.baseURL + '/LAIOTKeyword');
  }

  public getGCGIOTKeywordResult(): any {
    return this._http.get(this.baseURL + '/GCGIOTKeyword');
  }

  public getJAPANIOTKeywordResult(): any {
    return this._http.get(this.baseURL + '/JAPANIOTKeyword');
  }

  public getMEAIOTKeywordResult(): any {
    return this._http.get(this.baseURL + '/MEAIOTKeyword');
  }
  
  public getServiceLineKeywordResult(): any {
    return this._http.get(this.baseURL + '/ServiceLineKeyword');
  }

  public getTransTypeResult(): any {
    return this._http.get(this.baseURL + '/TransitionTypeKeyword');
  }

  public getTransScopeResult(): any {
    return this._http.get(this.baseURL + '/TransitionScopeKeyword');
  }

  public getStStateScopeResult(): any {
    return this._http.get(this.baseURL + '/StStateScopeKeyword');
  }

  public getDuplicateTransProfile(obj: any): any {

    const newParam = 'IntegrationID=' + obj.IntegrationID;
    return this._http.get(this.baseURL + '/TransProfileDuplicate?' + newParam);

  }
  public getEngProfileDataResult(obj: any): any {   
    const newParam = 'Account_Name=' + obj.Account_Name + '&OwningTTS=' + obj.OwningTTS + '&Sector=' + obj.Sector + '&Industry=' + obj.Industry + '&Solyear=' + obj.Solyear + '&SiebelNo=' + obj.SiebelNo + '';
      return this._http.get(this.baseURL + '/EngProfileData?' + newParam);
  } 
}
