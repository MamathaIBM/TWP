import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class ActiveTransitionsService {
  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient) { }

  public getActiveTransitionRecords(userID :any): any {
    return this._http.get(this.baseURL + '/ActiveProfiles/'+userID);
  }

}
