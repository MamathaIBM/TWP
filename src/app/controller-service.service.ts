import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavtntService } from './navtnt.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { Keyvalue } from 'Vo/keyvalue';
import { Observable } from 'rxjs';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoggerService } from 'Services/logger.service';

//import { AlertService } from 'Services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ControllerServiceService {


          AdminbaseUrl = environment.serverURL;
               

          constructor(private route: ActivatedRoute,
                      private router: Router,                     
                      private userAccessProfileService: UserAccessProfileService,
                      private loggerService: LoggerService,
                      private http: HttpClient
                       ){ 
          }



         goToComponent(sourceComponentPath,  destinationComponentPath, paramarray:any[]){


                             //alert(" CP beginning "+ this.userAccessProfileService.getCurrentPath());

                              //alert(" this.userAccessProfileService.hasAccess(destinationComponentPath) "+this.userAccessProfileService.hasAccess(destinationComponentPath));
                                     
                              //alert("Inside goto component");
                              //Check if has access

                              var accessResult = this.userAccessProfileService.hasAccess(destinationComponentPath);

                              //alert(" accessResult "+ accessResult + " "+destinationComponentPath);

                              //alert("Access Result is "+accessResult);

                              if (accessResult==true){   

                                    this.loggerService.logAccess(destinationComponentPath ).subscribe((parameters:any[]) => {
                        
                                      console.log("#####################################");
                                      //alert(" After Logger Service Called");
                                    });

                                    //alert("Access Result is Inside  ");
     
                                     //this.loggerService.logAccess(destinationComponentPath);
                                   
                                     this.userAccessProfileService.setCurrentPath(destinationComponentPath);
                                     this.router.navigate([destinationComponentPath], {queryParams: {filter: JSON.stringify(paramarray)}})

                              } else {         
                                     //alert("Going back to source component "+sourceComponentPath);                          
                                     // Go back to the source component
                                     //alert("Access Result is outside  ");
                                     //sourceComponentPath = this.userAccessProfileService.getCurrentPath();

                                     //alert(" sourceComponentPath"+sourceComponentPath);
                                     //this.router.navigate([sourceComponentPath], {queryParams: {filter: JSON.stringify(paramarray)}})
                              }                                                                               
         }

        
         
}
