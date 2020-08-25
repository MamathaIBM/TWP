import { twbs } from './../class/twbs.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from "@angular/http";

import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TailoredWBSService {
  private baseUrl = environment.baseUrl;
  
  constructor(private http : HttpClient) { }
  getTWBSKeywords():any {
    return this.http.get(this.baseUrl+"/TWBSKeywords")
  }
  
  getTailoredWBSSBforAccountSpecific(phase:string,IntegrationID:string):Observable<twbs[]> {
    return this.http.get<twbs[]>(this.baseUrl+"/getTailoredWBSSBforAccountSpecific/"+phase+"/"+IntegrationID)
  }
  getTailoredWBSSB(phase:string,IntegrationID:string):Observable<twbs[]> {
    return this.http.get<twbs[]>(this.baseUrl+"/TailoredWBSSB/"+phase+"/"+IntegrationID)
  }
  
  getTailoredWBSSBForAccount(phase:string,IntegrationID:string):Observable<twbs[]> {
    return this.http.get<twbs[]>(this.baseUrl+"/TailoredWBSSBforAccount/"+phase+"/"+IntegrationID)
  }
  
  postTailoredWBSSB(obj:any):Observable<twbs[]> {
    return this.http.post<twbs[]>(this.baseUrl+"/postTailoredWBSSB",obj)
  }
  postTailoredWBSSBAdd(obj:any):Observable<twbs[]> {
    return this.http.post<twbs[]>(this.baseUrl+"/postTailoredWBSSBAdd",obj)
  }

  putTailoredWBSSB(obj:any):Observable<twbs[]> {
    return this.http.put<twbs[]>(this.baseUrl+"/putTailoredWBSSB",obj)
  }

  

}
