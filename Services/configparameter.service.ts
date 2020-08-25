import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigParameter } from "Vo/ConfigParameter";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ConfigParameterService {


  AdminbaseUrl = environment.AdminbaseUrl;

  private _getConfigParameterListURL = this.AdminbaseUrl+"/tnt/ConfigParameters/";
  private _getConfigParameterValuesURL = this.AdminbaseUrl+"/tnt/ConfigParameterValues/";
  private _createConfigParameterValuesURL = this.AdminbaseUrl+"/tnt/createConfigParameter/";
  private _updateConfigParameterURL = this.AdminbaseUrl+"/tnt/updateConfigParameter/";
  private _deleteConfigParameterURL = this.AdminbaseUrl+"/tnt/deleteConfigParameter/";
  private _deleteConfigParameterValueURL = this.AdminbaseUrl+"/tnt/deleteConfigParameterValue/";
  private _getConfigParameterDataURL = this.AdminbaseUrl+"/tnt/ConfigParameter/";
  private _logConfigValueURL = this.AdminbaseUrl+"/tnt/logTrace/";

  

  constructor(private http: HttpClient) { }

  getConfigParameterData(ConfigParameter_id): Observable<ConfigParameter[]> {

    console.log("getConfigParameterData");
    return this.http.get(this._getConfigParameterDataURL+ConfigParameter_id).pipe(
    map((response: Response) => {
      
    console.log("getConfigParameterListData Response");
      if(Array.isArray(response)) {
        return <ConfigParameter[]>response;
      }
     
    })) ;

  }



  createConfigParameterValues(ConfigParameterParameter): Observable<ConfigParameter[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createConfigParameter Service ");
    console.log(ConfigParameterParameter);
    
    return this.http.post(this._createConfigParameterValuesURL , ConfigParameterParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ConfigParameter[]>response;
        }
          
    })) ;
  }

  

  saveLogConfig(ConfigParameterParameter): Observable<any[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createConfigParameter Service ");
    console.log(ConfigParameterParameter);
    
    return this.http.post(this._logConfigValueURL , ConfigParameterParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <any[]>response;
        }
          
    })) ;
  }  


  updateConfigParameterValue( ConfigParameter_id, appliactionParameter): Observable<ConfigParameter[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateConfigParameter Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateConfigParameterURL+ConfigParameter_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ConfigParameter[]>response;
        }
          
    })) ;
  }


  deleteConfigParameter( ConfigParameter_id): Observable<ConfigParameter[]>{



    console.log("deleteConfigParameter Service ");
    console.log(" ConfigParameter_id "+ConfigParameter_id);


    return this.http.delete(this._deleteConfigParameterURL+ConfigParameter_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ConfigParameter[]>response;
        }
          
    })) ;
  }


  deleteConfigParameterValue( ConfigParameter_id): Observable<ConfigParameter[]>{



    console.log("deleteConfigParameterV Service ");
    console.log(" ConfigParameter_id "+ConfigParameter_id);


    return this.http.delete(this._deleteConfigParameterValueURL+ConfigParameter_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ConfigParameter[]>response;
        }
          
    })) ;
  }

  getConfigParameterList(): Observable<ConfigParameter[]>{



    console.log("getConfigParameterList Service ");
    
    return this.http.get(this._getConfigParameterListURL).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ConfigParameter[]>response;
        }
          
    })) ;
  }

  getConfigParameterValues(parameter): Observable<ConfigParameter[]>{

    console.log("getConfigParameterValues Service ");
    
    return this.http.get(this._getConfigParameterValuesURL+parameter).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ConfigParameter[]>response;
        }
          
    })) ;
  }





}