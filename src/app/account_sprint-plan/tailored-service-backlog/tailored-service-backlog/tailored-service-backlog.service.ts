import { twbsSerBlog } from './../class/twbs.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TailoredServiceBacklogService {  
  private baseUrl = environment.baseUrl;
  constructor(private http : HttpClient) { }

  public profileStartandEndDate(IntegrationID: string):any{
    return this.http.get(this.baseUrl+'/profileStartandEndDate/'+IntegrationID)
  }


  getTailoredSBforAccount(phase:string,IntegrationID:string):Observable<twbsSerBlog[]> {
    return this.http.get<twbsSerBlog[]>(this.baseUrl+"/TailoredSBforAccount/"+phase+"/"+IntegrationID)
  }

  putTailoredWBSSB(obj:any):Observable<twbsSerBlog[]> {
    return this.http.put<twbsSerBlog[]>(this.baseUrl+"/putTailoredSB",obj)
  }
  putTailoredSBBaseline(obj:any):Observable<twbsSerBlog[]> {
    return this.http.put<twbsSerBlog[]>(this.baseUrl+"/putTailoredSBBaseline",obj)
  }

  getSprintstatus():any{
    return this.http.get(this.baseUrl+"/getSprintstatus")
  }


  getEmployeeDirectory(obj: string): any {
    
        const newParam = 'USERNAME=' + obj;
           return this.http.get(this.baseUrl + '/getEmployeeDirectory?' + newParam );
    
      }

}
