import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationServersService {
  baseUrl = environment.baseUrl

  constructor(private http : HttpClient ) { }

  public getAppServer(obj:string):any{
    return  this.http.get(this.baseUrl+'/getappServer/'+obj);
  } 

  public appServerSave(obj:any):any{    
    return this.http.post(this.baseUrl+'/appServerSave',obj)  
  }

  public appServerUpdate(obj:any):any{
    return this.http.put(this.baseUrl+'/appServerUpdate',obj)
  }
  
  public appServerDelete(obj:string):any{
    return this.http.delete(this.baseUrl+'/appServerDelete/'+obj)
  }

  public getAppName(obj:string):any{    
    return this.http.get(this.baseUrl+'/getAppName/'+obj);
  }

  public getEnvironment():any{
    console.log(this.baseUrl+'/getEnvironment')
    return this.http.get(this.baseUrl+'/getEnvironment')
  }

  public getServerType():any{
    return this.http.get(this.baseUrl+'/getServerType')
  }

  public getServerName():any{
    return this.http.get(this.baseUrl+'/getServerName')
  }


}
