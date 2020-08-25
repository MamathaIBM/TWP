import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoleFunctionality } from "Vo/roleFunctionality";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { StandardActivity } from 'Vo/standardactivity';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class StandardActivityService {
  AdminbaseUrl = environment.AdminbaseUrl;

  private _getStandardActivityListURL = this.AdminbaseUrl+"/tnt/standardActivities/";
  private _createStandardActivityURL = this.AdminbaseUrl+"/tnt/createStandardActivity/";
  private _getStandardActivityDataURL = this.AdminbaseUrl+"/tnt/standardActivityData/";
  private _updateStandardActivityURL = this.AdminbaseUrl+"/tnt/updateStandardActivity/";
  private _deleteStandardActivityURL = this.AdminbaseUrl+"/tnt/deleteStandardActivity/";
  private _uploadStandardActivityURL = this.AdminbaseUrl+"/tnt/uploadStandardActivity/";

  

  constructor(private http: HttpClient) { }


  uploadStandardActivity(standardActivityParameter,phase): Observable<StandardActivity[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log("standard activity Service ");
    
    
    return this.http.post(this._uploadStandardActivityURL+phase , standardActivityParameter, httpOptions).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <StandardActivity[]>response;
            }

          })) ;
  }


  getStandardActivityList(phase): Observable<StandardActivity[]>{


    console.log("standard activity Service ");
    
    
    return this.http.get(this._getStandardActivityListURL+phase).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <StandardActivity[]>response;
            }

          })) ;
  }

  getStandardActivityData(standardActivityId): Observable<StandardActivity[]> {

    console.log("getStandardActivityData");
    return this.http.get(this._getStandardActivityDataURL+standardActivityId).pipe(
    map((response: Response) => {
      
    console.log("getStandardActivityData Response");
          if(Array.isArray(response)) {
            return <StandardActivity[]>response;
          }     
    })) ;
  } 

  updateStandardActivity(standardActivityId, standardActivityParameter): Observable<StandardActivity[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log("updateStandardActivity ");
    
    return this.http.put(this._updateStandardActivityURL+standardActivityId , standardActivityParameter, httpOptions).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <StandardActivity[]>response;
            }

          })) ;
  }

  createStandardActivity(standardActivityId, standardActivityParameter): Observable<StandardActivity[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log("createStandardActivity ");
    
    return this.http.put(this._createStandardActivityURL+standardActivityId , standardActivityParameter, httpOptions).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <StandardActivity[]>response;
            }

          })) ;
  }


  deleteActivities(activityParameter): Observable<RoleFunctionality[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log(activityParameter);
    
    return this.http.post(this._deleteStandardActivityURL , activityParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <RoleFunctionality[]>response;
        }
          
    })) ;
  }

}