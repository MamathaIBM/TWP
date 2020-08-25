import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Parameter } from "Vo/parameter";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ParameterService {


  AdminbaseUrl = environment.AdminbaseUrl;
  baseURL = environment.baseUrl 

  private _getParameterGlobalListURL = this.AdminbaseUrl+"/tnt/parameterGlobalList/";  
  private _getParameterCustomListURL = this.AdminbaseUrl+"/tnt/parameterCustomList/"; 
  private _getParameterCustomListForTrackingURL = this.AdminbaseUrl+"/tnt/parameterCustomListForTracking/"; 
  private _createParameterURL = this.AdminbaseUrl+"/tnt/parameterCreate/";
  private _createParameterCustomURL = this.AdminbaseUrl+"/tnt/parameterCreateCustom/";
  private _appendParameterCustomURL = this.AdminbaseUrl+"/tnt/parameterAppendCustom/";  
  private _updateParameterURL = this.AdminbaseUrl+"/tnt/parameterEdit/";
  private _updateParameterCustomURL = this.AdminbaseUrl+"/tnt/parameterEditCustom/";
  private _deleteParameterURL = this.AdminbaseUrl+"/tnt/parameterDelete/";
  private _deleteParameterCustomURL = this.AdminbaseUrl+"/tnt/parameterDeleteCustom/";
  private _getParameterDataURL = this.AdminbaseUrl+"/tnt/parameterData/";
  private _getParameterDataCustomURL = this.AdminbaseUrl+"/tnt/parameterDataCustom/";

  constructor(private http: HttpClient) { }

  getParameterData(parameter_id): Observable<Parameter[]> {

    console.log("getParameterData");
    return this.http.get(this._getParameterDataURL+parameter_id).pipe(
    map((response: Response) => {
      
      if(Array.isArray(response)) {
        return <Parameter[]>response;
      }
     
    })) ;

  }

  getParameterDataCustom(parameter_id): Observable<Parameter[]> {

    console.log("getParameterData");
    return this.http.get(this._getParameterDataCustomURL+parameter_id).pipe(
    map((response: Response) => {
      
      if(Array.isArray(response)) {
        return <Parameter[]>response;
      }
     
    })) ;
  }

  createParameter(parameterParameter): Observable<Parameter[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createParameter Service ");
    console.log(parameterParameter);
    
    return this.http.post(this._createParameterURL , parameterParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }


  createParameterCustom(globalParameterList, transitionId): Observable<Parameter[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createParameterCustom Service ");
    console.log(globalParameterList);
    
    return this.http.post(this._createParameterCustomURL+transitionId , globalParameterList, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }

  appendParameterCustom(customParameterList, transitionId): Observable<Parameter[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("appendParameterCustom Service ");
    console.log(customParameterList);
    
    return this.http.post(this._appendParameterCustomURL+transitionId , customParameterList, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }
  
  

  updateParameter( parameter_id, appliactionParameter): Observable<Parameter[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateParameter Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateParameterURL+parameter_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }


  updateParameterCustom( parameter_id, appliactionParameter): Observable<Parameter[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateParameter Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateParameterCustomURL+parameter_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }


  deleteParameter( parameter_id): Observable<Parameter[]>{



    console.log("deleteParameter Service ");
    console.log(" parameter_id "+parameter_id);

 

    return this.http.delete(this._deleteParameterURL+parameter_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }


  deleteParameterCustom( parameter_id): Observable<Parameter[]>{



    console.log("deleteParameter Service ");
    console.log(" parameter_id "+parameter_id);



    return this.http.delete(this._deleteParameterCustomURL+parameter_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }


  getParameterGlobalList(): Observable<Parameter[]>{



    console.log("getParameterList Service ");
    
    return this.http.get(this._getParameterGlobalListURL).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }

  getParameterCustomList(transitionId): Observable<Parameter[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("getParameterCustomList Service ");
    
    return this.http.get(this._getParameterCustomListURL+transitionId).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }

  getParameterCustomListForTracking(transitionId): Observable<Parameter[]>{



    console.log("getParameterCustomListForTracking Service ");
    
    return this.http.get(this._getParameterCustomListForTrackingURL+transitionId).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Parameter[]>response;
        }
          
    })) ;
  }

  getExcelHealthReadiness(obj: string, username: string): any {
    const newParam = 'IntigrationID=' + obj+'/Username='+username;
    return this.http.get(this.baseURL + '/getExcelHealthReadiness/' + newParam );
  }

  

  getExcelHealthReadinessTracker(obj: string, username:string): any {
    const newParam = 'IntigrationID=' + obj+'/'+username;
  
    return this.http.get(this.AdminbaseUrl + '/getExcelHealthReadinessTracker/' + newParam );
  } 



  


}