import { TrnPlanApplnLevel } from './../class/TrnPlanApplnLevel.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class SprintPlanApplnLevelService {
  private baseUrl = environment.baseUrl;
  constructor(private http : HttpClient) { }
  public profileStartandEndDate(IntegrationID: string):any{
    return this.http.get(this.baseUrl+'/profileStartandEndDate/'+IntegrationID)
  }
  getexportOverallTranDash(UserNm: string, IntegrationID:string, TransitionAccName:string): any {
        return this.http.get(this.baseUrl + '/getexportOverallTranDash/'+ UserNm+'/'+IntegrationID+'/'+TransitionAccName);  
      }
  getexportATSchSummary(UserNm: string, IntegrationID:string, TransitionAccName:string): any {
    return this.http.get(this.baseUrl + '/getexportATSchSummary/'+ UserNm+'/'+IntegrationID+'/'+TransitionAccName);  
  }
  getaccountExistCheck(IntegrationID:string,epic: string,sprint:string):any{
    var sprintid;
    if(sprint === ''|| sprint === null){
        sprintid='x'
    }else{
      sprintid = sprint
    }
    return this.http.get(this.baseUrl+'/TrnPlanApplnLevelAccountExistCheck/'+IntegrationID+'/'+epic+'/'+sprintid)
  }  
  public getSprintNamesData(ID:string,epic:string,level:string):any{
    
    return  this.http.get(this.baseUrl+'/getSprintNames/'+ID+"/"+epic+"/"+level);
  }
  public getEpicsName(obj:string):any{
    return  this.http.get(this.baseUrl+'/getEpicsName/'+obj);
  } 
  public getappLevelSpPlanResult(id: string,epic: string,sprint:string,Scope_Level:string): any {
    var sprintid;
    if(sprint === ''|| sprint === null){
        sprintid='x'
    }else{
      sprintid = sprint
    }
      return this.http.get(this.baseUrl + '/appLevelSpPlanResult/' + id+'/'+epic+'/'+sprintid+'/'+Scope_Level);
  }
  public getappLevelSpPlanResultFromSaveLocation(id: string,epic: string,sprint:string,Scope_Level:string): any {
    var sprintid;
    console.log(sprint)
    if(sprint === ''|| sprint === null){
        sprintid='x'
    }else{
      sprintid = sprint
    }
    return this.http.get(this.baseUrl + '/appLevelSpPlanResultFromSavedLocation/' + id+'/'+epic+'/'+sprintid+'/'+Scope_Level);
  }
  putappLevelSpPlanResult(obj:any):Observable<TrnPlanApplnLevel[]> {
    return this.http.put<TrnPlanApplnLevel[]>(this.baseUrl+"/putappLevelSpPlanResult",obj)
  }
  
  Baseline(obj:any):Observable<TrnPlanApplnLevel[]> {
    return this.http.put<TrnPlanApplnLevel[]>(this.baseUrl+"/appLevelTSPBaseline",obj)
  }
  saveappLevelSpPlanResult(obj:any):Observable<TrnPlanApplnLevel[]> {
    return this.http.post<TrnPlanApplnLevel[]>(this.baseUrl+"/saveappLevelSpPlanResult",obj)
  }
  getSprintstatus():any{
    return this.http.get(this.baseUrl+"/getSprintstatus")
  }
  public TranSchExpPPT(Username: string, Integration_ID: string, TransitionAccName:string): any {
    return this.http.get(this.baseUrl + '/TranSchExpPPT/'+ Username+'/'+Integration_ID+'/'+TransitionAccName);
  }

  public TranSchExpProgressPPT(Username: string, Integration_ID: string, TransitionAccName:string): any {
    return this.http.get(this.baseUrl + '/TranSchExpProgressPPT/'+ Username+'/'+Integration_ID+'/'+TransitionAccName);
  }

  getEmployeeDirectory(obj: string): any {
    
        const newParam = 'USERNAME=' + obj;
           return this.http.get(this.baseUrl + '/getEmployeeDirectory?' + newParam );
    
      }

      public getScopeLvels():any{
        return this.http.get(this.baseUrl+'/getScopeLvels/');
      }

      //Complate Transition Report
public getTransProgramDash(UserNm: string, IntegrationID:string, TransitionAccName:string): any {
  return this.http.get(this.baseUrl + '/TransProgramDashExport/'+ UserNm+'/'+IntegrationID+'/'+TransitionAccName );
}

//document
public OTPDocReport(UserNm: string, IntegrationID:string, TransitionAccName:string): any {
  return this.http.get(this.baseUrl + '/OTPDocExport/'+ UserNm+'/'+IntegrationID+'/'+TransitionAccName );  
}

//Owning Org Level WSR PPT
public OrgWSRReport(UserNm: string,result:string): any {
  return this.http.get(this.baseUrl + '/OrgWSRExport/'+ UserNm +'/'+ result );  
}

}
