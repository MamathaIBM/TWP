import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExecutionGetRequestService {

  constructor( private _http:HttpClient) { }


  public ExecutionView():any{
    // const headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    // const options = new RequestOptions({headers: headers});
    
    // return this._http.get("/ExecutionView")
    console.log("test access")
  return this._http.get("https://localhost:3000/ExecutionView")
  }

  
 
  public ExecutionSingleRecord(Acc_Name:string):any{
    return this._http.get("https://localhost:3000/ExecutionSingleRecord/"+Acc_Name)
  }

  public ExecutionProjectInfoSave(ProjectInfo:any):any{
    return this._http.post("https://localhost:3000/ExectionProject-InfoSave",ProjectInfo)
  }

  public ExecutionProjectInfoUpdate(ProjectInfo:any):any{
    return this._http.put("https://localhost:3000/ExectionProject-InfoUpdate",ProjectInfo)
  }

  public ExecutionTransitionHealthUpdate(Transhealth:any ):any{
    console.log("Transhealth:"+Transhealth)
    return this._http.put("https://localhost:3000/ExectionTransitionHealthSave",Transhealth)
  }

  public ExecutionTransitionHealthCreate(Transhealth:any ):any{
    console.log(Transhealth)
    return this._http.post("https://localhost:3000/ExectionTransitionHealthCreate",Transhealth)
  }

  public ExecutionTransitionHealthRead(account: string):any{
    // console.log("/ExecutionAccountsHealthread/"+account)
    // console.log(this._http.get("/ExecutionAccountsHealthread/"+account ))
    return this._http.get("https://localhost:3000/ExecutionAccountsHealthread/"+account );
  }
  
  //Overall Schedule Summary

  public ExecutionsheduleSummarySingleRecord(account:string):any{
    return this._http.get("https://localhost:3000/ExecutionsheduleSummarySingleRecord/"+account);
  }

  public ExecutionsheduleSummaryCreate(ScheudleSummaryData:any):any{
  //  console.log(ScheudleSummaryData)
    return this._http.post("https://localhost:3000/ExecutionsheduleSummaryCreate",ScheudleSummaryData);
  }

  public ExecutionsheduleSummaryUpdate(ScheudleSummaryData:any ):any{
    return this._http.put("https://localhost:3000/ExecutionsheduleSummaryUpdate",ScheudleSummaryData);
  }

  //weekly status
  public ExecutionWeeklyStatus():any{
    return this._http.get("https://localhost:3000/ExecutionWeeklyStatus")
  }

  public ExecutionWeeklyStatusCreate(postData:any):any{
    return this._http.post("https://localhost:3000/ExecutionWeeklyStatusCreate",postData)
  }

}
