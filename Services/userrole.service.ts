import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { UserRole } from "Vo/userRole";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class UserRoleService {
  AdminbaseUrl = environment.AdminbaseUrl;

  private _getUserRoleListURL = this.AdminbaseUrl+"/tnt/userRoles/";
  private _createUserRoleURL = this.AdminbaseUrl+"/tnt/userRole/";
  private _updateUserRoleURL = this.AdminbaseUrl+"/tnt/userRole/";
  private _deleteUserRoleURL = this.AdminbaseUrl+"/tnt/userRole/";
  private _getUserRoleDataURL = this.AdminbaseUrl+"/tnt/userRole/";
  private _getAssignedUserRoleListURL = this.AdminbaseUrl+"/tnt/userRoleList/";
  private _getAssignedAndNotAssignedUserRoleList = this.AdminbaseUrl+"/tnt/userRoleAddList/";
  private _addUserRoleURL = this.AdminbaseUrl+"/tnt/userRoleAdd/";

  

  constructor(private http: HttpClient) { }

  getUserRoleData(userRole_id): Observable<UserRole[]> {

    console.log("getUserRoleData");
    return this.http.get(this._getUserRoleDataURL+userRole_id).pipe(
    map((response: Response) => {
      
    console.log("getUserRoleListData Response");
      if(Array.isArray(response)) {
        return <UserRole[]>response;
      }
     
    })) ;

  }

  createUserRole(userRoleParameter): Observable<UserRole[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createUserRole Service ");
    console.log(userRoleParameter);
    
    return this.http.post(this._createUserRoleURL , userRoleParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <UserRole[]>response;
        }
          
    })) ;
  }


  updateUserRole( userRole_id, appliactionParameter): Observable<UserRole[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateUserRole Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateUserRoleURL+userRole_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <UserRole[]>response;
        }
          
    })) ;
  }


  deleteUserRole( userRole_id): Observable<UserRole[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("deleteUserRole Service ");
    console.log(" userRole_id "+userRole_id);

    let appliactionParameter ="{}";

    return this.http.delete(this._deleteUserRoleURL+userRole_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <UserRole[]>response;
        }
          
    })) ;
  }


  getAssignedUserRoleList(userId): Observable<UserRole[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("getUserRoleList Service ");
    
    return this.http.get(this._getAssignedUserRoleListURL+userId).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <UserRole[]>response;
        }
          
    })) ;
  }



  
  getAssignedAndNotAssignedUserRoleList(userId): Observable<UserRole[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("getUserRoleList Service ");
    
    return this.http.get(this._getAssignedAndNotAssignedUserRoleList+userId).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <UserRole[]>response;
        }
          
    })) ;
  }

  
  addRoles(userRoleParameter, userId): Observable<UserRole[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("addUserRole Service ");
    console.log(userRoleParameter);
    
    return this.http.post(this._addUserRoleURL+userId , userRoleParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <UserRole[]>response;
        }
          
    })) ;
  }

}