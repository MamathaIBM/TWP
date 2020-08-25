import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SprintScopeService {
  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient ) {}
  public scopedApplication(epic:number,sprint:number,IntegrationID:string):any{
      return this._http.get(this.baseURL+'/scopedApplication/'+epic+'/'+sprint+'/'+IntegrationID)
  }
  public getAppIDResult(id: string): any {
    console.log(this.baseURL + '/ScopeAppIDResult/' + id)
    return this._http.get(this.baseURL + '/ScopeAppIDResult/' + id);
  }
  public getEpicsName(obj:string):any{
    return  this._http.get(this.baseURL+'/getEpicsName/'+obj);
  } 
  public getEpicNameResult(id: string): any {
    return this._http.get(this.baseURL + '/ScopeEpicNameResult/' + id);
  }
  public getSprintNamesData(ID:string,epic:number,Scope_Level:string):any{
       return  this._http.get(this.baseURL+'/getSprintNames/'+ID+"/"+epic+"/"+Scope_Level);
  } 
  public getSprintNamesResult(id: string, EpicName: string): any {
    const newParam = 'Scope_IntegrationID=' + id + '&Scope_EpicID=' + EpicName;
    return this._http.get(this.baseURL + '/ScopeSprintNamesResult?' + newParam);
  }
  
  public getSprintScopeDataResult(id: string): any {
     return this._http.get(this.baseURL + '/SprintScopeDataResult/' + id);
    // return this._http.get(this.baseURL + '/SprintScopeDataResult/' + id)
    //                .pipe(map((res) => Observable.from(res));

  }

  public duplicateSprintScope(obj: any): any {
  const newParam = 'Scope_NameOfApp=' + obj.Scope_NameOfApp + '&IntegrationID=' + obj.Scope_IntegrationID
  + '&epicUNID=' + obj.Scope_EpicID+ '&sprintUNID=' + obj.Scope_SprintName+ '&Scope_Level=' + obj.Scope_Level
  + '&Scope_STInfoLevelAdd=' + obj.Scope_STInfoLevelAdd+ '&Scope_BackLog=' + obj.Scope_BackLog;
   return this._http.get(this.baseURL + '/duplicateSprintScope?' + newParam);
}

  public postAddSprintScope(obj: any): any {
      return this._http.post(this.baseURL + '/AddSprintScope', obj );
   }
    public putUpdateSprintScope(obj: any): any {
      return this._http.put(this.baseURL + '/UpdateSprintScope', obj);
  }
    public DeleteSprintScope(obj: string,Scope_Level : string,deletionUNID:string): any {
    return this._http.delete(this.baseURL + '/DeleteSprintScope/' + obj+'/'+Scope_Level+'/'+deletionUNID);
  }
  public getSTInfoResult(id: string): any {
    return this._http.get(this.baseURL + '/ScopeSTInfoResult/' + id);
  }

  public getScopeLvels():any{
    return this._http.get(this.baseURL+'/getScopeLvels/');
  }

}
