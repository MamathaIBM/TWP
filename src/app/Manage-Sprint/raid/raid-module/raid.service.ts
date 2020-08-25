import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import {MatTooltipModule} from '@angular/material/tooltip'; 

@Injectable({
  providedIn: 'root'
})
export class RaidService {
  private baseUrl = environment.baseUrl;
  constructor(private _http : HttpClient ) {
  }  
  public getRaidData(id:string):any {
   return this._http.get(this.baseUrl+ '/raidData/'+id)
  }
  public getexecelfile(Username: string,IntegrationID:string,TransitionAccName:string,TypeRadioButtonValue : string):any{
    console.log(this.baseUrl+ '/getexcelRAID/'+ Username+'/'+IntegrationID+'/'+TransitionAccName+"/"+TypeRadioButtonValue)
    return this._http.get(this.baseUrl+ '/getexcelRAID/'+ Username+'/'+IntegrationID+'/'+TransitionAccName+"/"+TypeRadioButtonValue)
  }
  public DeleteRaid(RaidId: string): any {
    return this._http.delete(this.baseUrl + '/DeleteRaid/' + RaidId);
  }
}
