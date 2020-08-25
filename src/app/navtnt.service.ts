import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Keyvalue } from 'Vo/keyvalue';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { ControllerServiceService } from './controller-service.service';
import { LoggerService } from 'Services/logger.service';

@Injectable({
  providedIn: 'root'
})
export class NavtntService {
 

  constructor(private route: ActivatedRoute, 
              private router: Router, 
              private loggerService: LoggerService, 
              private userAccessProfileService: UserAccessProfileService,
              private controllerService: ControllerServiceService ) { }


/*              
  goToComponent(sourceComponentPath,  destinationComponentPath, destinationComponentParameterArray:any[]){
 
            var controllerPath = '/controller-tnt'

            if (sourceComponentPath ==''){
                  sourceComponentPath = '/access-denied'
            }
            var queryParamsControllerArray = [
                  { id: 'sourceComponentPath', param: sourceComponentPath },
                  { id: 'destinationComponentPath', param: destinationComponentPath }      
            ];    
            
            var counter = 1;
            var newParamArray:Keyvalue[]=[];
            newParamArray[0] = queryParamsControllerArray[0];
            newParamArray[1] = queryParamsControllerArray[1];

            if (destinationComponentParameterArray.length >0 ){
                  counter = 2
                  for(var i=0; i<destinationComponentParameterArray.length; i++) {
                        newParamArray[counter] = destinationComponentParameterArray[i];
                        counter = counter + 1;          
                  } 
                  var myQueryParams = JSON.stringify(newParamArray)                                
                  this.router.navigate([controllerPath], {queryParams: {filter:myQueryParams}})
            } else{                
                  var  myQueryParams = JSON.stringify(queryParamsControllerArray)
                  this.router.navigate([controllerPath], {queryParams: {filter:myQueryParams}})
            }        
  }
  */

 goToComponent(sourceComponentPath,  destinationComponentPath, destinationComponentParameterArray:any[]){
       
      var controllerPath = '/controller-tnt'

      if (sourceComponentPath ==''){
            sourceComponentPath = '/access-denied'
      }

      this.controllerService.goToComponent(sourceComponentPath,  destinationComponentPath, destinationComponentParameterArray);
    
 }


 enterNewTransition(sourceComponentPath,  destinationComponentPath, transitionId, transitionOrg, destinationComponentParameterArray:any[]){
           this.userAccessProfileService.setCurrentTransitionID(transitionId);  
           this.userAccessProfileService.setHasAccessTransitionID(transitionId);   
           this.userAccessProfileService.setCurrentTransitionOrg(transitionOrg);  
           this.userAccessProfileService.initializeAccountDetails(destinationComponentParameterArray);

           this.goToComponent(sourceComponentPath,  destinationComponentPath, destinationComponentParameterArray);      
  }


  getParameterValue(parameterfilter, paramkey){
            let keyValue: KeyValue={};
            var paramarray = JSON.parse(parameterfilter);
            for(var i=0; i< paramarray.length; i++) {
                    var key  = paramarray[i].id;        
                    var value  = paramarray[i].param;                     
                    keyValue[key] = value;              
            }     
            return keyValue[paramkey]
  }

}


export interface KeyValue {
  [id :string]: string;
}
