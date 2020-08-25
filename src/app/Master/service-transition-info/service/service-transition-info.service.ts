import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { stInfoClass } from '../class/stInfoClass.model';
import { ObserversModule } from '@angular/cdk/observers';
import { SessionStorageService } from 'angular-web-storage';

@Injectable({
  providedIn: 'root'
})
export class ServiceTransitionInfoService {

  baseUrl = environment.baseUrl;
  
  public  STScopeLevel :any ='';
  public stScope : any ='';
  public stScopeActivity : any ='';
  public stToolsUsage :any ='';
  Paramsubscription : Subscription;

  serviceTransitionInfoParameters : any;

  constructor(private http : HttpClient,public session: SessionStorageService ) { 
    this.serviceTransitionInfoParameters_get();
  }

  
  public ServiceTransitionInfo_get(IntegrationID : string): Observable<stInfoClass> {
      return this.http.get<stInfoClass>(this.baseUrl+'/ServiceTransitionInfo_get/'+IntegrationID);
  }

  public ServiceTransitionInfo_post(post_obj : any ):any{
    return this.http.post(this.baseUrl+'/ServiceTransitionInfo_post',post_obj)
  }

  public ServiceTransitionInfo_put(put_obj : any): any {
    return this.http.put (this.baseUrl+'/ServiceTransitionInfo_put',put_obj)
  }

  public ServiceTransitionInfo_delete(STinfoUNID :string,STScopeLevel : string):any {
    return this.http.delete(this.baseUrl+'/ServiceTransitionInfo_delete/'+STinfoUNID +'/'+STScopeLevel  )
  }

  
  public serviceTransitionInfoParameters_get():any{
    this.Paramsubscription= this.http.get(this.baseUrl+'/serviceTransitionInfoParameters').subscribe( (res : any) =>{      
      this.serviceTransitionInfoParameters = res;
       this.STScopeLevel   =  this.serviceTransitionInfoParameters.filter(level => level.FieldCategoryName === 'STSCOPELEVEL');                 
       this.stScopeActivity   =  this.serviceTransitionInfoParameters.filter(Activity => Activity.FieldCategoryName === 'STSCOPEACTIVITY');       
       this.stToolsUsage   =  this.serviceTransitionInfoParameters.filter(ToolsUsage => ToolsUsage.FieldCategoryName === 'Tools');       
      console.log(this.STScopeLevel);
      console.log(this.stScope);
      console.log(this.stScopeActivity);
      console.log(this.stToolsUsage);
    });

  }

  public stScopeFilter(keyString : string):any{
    this.stScope= '';
    this.stScope   =  this.serviceTransitionInfoParameters.filter(scope1 => scope1.FieldCategoryName === keyString); 
    console.log(this.stScope)
    return this.stScope;   
  }


}
