import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Http, Response, RequestOptions} from "@angular/http";

import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class DataandparamService {


  transitionId:string="-1" ;
  clientName:string="";
  functionalityId:string="-1";


  propertyKeyValue: PropertyKeyValue={};
    
  constructor() {
    
  }

  getTransitionId(){
     return this.transitionId;
  }

  setTransitionId(transitionId:string){

    this.transitionId = transitionId;
  }


  setClientName(clientName:string){
    this.clientName = clientName;
  }

  getClientName(){
    return this.clientName;
  }

  setFunctionalityId(functionalityId:string){
    this.functionalityId = functionalityId;
  }

  getFunctionalityId(){
    return this.functionalityId;
  }


  setProperty(key, value){
    this.propertyKeyValue[key] = value;
    //alert("PUT  this.propertyKeyValue[key] " +this.propertyKeyValue[key]);
  }

  getProperty(key){
    //alert("get  this.propertyKeyValue[key] " +this.propertyKeyValue[key]);
    return this.propertyKeyValue[key] ;
  }

}


export interface PropertyKeyValue {
  [id :string]: string;
}