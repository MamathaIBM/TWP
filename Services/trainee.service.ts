import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Role } from "Vo/role";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Trainee } from 'Vo/trainee';


@Injectable({
  providedIn: 'root'
})


export class TraineeService {


  AdminbaseUrl = environment.AdminbaseUrl;

  private _getTraineeListURL = this.AdminbaseUrl+"/tnt/trainees/";
  private _getTraineeSearchListURL = this.AdminbaseUrl+"/tnt/trainees/";


  constructor(private http: HttpClient) { }

  getTraineeList(transitionId,traineeIds,traineeName, traineeEmail, traineeSkill): Observable<Trainee[]>{

        console.log("getTraineeList Service ");
        
        return this.http.get(this._getTraineeListURL+transitionId+"/"+traineeIds+"/"+traineeName+"/"+traineeEmail+"/"+traineeSkill).pipe(

          map((response: Response) => {
      
            if(Array.isArray(response)) {
                return <Trainee[]>response;
            }
              
        })) ;
  }

  /*
  getTraineeSearchList(transitionId, search): Observable<Trainee[]>{

    console.log("getTraineeList Service ");
    
    return this.http.get(this._getTraineeSearchListURL+transitionId+"/"+search).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
             return <Trainee[]>response;
        }
          
    })) ;
  }

  */

}