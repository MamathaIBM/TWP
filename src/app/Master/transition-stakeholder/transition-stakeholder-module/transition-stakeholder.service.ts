
import { environment } from './../../../../environments/environment';

import { Stakeholder } from './../class/stakeholder.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {MatTableDataSource} from '@angular/material';




@Injectable({
  providedIn: 'root'
})
export class TransitionStakeholderService {
  private baseUrl = environment.baseUrl
  constructor(private _http : HttpClient ) {
   // this.StakeLength = 0;        
   }
   
   public postStakeholder(obj:any ):any {
   console.log('serverice' + obj);
     return this._http.post(this.baseUrl+ '/stakeholderSave',obj) 
   }
   public TransitionRoleKeywordResult(): any {
    return this._http.get(this.baseUrl + '/TransitionRoleKeyword');
  }
   getEmployeeDirectory(obj: string): any {

    const newParam = 'USERNAME=' + obj;
       return this._http.get(this.baseUrl + '/getEmployeeDirectory?' + newParam );

  }
  public getStakeholder(id:string):any {
    console.log(this.baseUrl+ "/stakeholderSelect/"+id)
   return this._http.get(this.baseUrl+ "/stakeholderSelect/"+id)
  }
   
  public putStakeholder(obj:any):any{
    return this._http.put(this.baseUrl+ "/stakeholderUpdate",obj) 
  }

  public deleteStakeholder(obj:string):any{
    
    return this._http.delete(this.baseUrl+ "/stakeholderDelete/"+obj )
  }

  // publishList(){
  //         this.getStakeholder().subscribe( res => {
  //           console.log("res     "+ res )            
  //         this.stateholderClsVar =res
  //         this.dataSource = new MatTableDataSource(this.stateholderClsVar)
  //         this.StakeLength = this.stateholderClsVar.length
  //     } )
  // }
  
  // PushList(obj:any ){
  //     this.postStakeholder(obj).subscribe((res : any[]) =>{      
  //       this.stateholderClsVar.push(obj)     
  //           this.dataSource = new MatTableDataSource(this.stateholderClsVar)         
  //    })
  // }

  // populatedata(obj:any){
  //   this.st.IntegrationID = obj.IntegrationID
  //   this.st.ResourceName = obj.ResourceName
  //   this.st.EmailId = obj.EmailId
  //   this.st.Role = obj.Role
    
  // }


}
