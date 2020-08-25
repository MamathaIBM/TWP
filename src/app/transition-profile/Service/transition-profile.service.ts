
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransitionProfileService {
  IntegrationID: any;
  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient) {

     }

    public getTransitionProfile(obj:any):any{
      return this._http.get(this.baseURL+'/getNewProfile/'+obj);
    }
  
    public DuplicateSeibelCheck(obj: any): any {
      const newParam = 'SiebelOppNo=' + obj.SiebelOppNo;
       return this._http.get(this.baseURL + '/DuplicateSeibelCheck?' + newParam);
    }

     public SaveTransitionProfile(obj: any): any {
       console.log('Service' + obj);
       return this._http.post(this.baseURL + '/SaveNewProfile', obj);
      }

      public UpdateTransitionProfile(obj: any): any {
        console.log('Service' + obj);
        return this._http.put(this.baseURL + '/UpdateNewProfile', obj);
       }

       public getUserRolesProfile(obj:any):any{
        return this._http.get(this.baseURL+'/getUserRolesProfile/'+obj);
      }

      public postAddTransitionteam(obj: any): any {
          return this._http.post(this.baseURL + '/AddTransitionteam', obj );
      }
  
      public getUserOrgCheck(IntergrationID:string, CurrOrg: string):any{
        return this._http.get(this.baseURL+'/UserOrgCheck/'+IntergrationID+'/'+CurrOrg);
      }

      public getIndustry(Sector:string):any{
        return this._http.get(this.baseURL+'/getIndustry/'+Sector);
      }

      public getCountries(IOT:string):any{
        return this._http.get(this.baseURL+'/getCountries/'+IOT);
      }
    }

