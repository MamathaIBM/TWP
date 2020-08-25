import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transition } from "Vo/transition";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class TransitionService {

  AdminbaseUrl = environment.AdminbaseUrl;

  private _getTransitionsURL = this.AdminbaseUrl+"/tnt/transitions";
  private _updateTransitionURL = this.AdminbaseUrl+"/tnt/transitions";
  private _createTransitionURL = this.AdminbaseUrl+"/tnt/transition";

  constructor(private http: HttpClient) { }

  getTransitionList(user_id): Observable<Transition[]> {

    console.log("getTransitionList");

  
    return this.http.get(this._getTransitionsURL+"/"+user_id).pipe(
    map((response: Response) => {

      
    console.log("getTransitionList Response");
      if(Array.isArray(response)) {
        return <Transition[]>response;
      }
        //return <Transition[]>response.json().catch(this.handleError);
    })) ;

  }

  updateTransition( tran_id, transitionParameter): Observable<Transition[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    
    return this.http.put(this._updateTransitionURL+"/"+tran_id , transitionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Transition[]>response;
        }
          //return <Transition[]>response.json().catch(this.handleError);
    })) ;

  }

  createTransition( transitionParameter): Observable<Transition[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createTransition Service ");
    console.log(transitionParameter);
    
    return this.http.post(this._createTransitionURL , transitionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Transition[]>response;
        }
          
    })) ;
  }


}
