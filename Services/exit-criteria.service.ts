import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoleFunctionality } from "Vo/roleFunctionality";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { ExitCriteria } from 'Vo/exitcriteria';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})


export class ExitCrieriaService {


  AdminbaseUrl = environment.AdminbaseUrl;

  
  private _getExitCriteriaListURL = this.AdminbaseUrl+"/tnt/exitCriterias/";
  private _createExitCriteriaURL = this.AdminbaseUrl+"/tnt/exitCriteria/";
  private _uploadExitCriteriaURL = this.AdminbaseUrl+"/tnt/uploadExitCriteria/";
  private _updateExitCriteriaURL = this.AdminbaseUrl+"/tnt/updateExitCriteria/";
  private _getExitCriteriaDataURL = this.AdminbaseUrl+"/tnt/exitCriteriaData/";
  private _deleteExitCriteriaURL = this.AdminbaseUrl+"/tnt/deleteExitCriteria/";

  

  constructor(private http: HttpClient) { }

  createExitCriteria(exitCriteriaParameter): Observable<ExitCriteria[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log(" Exit Criteria Service ");
    
    
    return this.http.post(this._createExitCriteriaURL , exitCriteriaParameter, httpOptions).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <ExitCriteria[]>response;
            }

          })) ;
  }

  

  getExitCriteriaList(phase): Observable<ExitCriteria[]>{


    console.log("standard activity Service ");
    
    
    return this.http.get(this._getExitCriteriaListURL+phase).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <ExitCriteria[]>response;
            }

          })) ;
  }


  getExitCriteriaData(exitCriteriaId): Observable<ExitCriteria[]> {

    console.log("getExitCriteria");
    return this.http.get(this._getExitCriteriaDataURL+exitCriteriaId).pipe(
    map((response: Response) => {
      
    console.log("ExitCriteria Response");
          if(Array.isArray(response)) {
            return <ExitCriteria[]>response;
          }     
    })) ;
  } 

  updateExitCriteria(exitCriteriaId, exitCriteriaParameter): Observable<ExitCriteria[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log("updateExitActivity ");
    
    return this.http.put(this._updateExitCriteriaURL+exitCriteriaId , exitCriteriaParameter, httpOptions).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <ExitCriteria[]>response;
            }

          })) ;
  }

  uploadExitCriteria(exitCriteriaParameter,phase): Observable<ExitCriteria[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log("uploadExitActivity ");
    
    return this.http.post(this._uploadExitCriteriaURL+phase , exitCriteriaParameter, httpOptions).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <ExitCriteria[]>response;
            }

          })) ;
  }

  deleteExitCriteria(exitCriteriaParameter): Observable<ExitCriteria[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log(exitCriteriaParameter);
    
    return this.http.post(this._deleteExitCriteriaURL , exitCriteriaParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ExitCriteria[]>response;
        }
          
    })) ;
  }

}