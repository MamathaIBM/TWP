import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from "Vo/user";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class UserService {

  AdminbaseUrl = environment.AdminbaseUrl;

  private _getUserListURL = this.AdminbaseUrl+"/tnt/users/";
  private _getUserTransitionOrgsURL = this.AdminbaseUrl+"/tnt/userTransitionOrgs/";
  private _createUserURL = this.AdminbaseUrl+"/tnt/user/";
  private _updateUserURL = this.AdminbaseUrl+"/tnt/user/";
  private _deleteUserURL = this.AdminbaseUrl+"/tnt/user/";
  private _getUserDataURL = this.AdminbaseUrl+"/tnt/user/";
  private _getUserAccessDataURL = this.AdminbaseUrl+"/tnt/userAccessData/";
  private _getUserSearchURL = this.AdminbaseUrl+"/tnt/userSearch/";

  constructor(private http: HttpClient) { }

  getUserData(user_id): Observable<User[]> {

    console.log("getUserData");
    return this.http.get(this._getUserDataURL+user_id).pipe(
    map((response: Response) => {
      
    console.log("getUserListData Response");
      if(Array.isArray(response)) {
        return <User[]>response;
      }
     
    })) ;

  }

  getUserAccessData(userEmail): Observable<User[]> {


    // alert("userEmail "+userEmail);

    console.log("getUserAccessData");
    return this.http.get(this._getUserAccessDataURL+userEmail).pipe(
    map((response: Response) => {
      
      // alert("User Data Response");
    console.log("getUserListData Response");
      if(Array.isArray(response)) {
        return <User[]>response;
      }
     
    })) ;

  }  

  createUser( userParameter): Observable<User[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createUser Service ");
    console.log(userParameter);
    
    return this.http.post(this._createUserURL , userParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <User[]>response;
        }
          
    })) ;
  }


  updateUser( user_id, appliactionParameter): Observable<User[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateUser Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateUserURL+user_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <User[]>response;
        }
          
    })) ;
  }


  deleteUser( user_id): Observable<User[]>{



    console.log("deleteUser Service ");
    console.log(" user_id "+user_id);

  

    return this.http.delete(this._deleteUserURL+user_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <User[]>response;
        }          
    })) ;
  }
  
  
  getUserList():any{
    return this.http.get(this._getUserListURL)
  }

  getUserTransitionOrgs(user_id):any{
    return this.http.get(this._getUserTransitionOrgsURL+user_id)
  }

  getUserSearchList(userName): Observable<User[]> {
    return this.http.get(this._getUserSearchURL+userName).pipe(
    map((response: Response) => {
    console.log("getUserSearchList Response");
      if(Array.isArray(response)) {
        return <User[]>response;
      }
     
    })) ;

  }  

}