import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { RiskAnalyzer_Admin } from '../class/transition-risk-analyzer-admin.model';

@Injectable({
  providedIn: 'root'
})
export class TransitionRiskAnalyzerAdminService {
  forkJoin(arg0: any[]) {
    throw new Error("Method not implemented.");
  }

  baseUrl = environment.baseUrl

  constructor(private http : HttpClient) { }
 

  public getTRA_AdminList(): any {    
    console.log(this.baseUrl+'/getTRA_AdminList')
    return this.http.get(this.baseUrl+'/getTRA_AdminList');
  }
  public getRisk_Category(): any {
    console.log(this.baseUrl+'/getRisk_Category')    
    return this.http.get(this.baseUrl+'/getRisk_Category');
    
  }

  public getTRA_AdminListAdd(obj:any): Observable<RiskAnalyzer_Admin> {    
    return this.http.post<RiskAnalyzer_Admin>(this.baseUrl+'/getTRA_AdminListAdd',obj);
  }
  public getTRA_AdminListUpdate(obj:any): Observable<RiskAnalyzer_Admin> {    
    return this.http.put<RiskAnalyzer_Admin>(this.baseUrl+'/getTRA_AdminListUpdate',obj);
  }
  public getTRA_AdminListDelete(TRA_UNID : String): any {    
    return this.http.delete(this.baseUrl+'/getTRA_AdminListDelete/'+TRA_UNID);
  }  
}
