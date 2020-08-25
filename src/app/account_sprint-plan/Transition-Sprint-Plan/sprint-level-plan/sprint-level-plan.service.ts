import { sprintLevelPlan } from './../class/sprintLevelPlan.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SprintLevelPlanService {
  private baseUrl = environment.baseUrl;
  constructor(private http : HttpClient) { }
  
  public profileStartandEndDate(IntegrationID: string):any{
    return this.http.get(this.baseUrl+'/profileStartandEndDate/'+IntegrationID)
  }
  getTailoredSBforAccount(phase:string,IntegrationID:string,params :string,Scope_Level:string):Observable<sprintLevelPlan[]> {    
    // const params = "0/0/0"
    return this.http.get<sprintLevelPlan[]>(this.baseUrl+"/TailoredSLPPforAccount/"+phase+"/"+IntegrationID+"/"+params+"/"+Scope_Level)
  }
  
  getTailoredSLPPforSavedAccount(IntegrationID:string,params :string):Observable<sprintLevelPlan[]> {    
    // const params = "0/0/0"
    return this.http.get<sprintLevelPlan[]>(this.baseUrl+"/TailoredSLPPforSavedAccount/"+IntegrationID+"/"+params)
  }

  putTailoredWBSSB(obj:any):Observable<sprintLevelPlan[]> {
    return this.http.put<sprintLevelPlan[]>(this.baseUrl+"/sprintExecutionPlanUpdate",obj)
  }
  postTailoredWBSSB(obj:any):Observable<sprintLevelPlan[]> {
    return this.http.post<sprintLevelPlan[]>(this.baseUrl+"/sprintExecutionPlanSave",obj)
  }
  
  public service_rollupGet(IntegrationID:string,paramsFlag :number):any{
    return this.http.get(this.baseUrl+'/rollupGet/'+IntegrationID+"/"+paramsFlag )
  }

  public service_rollupAdd(obj :any ):any{   
    console.log(obj)    
    
    return this.http.post(this.baseUrl+ '/rollupAdd',obj)
  }

  public service_rollupUpdate(obj : any):any{  
    return this.http.put(this.baseUrl+'/rollupUpdate',obj )
  }


  putTailoredSBBaseline(obj:any):Observable<sprintLevelPlan[]> {
    return this.http.put<sprintLevelPlan[]>(this.baseUrl+"/putSLPBaseline",obj)
  }
  public getEpicsName(obj:string):any{
    return  this.http.get(this.baseUrl+'/getEpicsName/'+obj);
  }
  getSprintstatus():any{
    return this.http.get(this.baseUrl+"/getSprintstatus")
  }
  
  getaccountExistCheck(IntegrationID:string,epic: string,sprintid:string,AppUNID:string):any{
    // var sprintid;
    // sprintid = 0
    // if(sprint !== '0'){
    //     sprintid = sprint
    // }
    return this.http.get(this.baseUrl+'/sprintExecutionPlanAccountExistCheck/'+IntegrationID+'/'+epic+'/'+sprintid+'/'+AppUNID)
  }  
  public getSprintNamesData(ID:string,epic:string,Scope_Level:string):any{
    
    return  this.http.get(this.baseUrl+'/getSprintNames/'+ID+"/"+epic+"/"+Scope_Level);
  }
 
  public getSprintApplication(sprintUNID: string,Scope_IntegrationID: string):any{
      return this.http.get(this.baseUrl+'/getSprintApplication/'+Scope_IntegrationID+'/'+sprintUNID)
  }

  public getSprintSTScope(sprintUNID: string,Scope_IntegrationID: string):any{
    return this.http.get(this.baseUrl+'/getSprintSTScope/'+Scope_IntegrationID+'/'+sprintUNID)
}
 
  public getappLevelSpPlanResultFromSaveLocation(id: string,epic: string,sprint:string): any {
    var sprintid;
    console.log(sprint)
    if(sprint === ''|| sprint === null){
        sprintid='x'
    }else{
      sprintid = sprint
    }
    console.log(this.baseUrl + '/appLevelSpPlanResultFromSavedLocation/' + id+'/'+epic+'/'+sprintid)
    return this.http.get(this.baseUrl + '/appLevelSpPlanResultFromSavedLocation/' + id+'/'+epic+'/'+sprintid);
  }
  getSprintkeywords(epic:string,  IntegrationID:string):any{
    return this.http.get(this.baseUrl+"/raidSprintData"+"/"+epic+"/"+IntegrationID)
  }

  getEmployeeDirectory(obj: string): any {
    
        const newParam = 'USERNAME=' + obj;
           return this.http.get(this.baseUrl + '/getEmployeeDirectory?' + newParam );
    
      }

      public getScopeLvels():any{
        return this.http.get(this.baseUrl+'/getScopeTaskLvels/');
      }
}
