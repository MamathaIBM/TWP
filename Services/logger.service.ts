import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoleFunctionality } from "Vo/roleFunctionality";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserAccessProfileService } from './user-access-profile.service';
import { Functionality } from 'Vo/functionality';


@Injectable({
  providedIn: 'root'
})


export class LoggerService {

  AdminbaseUrl = environment.AdminbaseUrl;
  userEmail="";

  private _logAccessURL = this.AdminbaseUrl+"/tnt/logAccess/";
  
  constructor(private http: HttpClient,
              private userAccessProfileService: UserAccessProfileService ) { }

  logAccess(destination): Observable<string[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    //alert("Logger Service Getting Called...");
    console.log(" Logger Service Called ");    

    this.userEmail = this.userAccessProfileService.getUserEmail();
    var funcName ="";

    //alert("this.userAccessProfileService.getUserEmail() "+this.userEmail);
    var functionality = this.userAccessProfileService.getFunctionality(destination);
    if (functionality != null)
       funcName = functionality.functionalityName;

    let accessInfo = 
    '{ "USER_NAME": "'+ this.userAccessProfileService.getUserName()+'" '+
    ', "USER_ID": "'+ this.userAccessProfileService.getUserId()+'" '+ 
    ', "USER_EMAIL": "'+ this.userEmail+'" '+ 
    ', "ROUTER_LINK":"'+ destination+'" '+
    ', "FUNC_NAME":"'+funcName +'" '+
     '}' ;


     //alert("accessInfo "+accessInfo);
     console.log("accessInfo   "+accessInfo);


    return this.http.post(this._logAccessURL , accessInfo, httpOptions).pipe(
          map((response: Response) => {      
            if(Array.isArray(response)) {
                    return <string[]>response;
            }
          })) ;
   }

  


}