import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from "Vo/role";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class RoleService {


  AdminbaseUrl = environment.AdminbaseUrl;

  private _getRoleListURL = this.AdminbaseUrl+"/tnt/roles/";
  private _createRoleURL = this.AdminbaseUrl+"/tnt/role/";
  private _updateRoleURL = this.AdminbaseUrl+"/tnt/role/";
  private _deleteRoleURL = this.AdminbaseUrl+"/tnt/role/";
  private _getRoleDataURL = this.AdminbaseUrl+"/tnt/role/";

  constructor(private http: HttpClient) { }

  getRoleData(role_id): Observable<Role[]> {

    console.log("getRoleData");
    return this.http.get(this._getRoleDataURL+role_id).pipe(
    map((response: Response) => {
      
    console.log("getRoleListData Response");
      if(Array.isArray(response)) {
        return <Role[]>response;
      }
     
    })) ;

  }

  createRole(roleParameter): Observable<Role[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createRole Service ");
    console.log(roleParameter);
    
    return this.http.post(this._createRoleURL , roleParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Role[]>response;
        }
          
    })) ;
  }


  updateRole( role_id, appliactionParameter): Observable<Role[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateRole Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateRoleURL+role_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Role[]>response;
        }
          
    })) ;
  }


  deleteRole( role_id): Observable<Role[]>{



    console.log("deleteRole Service ");
    console.log(" role_id "+role_id);


    return this.http.delete(this._deleteRoleURL+role_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Role[]>response;
        }
          
    })) ;
  }


  getRoleList(): Observable<Role[]>{



    console.log("getRoleList Service ");
    
    return this.http.get(this._getRoleListURL).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Role[]>response;
        }
          
    })) ;
  }

}