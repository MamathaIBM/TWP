import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RiskAnalyzer_AccountAdd } from '../transition-risk-analyzer-add-account/class/transition-risk-analyzer-Account-Add.model';

@Injectable({
  providedIn: 'root'
})
export class TransitionRiskAnalyzerAccountService {

  baseUrl = environment.baseUrl

  constructor(private http : HttpClient) { }
 
  public getTRA_AccountList(IntegrationID : string): any {    
    return this.http.get(this.baseUrl+'/getTRA_AccountList/'+IntegrationID);
  }
  public getTRA_RiskValues(): any {    
    return this.http.get(this.baseUrl+'/getTRA_RiskValues');
  }
  public getTRA_RiskTypes(): any {    
    return this.http.get(this.baseUrl+'/getTRA_RiskTypes');
  }
  public postAccount_Data(obj_data:any):any{
    console.log(obj_data)
      return this.http.post(this.baseUrl+ '/postAccount_Data',obj_data);
  }
  public putAccount_Data(obj_data:any):any{
    return this.http.put(this.baseUrl+'/putAccount_Data',obj_data);
  }
  public getTRA_AccountListAdd(obj:any): Observable<RiskAnalyzer_AccountAdd> {    
    return this.http.post<RiskAnalyzer_AccountAdd>(this.baseUrl+'/getTRA_AccountListAdd',obj);
}

public getRisk_Account_Category(IntegrationID : string): any {    
  return this.http.get(this.baseUrl+'/getRisk_Account_Category/'+IntegrationID);
  
}

public Finalize_and_Submit_Analysis(obj_data):any {
  return this.http.post(this.baseUrl+'/Finalize_and_Submit_Analysis',obj_data );
}

public getTRAExportExcel(UserNm: string, IntegrationID:string, TransitionAccName:string): any {
  return this.http.get(this.baseUrl + '/TRAExportExcel/'+ UserNm+'/'+IntegrationID+'/'+TransitionAccName );  
}


}