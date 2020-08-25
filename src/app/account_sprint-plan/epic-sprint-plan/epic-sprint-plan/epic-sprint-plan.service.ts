import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EpicSprintPlanService {
  baseUrl = environment.baseUrl
  
    constructor(private http : HttpClient ) { }
    public profileStartandEndDate(IntegrationID: string):any{
      return this.http.get(this.baseUrl+'/profileStartandEndDate/'+IntegrationID)
    }
    getEmployeeDirectory(obj: string): any {
      const newParam = 'USERNAME=' + obj;
         return this.http.get(this.baseUrl + '/getEmployeeDirectory?' + newParam );
    }
    public sprintSave(obj:any):any{    
      return this.http.post(this.baseUrl+'/sprintSave',obj)  
    }
    public getSingleEpicsName(obj:string,epicUNID:string):any{
      return  this.http.get(this.baseUrl+'/getSingleEpicsName/'+obj+'/'+epicUNID);
    } 
    public getSprint(obj:string):any{
      return  this.http.get(this.baseUrl+'/getSprint/'+obj);
    } 
    public getEpicsName(obj:string):any{
      return  this.http.get(this.baseUrl+'/getEpicsName/'+obj);
    } 
    public updateSprint(obj:any):any{
      return this.http.put(this.baseUrl+'/updateSprint',obj)
    }

    public sprintDelete(obj:string,scopelevel : string):any{
      return this.http.delete(this.baseUrl+'/sprintDelete/'+obj+'/'+scopelevel )
    }
    public sprintBaseline(obj:any):any{
      // console.log(obj)
      return this.http.put(this.baseUrl+'/sprintBaseline',obj)
    }

    public getScopeLvels():any{
      return this.http.get(this.baseUrl+'/getScopeLvels/');
    }
}
