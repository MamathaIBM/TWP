import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransitionTeamService {
  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient ) {
    // this.StakeLength = 0;
    }
  public TransitionTeamKeywordResult(OwningTTSOrg: string): any {
    return this._http.get(this.baseURL + '/TransitionTeamKeyword/'+OwningTTSOrg);
 }

 public TransitionRoleKeywordResult(): any {
  return this._http.get(this.baseURL + '/TransitionRoleKeyword');
}

public getUserTransdataResult(id: string): any {
  console.log(id);
  return this._http.get(this.baseURL + '/UserTransitionDataKeyword/' + id);
}

public postAddTransitionteam(obj: any): any {
  console.log(obj);
    return this._http.post(this.baseURL + '/AddTransitionteam', obj );
 }

public putUpdateTransitionteam(obj: any): any {
  console.log('inside Service');
    return this._http.put(this.baseURL + '/UpdateTransitionteam', obj);
}

public DeleteTransTeam(obj: string): any {
  console.log(obj);
  return this._http.delete(this.baseURL + '/DeleteTransTeam/' + obj);
}

public getDuplicateTransTeamResult(obj: any): any {
  const newParam = 'USER_NAME=' + obj.TransitionTeamName + '&TRANSITION_ID=' + obj.IntegrationID;
   return this._http.get(this.baseURL + '/DuplicateTransTeamResult?' + newParam);
}

}
