import { Injectable } from '@angular/core';
// import { Sevenkey } from './../class/seven-key.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './../../../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class SevenKeyModuleService {

  private baseUrl = environment.baseUrl
  constructor(private _http : HttpClient ) {        
  }

  public exportAsPPT(USERIDUpload: string, lastWeekDate: string, weekend_date: string, Integration_ID: string, TransitionAccName:string): any {
    return this._http.get(this.baseUrl + '/ExportkeyPPT/'+ USERIDUpload+'/'+lastWeekDate+'/'+weekend_date+'/'+Integration_ID+'/'+TransitionAccName);
  }

  public WSRPPT(USERIDUpload: string, lastWeekDate: string, weekend_date: string, Integration_ID: string, TransitionAccName:string): any {
    return this._http.get(this.baseUrl + '/WSRPPT/'+ USERIDUpload+'/'+lastWeekDate+'/'+weekend_date+'/'+Integration_ID+'/'+TransitionAccName);
  }
  
  public listofweekenddt(id:any):any {  
    return this._http.get(this.baseUrl+ '/fetchWeekEndDt/'+id) 
  }
  public loadSevenKeyData(id:any,Type:String): any {
    return this._http.get(this.baseUrl+ '/fetchSevenKeyData/'+id+'/'+Type);
  }
  public loadDeliverables(id:any):any {  
    return this._http.get(this.baseUrl+ '/fetchDeliverables/'+id) 
  }
  public getEpics(id:any):any {
    return this._http.get(this.baseUrl+'/getEpics/'+id);
  }
  public getepicbyId(id:any):any {
    return this._http.get(this.baseUrl+'/getEpicbyId/'+id);
  }
  public getSprintbyepic(id:any):any {
    return this._http.get(this.baseUrl+'/getSprintbyepic/'+id);
  }
  public getAppbysprint(id:any,Scope_Level:any):any {
    return this._http.get(this.baseUrl+'/getAppbysprint/'+id+'/'+Scope_Level);
  }
  public loadDetailedSchedule(id:any):any { 
    return this._http.get(this.baseUrl+ '/fetchDetailedSchedule/'+id) 
  }
  public insertSevenKey(obj:any):any {   
    return this._http.post(this.baseUrl+ "/sevenkeyInsert",obj) 
  }
  public updateSevenKey(obj:any):any {   
    return this._http.post(this.baseUrl+ "/sevenkeyUpdate",obj) 
  }
  public recordExist(obj:any):any {   
    return this._http.post(this.baseUrl+ "/recordExist",obj) 
  }
  public insertSevenKeyProfile(obj:any):any {   
    return this._http.post(this.baseUrl+ "/sevenkeyProfileInsert",obj) 
  }
  public updateSevenKeyProfile(obj:any):any {   
    return this._http.post(this.baseUrl+ "/sevenkeyProfileUpdate",obj) 
  }
  public loadSevenKeyProfile(obj:any):any {   
    return this._http.post(this.baseUrl+ "/fetchSevenKeyProfile",obj) 
  }
  public getScopeLvels():any{
    return this._http.get(this.baseUrl+'/getScopeLvels/');
  }
  public getServiceBcklogData(id:any):any{
    return this._http.get(this.baseUrl+'/TailoredSBforAccount/SERVICE_BACKLOG/'+id);
  }
  public getSprintBcklogData(id:any):any{
    return this._http.get(this.baseUrl+'/TailoredSBforAccount/SPRINT_BACKLOG/'+id);
  }
  public getTranClosureData(id:any):any{
    return this._http.get(this.baseUrl+'/TailoredSBforAccount/CLOSURE/'+id);
  }
  
}
