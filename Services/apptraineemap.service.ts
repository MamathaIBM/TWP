import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from "Vo/role";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Application } from 'Vo/application';
import { AppTraineeMap } from 'Vo/apptraineemap';
import { AppTraineeMapTracker } from 'Vo/apptraineemaptracker';

@Injectable({
  providedIn: 'root'
})


export class ApptraineemapService {


  AdminbaseUrl = environment.AdminbaseUrl;


  private _saveAppTraineeMapURL = this.AdminbaseUrl+"/tnt/appVsTraineeMapInsertUpdateSave/";
  private _uploadAppTraineeMapURL = this.AdminbaseUrl+"/tnt/appVsTraineeMapInsertUpdateUpload/";
  private _getAppTraineeMapTrackingListURL = this.AdminbaseUrl+"/tnt/getAppTraineeMapTracker/";

  private _deleteAppTraineeMapURL = this.AdminbaseUrl+"/tnt/deleteAppTraineeMapTracker/";



  constructor(private http: HttpClient) { }

  saveAppTraineeMap(appTraineeMapParameter): Observable<AppTraineeMap[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("upload app trainee Service ");
    
    
    return this.http.post(this._saveAppTraineeMapURL , appTraineeMapParameter, httpOptions).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <AppTraineeMap[]>response;
            }

          })) ;
  }


  uploadAppTraineeMap(appTraineeMapParameter): Observable<AppTraineeMap[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("upload app trainee Service ");
    
    
    return this.http.post(this._uploadAppTraineeMapURL , appTraineeMapParameter, httpOptions).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <AppTraineeMap[]>response;
            }

          })) ;
  }


  getAppTraineeMapTrackingList(transition_id, appIds, traineeIds): Observable<AppTraineeMapTracker[]>{

    console.log("getAppTraineeMapTrackingList Service ");
    
    return this.http.get(this._getAppTraineeMapTrackingListURL+transition_id+"/"+appIds+"/"+traineeIds).pipe(

      map((response: Response) => {
        if(Array.isArray(response)) {
               return <AppTraineeMapTracker[]>response;
        }
          
    })) ;
  }



  deleteAppTraineeMap( appTraineeMapId): Observable<AppTraineeMap[]>{
    return this.http.delete(this._deleteAppTraineeMapURL+appTraineeMapId ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <AppTraineeMap[]>response;
        }
          
    })) ;
  }


}