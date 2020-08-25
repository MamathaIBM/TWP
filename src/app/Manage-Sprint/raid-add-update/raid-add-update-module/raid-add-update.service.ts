import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RaidAddUpdateService {
  private baseUrl = environment.baseUrl;
  constructor(private _http : HttpClient){  
  }
  /* public getRaid(obj: any): any {
    //const newParam = 'Epic='+obj.Epic + '&Sprint='+obj.Sprint +'&AppID='+obj.AppID+'&Type='+obj.Type+'&IntegrationID'=obj.IntegrationID;
    const newParam =obj.Epic+"/"+obj.Sprint+"/"+obj.AppID+"/"+obj.Type+"/"+obj.IntegrationID;
    console.log("in service"+this.baseUrl + '/raidSelect/' + newParam);
     return this._http.get(this.baseUrl + '/raidSelect/' + newParam);
  } */ 
  public getRaid(obj: string): any {
    console.log('Service....' + obj);
    console.log(this.baseUrl + '/raidSelect', obj)    
    // return this._http.post(this.baseUrl + '/raidSelect', obj);
    return this._http.get(this.baseUrl + '/raidSelect'+"/"+obj);
   }
   public getNames(obj: any): any {
    console.log('ServiceNames....' + obj);
    var param = obj.EpicUNID +"/"+obj.SprintUNID+"/"+obj.AppUNID+"/"+obj.Type+"/"+obj.IntegrationID;
    console.log(this.baseUrl + '/raidGetNames/'+param)
    return this._http.get(this.baseUrl + '/raidGetNames/'+param);    
   }
public getRaidEpic(obj:any):any {
    const newParam2 = obj.IntegrationID;
      console.log(this.baseUrl+ '/raidEpicData/'+newParam2)
     return this._http.get(this.baseUrl+ '/raidEpicData/'+newParam2)
    }
public getRaidSprint(epicUnId:string,IntegrationID : string , radioSelection : string):any {
  const getRaidSprintParam = epicUnId+"/"+IntegrationID //+"/"+radioSelection; 
    console.log(this.baseUrl+ '/raidSprintData/'+getRaidSprintParam)
   return this._http.get(this.baseUrl+ '/raidSprintData/'+getRaidSprintParam)
  }
public getRaidAppl(obj:any,scopelevel : string):any {
  const newParam =obj.Epic+"/"+obj.Sprint+"/"+obj.IntegrationID +"/"+scopelevel;
    console.log(this.baseUrl+ '/raidAppData/'+newParam)
   return this._http.get(this.baseUrl+ '/raidAppData/'+newParam)
  }
  public getRaidType():any {
    console.log(this.baseUrl+ "/raidType")
   return this._http.get(this.baseUrl+ "/raidType")
  }
  public InsertRaidInfo(obj: any): any {
    console.log('Service....' + obj);
    return this._http.post(this.baseUrl + '/InsertRaidInfo', obj);
   }
   public UpdateRaidInfo(obj: any): any {
    console.log('Service...' + obj);
    return this._http.put(this.baseUrl + '/UpdateRaidInfo', obj);
   }
   public getRiskResponsePlan():any {
    console.log(this.baseUrl+ "/riskResponsePlan")
   return this._http.get(this.baseUrl+ "/riskResponsePlan")
  }
  public getRiskProbability():any {
    console.log(this.baseUrl+ "/riskProbability")
   return this._http.get(this.baseUrl+ "/riskProbability")
  }
  public getRiskInternal():any {
    console.log(this.baseUrl+ "/riskInternal")
   return this._http.get(this.baseUrl+ "/riskInternal")
  }
  public getRiskExposure():any {
    console.log(this.baseUrl+ "/riskExposure")
   return this._http.get(this.baseUrl+ "/riskExposure")
  }
  public getRiskImpact():any {
    console.log(this.baseUrl+ "/riskImpact")
   return this._http.get(this.baseUrl+ "/riskImpact")
  }
  public getReportingLevel():any {
    console.log(this.baseUrl+ "/riskReportingLevel")
   return this._http.get(this.baseUrl+ "/riskReportingLevel")
  }
  public getPriority():any {
    console.log(this.baseUrl+ "/riskpriority")
   return this._http.get(this.baseUrl+ "/riskpriority")
  }
  public getStatus():any {
    console.log(this.baseUrl+ "/riskSatus")
   return this._http.get(this.baseUrl+ "/riskSatus")
  }
  public RaidLevelsParameters():any {  
    return this._http.get(this.baseUrl+ "/RaidLevelsParameters");
  //  this.RaidLevelsParametersSubscription =  this._http.get(this.baseUrl+ "/RaidLevelsParameters").subscribe((res : any) =>{
  //     this.RaidLevelsParameters_var = res ;
  //     // console.log(this.RaidLevelsParameters_var)
  //     this.Raid_Levels = this.RaidLevelsParameters_var.filter(Raid_Levels => Raid_Levels.FieldCategoryName ==='Raid_Levels')
  //     this.Scope_Level = this.RaidLevelsParameters_var.filter(Raid_Levels => Raid_Levels.FieldCategoryName ==='Scope Level')
  //     console.log(this.Raid_Levels)
  //     console.log( this.Scope_Level)
  //  })
  }
  public getShowstopper():any {
    console.log(this.baseUrl+ "/raidShowstopper")
   return this._http.get(this.baseUrl+ "/raidShowstopper")
  }
  getEmployeeDirectory(obj: string): any {
console.log("In service--emp names")
    const newParam = 'USERNAME=' + obj;
       return this._http.get(this.baseUrl + '/getEmployeeDirectory?' + newParam );

  }
}
