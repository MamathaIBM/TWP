import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserNameService {
  UserName: any;
  constructor(private _http: HttpClient) { }
  
  serverURL=environment.serverURL
  public getIBMusername():any{
    return this._http.get(this.serverURL+"/api/getuser")
   }

   public Toollogout():any{
    return this._http.get(this.serverURL+"/logout")
   }

   
}
