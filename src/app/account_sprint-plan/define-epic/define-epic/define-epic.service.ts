import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DefineEpicService {
  baseUrl = environment.baseUrl
  
    constructor(private http : HttpClient ) { }
    
    public profileStartandEndDate(IntegrationID: string):any{
      return this.http.get(this.baseUrl+'/profileStartandEndDate/'+IntegrationID)
    }
    getEmployeeDirectory(obj: string): any {
      const newParam = 'USERNAME=' + obj;
         return this.http.get(this.baseUrl + '/getEmployeeDirectory?' + newParam );
    }
    public epicSave(obj:any):any{    
      return this.http.post(this.baseUrl+'/epicSave',obj)  
    }
    
    public getEpics(obj:string):any{
      return  this.http.get(this.baseUrl+'/getEpics/'+obj);
    } 
  
    public updateEpic(obj:any):any{
      return this.http.put(this.baseUrl+'/updateEpic',obj)
    }

    public epicDelete(obj:string):any{
      return this.http.delete(this.baseUrl+'/epicDelete/'+obj)
    }
    public epicBaseline(obj:any):any{
      // console.log(obj)
      return this.http.put(this.baseUrl+'/epicBaseline',obj)
    }
	public exportEpicAsPPT(Username: string, Integration_ID: string, TransitionAccName:string): any {
      return this.http.get(this.baseUrl + '/ExportEpicPPT/'+ Username+'/'+Integration_ID+'/'+TransitionAccName);
    }
}
