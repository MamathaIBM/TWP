import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RoleFunctionality } from "Vo/roleFunctionality";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class RoleFunctionalityService {


  AdminbaseUrl = environment.AdminbaseUrl;


  private _getRoleFunctionalityListURL = this.AdminbaseUrl+"/tnt/roleFunctionalitys/";
  private _createRoleFunctionalityURL = this.AdminbaseUrl+"/tnt/roleFunctionality/";
  private _updateRoleFunctionalityURL = this.AdminbaseUrl+"/tnt/roleFunctionality/";
  private _deleteRoleFunctionalityURL = this.AdminbaseUrl+"/tnt/roleFunctionality/";
  private _getRoleFunctionalityDataURL = this.AdminbaseUrl+"/tnt/roleFunctionality/";
  private _getAssignedRoleFunctionalityListURL = this.AdminbaseUrl+"/tnt/roleFunctionalityAdded/";
  private _getAssignedAndNotAssignedRoleFunctionalityList = this.AdminbaseUrl+"/tnt/roleFunctionalityAddList/";
  private _addRoleFunctionalityURL = this.AdminbaseUrl+"/tnt/roleFunctionalityAdd/";

  

  constructor(private http: HttpClient) { }

  getRoleFunctionalityData(roleFunctionality_id): Observable<RoleFunctionality[]> {

    console.log("getRoleFunctionalityData");
    return this.http.get(this._getRoleFunctionalityDataURL+roleFunctionality_id).pipe(
    map((response: Response) => {
      
    console.log("getRoleFunctionalityListData Response");
      if(Array.isArray(response)) {
        return <RoleFunctionality[]>response;
      }
     
    })) ;

  }

  createRoleFunctionality(roleFunctionalityParameter): Observable<RoleFunctionality[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createRoleFunctionality Service ");
    console.log(roleFunctionalityParameter);
    
    return this.http.post(this._createRoleFunctionalityURL , roleFunctionalityParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <RoleFunctionality[]>response;
        }
          
    })) ;
  }


  updateRoleFunctionality( roleFunctionality_id, appliactionParameter): Observable<RoleFunctionality[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateRoleFunctionality Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateRoleFunctionalityURL+roleFunctionality_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <RoleFunctionality[]>response;
        }
          
    })) ;
  }


  deleteRoleFunctionality( roleFunctionality_id): Observable<RoleFunctionality[]>{



    console.log("deleteRoleFunctionality Service ");
    console.log(" roleFunctionality_id "+roleFunctionality_id);



    return this.http.delete(this._deleteRoleFunctionalityURL+roleFunctionality_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <RoleFunctionality[]>response;
        }
          
    })) ;
  }


  getAssignedRoleFunctionalityList(roleId): Observable<RoleFunctionality[]>{


    console.log("getRoleFunctionalityList Service ");
    
    return this.http.get(this._getAssignedRoleFunctionalityListURL+roleId).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <RoleFunctionality[]>response;
        }
          
    })) ;
  }



  
  getAssignedAndNotAssignedRoleFunctionalityList(roleId): Observable<RoleFunctionality[]>{



    console.log("getRoleFunctionalityList Service ");
    
    return this.http.get(this._getAssignedAndNotAssignedRoleFunctionalityList+roleId).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <RoleFunctionality[]>response;
        }
          
    })) ;
  }

  
  addFunctionalities(roleFunctionalityParameter, roleId): Observable<RoleFunctionality[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("addRoleFunctionality Service ");
    console.log(roleFunctionalityParameter);
    
    return this.http.post(this._addRoleFunctionalityURL+roleId , roleFunctionalityParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <RoleFunctionality[]>response;
        }
          
    })) ;
  }

}