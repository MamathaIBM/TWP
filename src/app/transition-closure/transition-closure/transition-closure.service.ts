import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransitionClosureService {

  private baseUrl = environment.baseUrl;
  constructor(private http : HttpClient) { }
  
  public profileStartandEndDate(IntegrationID: String):any{
    return this.http.get(this.baseUrl+'/profileStartandEndDate/'+IntegrationID)
  }
  getTransCloseforAccount(phase:String,IntegrationID:string): any {
    return this.http.get(this.baseUrl+"/TransCloseforAccount/"+phase+"/"+IntegrationID)
  }

  putTransClose(obj:any): any {
    return this.http.put(this.baseUrl+"/putTransClose",obj)
  }
 putTransCloseBaseline(obj:any): any {
    return this.http.put(this.baseUrl+"/putTransCloseBaseline",obj)
  }
  getTransCloseStatus():any{
    return this.http.get(this.baseUrl+"/getTransCloseStatus")
  }

  getEmployeeDirectory(obj: string): any {    
        const newParam = 'USERNAME=' + obj;
           return this.http.get(this.baseUrl + '/getEmployeeDirectory?' + newParam );    
  }


}
