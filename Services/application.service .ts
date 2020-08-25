import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from "Vo/role";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Application } from 'Vo/application';

@Injectable({
  providedIn: 'root'
})


export class ApplicationService {


  AdminbaseUrl = environment.AdminbaseUrl;

  private _getApplicationListURL = this.AdminbaseUrl+"/tnt/applications/";
  private _getApplicationSearchListURL = this.AdminbaseUrl+"/tnt/applicationSearchList/";


  constructor(private http: HttpClient) { }

  getApplicationList(transitionId,resourceTypeMeasured): Observable<Application[]>{

    console.log("getApplicationList Service ");
    
    return this.http.get(this._getApplicationListURL+transitionId+"/"+resourceTypeMeasured).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Application[]>response;
        }
          
    })) ;
  }
  
  getApplicationSearchList(transitionId,appName,mapped, epic, sprint): Observable<Application[]>{

    console.log("getApplicationSearchList Service ");
    console.log("URL "+this._getApplicationSearchListURL+transitionId+"/"+appName+"/"+mapped+"/"+epic+"/"+sprint);
    
    return this.http.get(this._getApplicationSearchListURL+transitionId+"/"+appName+"/"+mapped+"/"+epic+"/"+sprint).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Application[]>response;
        }
          
    })) ;
  }

}