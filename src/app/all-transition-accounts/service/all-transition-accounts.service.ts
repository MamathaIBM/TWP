import { environment } from './../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AllTransitionAccountsService {
  baseurl = environment.baseUrl
  constructor(private _http: HttpClient) { }

  public getAllTransitionRecords(OwningOrg: String):any{
    return this._http.get(this.baseurl+"/AllProfiles/"+OwningOrg)
  }

}
