import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Functionality } from "Vo/functionality";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class FunctionalityService {

  AdminbaseUrl = environment.AdminbaseUrl;

  private _getFunctionalityListURL = this.AdminbaseUrl+"/tnt/functionalitys/";
  private _createFunctionalityURL = this.AdminbaseUrl+"/tnt/functionality/";
  private _updateFunctionalityURL = this.AdminbaseUrl+"/tnt/functionality/";
  private _deleteFunctionalityURL = this.AdminbaseUrl+"/tnt/functionality/";
  private _getFunctionalityDataURL = this.AdminbaseUrl+"/tnt/functionality/";
  private _uploadStandardActivityURL = this.AdminbaseUrl+"/tnt/uploadFunctionality/";
  private _getFunctionalitySearchURL = this.AdminbaseUrl+"/tnt/functionalitySearch/";

  constructor(private http: HttpClient) { }



  uploadFunctionalities(functionalityParameter): Observable<Functionality[]>{

    const httpOptions = {
           headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    console.log("upload functionality Service ");
    
    
    return this.http.post(this._uploadStandardActivityURL , functionalityParameter, httpOptions).pipe(
          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <Functionality[]>response;
            }

          })) ;
  }


  getFunctionalityData(functionality_id): Observable<Functionality[]> {

    console.log("getFunctionalityData");
    return this.http.get(this._getFunctionalityDataURL+functionality_id).pipe(
    map((response: Response) => {
      
    console.log("getFunctionalityListData Response");
      if(Array.isArray(response)) {
        return <Functionality[]>response;
      }
     
    })) ;

  }

  createFunctionality(functionalityParameter): Observable<Functionality[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createFunctionality Service ");
    console.log(functionalityParameter);
    
    return this.http.post(this._createFunctionalityURL , functionalityParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Functionality[]>response;
        }
          
    })) ;
  }


  updateFunctionality( functionality_id, appliactionParameter): Observable<Functionality[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateFunctionality Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateFunctionalityURL+functionality_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Functionality[]>response;
        }
          
    })) ;
  }


  deleteFunctionality( functionality_id): Observable<Functionality[]>{



    console.log("deleteFunctionality Service ");
    console.log(" functionality_id "+functionality_id);



    return this.http.delete(this._deleteFunctionalityURL+functionality_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Functionality[]>response;
        }
          
    })) ;
  }


  getFunctionalityList(): Observable<Functionality[]>{



    console.log("getFunctionalityList Service ");
    
    return this.http.get(this._getFunctionalityListURL).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Functionality[]>response;
        }
          
    })) ;
  }

  getFunctionalitySearchList(functionalityName): Observable<Functionality[]> {
    return this.http.get(this._getFunctionalitySearchURL+functionalityName).pipe(
    map((response: Response) => {
    console.log("getFunctionalitySearchList Response");
      if(Array.isArray(response)) {
        return <Functionality[]>response;
      }
     
    })) ;

  }  

}