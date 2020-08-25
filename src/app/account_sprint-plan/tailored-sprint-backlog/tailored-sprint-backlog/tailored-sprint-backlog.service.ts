import { twbsSprtBlog } from './../class/twbs.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from "@angular/http";
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class TailoredSprintBacklogService {

  private baseUrl = environment.baseUrl;
  constructor(private http : HttpClient) { }
  
  
  public profileStartandEndDate(IntegrationID: string):any{
    return this.http.get(this.baseUrl+'/profileStartandEndDate/'+IntegrationID)
  }
  
  getTailoredSBforAccount(phase:string,IntegrationID:string):Observable<twbsSprtBlog[]> {
    return this.http.get<twbsSprtBlog[]>(this.baseUrl+"/TailoredSBforAccount/"+phase+"/"+IntegrationID)
  }

  putTailoredSpB(obj:any):Observable<twbsSprtBlog[]> {
    return this.http.put<twbsSprtBlog[]>(this.baseUrl+"/putTailoredSpB",obj)
  }
  putTailoredSpBBaseline(obj:any):Observable<twbsSprtBlog[]> {
    return this.http.put<twbsSprtBlog[]>(this.baseUrl+"/putTailoredSpBBaseline",obj)
  }

  getSprintstatus():any{
    return this.http.get(this.baseUrl+"/getSprintstatus")
  }

  getEmployeeDirectory(obj: string): any {
    
        const newParam = 'USERNAME=' + obj;
           return this.http.get(this.baseUrl + '/getEmployeeDirectory?' + newParam );
    
      }
}
