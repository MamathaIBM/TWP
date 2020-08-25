import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExecutionTeamService {
  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient ) {
   // this.StakeLength = 0;
   }

   public ExecutionTeamKeywordResult(OwningTTSOrg: string): any {
    return this._http.get(this.baseURL + '/ExecutionTeamKeyword/'+OwningTTSOrg);
 }

 public ExecutionRoleKeywordResult(): any {
  return this._http.get(this.baseURL + '/ExecutionRoleKeyword');
}

public getUserExecutiondataResult(id: string): any {
  return this._http.get(this.baseURL + '/UserExecutionDataKeyword/' + id);
}

public postAddExecutionteam(obj: any): any {
  console.log(obj);
    return this._http.post(this.baseURL + '/AddExecutionteam', obj );
 }

public putUpdateExecutionteam(obj: any): any {
  console.log('inside Service');
    return this._http.put(this.baseURL + '/UpdateExecutionteam', obj);
}

public DeleteExeTeam(obj: string): any {
  return this._http.delete(this.baseURL + '/DeleteExeTeam/' + obj);
}

public getDuplicateExeTeamResult(obj: any): any {
  const newParam = 'USER_NAME=' + obj.ExecutionTeamName + '&TRANSITION_ID=' + obj.IntegrationID;
   return this._http.get(this.baseURL + '/DuplicateExeTeamResult?' + newParam);
}

}
