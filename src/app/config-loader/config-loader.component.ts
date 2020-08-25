import { Component, OnInit, Inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { Functionality } from 'Vo/functionality';
import { Observable, of } from 'rxjs';
import { Http, Response, RequestOptions} from "@angular/http";
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DataandparamService } from 'Services/dataandparam.service';
import { UserService } from 'Services/user.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { ActivatedRoute} from "@angular/router";
import { Router} from "@angular/router";
import { UserNameService } from 'Services/user-name.service';
import { HttpErrorResponse } from "@angular/common/http";
import { SessionStorageService } from 'angular-web-storage';
import { NavtntService } from '../navtnt.service';
import { environment } from 'src/environments/environment';


@Component({
      selector: 'app-config-loader',
      templateUrl: './config-loader.component.html',
      styleUrls: ['./config-loader.component.css']
})

export class ConfigLoaderComponent implements OnInit {

        AdminbaseUrl = environment.AdminbaseUrl;
        rowData:any;
        nm:any;
        photo:string;

        functionality: Functionality = {
                functionalityId:'',
                functionalityName:'',
                functionalityRouterLink:'',
                functionalityDescription:'',
                functionalityOperationType:'',
                functionalityTransitionDependency:'',
                functionalityModule:'',
                functionalityDefault:'',
                functionalityUOI:''    
        }

        functionalities: Functionality[] = [];
        transitionList: string[];
        userId:string = '';        
        userEmail:string ='';
        userName:string = '';
        count = 0;
        userAccessDone = false;
        functionalityListDone = false;
        transitionAccessListDone = false;
        defaultFunctionalityListDone = false;

        private _getFunctionalityListURL = this.AdminbaseUrl+"/tnt/userFunctionalityList/";
        private _getTransitionAccessListURL = this.AdminbaseUrl+"/tnt/userTransitionAccessList/";
        private _getFunctionalityDefaultAccessListURL = this.AdminbaseUrl+"/tnt/functionalityDefaultAccessList/";

        constructor(public session: SessionStorageService, 
                    private _Ser:UserNameService, 
                    private router: Router, 
                    private http: HttpClient, 
                    private route: ActivatedRoute, 
                    private userAccessProfileService: UserAccessProfileService,               
                    private userService: UserService,
                    private navigation: NavtntService) { 
        }

        ngOnInit() {        
                    this.session.clear();
                    this._Ser.getIBMusername().subscribe(res=>{          
                            this.rowData = res;
                            this.userEmail=this.rowData._json.emailAddress;
                            this.userName = this.rowData._json.cn;                            
                            this.photo = "https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/"+this.rowData._json.uid;                                          
                            this.userAccessProfileService.setUserName(this.userName);                    
                            this.userAccessProfileService.setPhoto(this.photo);
                            this.userAccessProfileService.setUserEmail(this.userEmail);                            
                            this.loadConfig(this.userEmail);
                    },(err:HttpErrorResponse)=>{
                            if(err.error instanceof Error){
                              console.log("Client Sider Error.");
                            }
                            else{console.log("Server Sider Error.");
                    }
                    }); 
        }


        loadConfig(emailAddress){
                    this.populateUserAccessInfo(emailAddress);
                    //this.populateFunctionalityDefaultAccessList();
                    this.populateFunctionalityAccessList();
                    this.populateTransitionAccessList();           
        }

        populateFunctionalityAccessList(){
                      this.getFunctionalityAccessList().subscribe((functionalities:any[]) => {                          
                                this.populateFunctionalities(functionalities)
                                this.functionalityListDone = true;    
                                console.log("populateFunctionalityAccessList is done");            
                                this.navigateIfDone();
                      });    
        }

        populateFunctionalityDefaultAccessList(){
                    this.getFunctionalityDefaultAccessList().subscribe((functionalities:any[]) => {                                                                 
                            this.populateFunctionalities(functionalities)
                            this.defaultFunctionalityListDone = true;                              
                            console.log("populateFunctionalityDefaultAccessList is done");           
                            this.navigateIfDone();
                    });    
        }

        navigateIfDone(){                    
                    if (this.userAccessDone  && this.functionalityListDone  && this.transitionAccessListDone  ){
                            var sourceComponentPath = '/access-denied'
                            var destinationComponentPath = 'ConsentFormComponent'          
                            var destinationComponentParameterArray = [{ id: 'access_denied_msg', param: 'You dont have access to the tool!...' } ]                                     
                            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
                    }
        }

        getFunctionalityAccessList(): Observable<Functionality[]>{  
                    return this.http.get(this._getFunctionalityListURL+this.userEmail)
                                    .pipe(
                                            map((response: Response) => {
                                                      if(Array.isArray(response)) {
                                                        return <Functionality[]>response;
                                                      }                        
                                              })
                                          );
        }

        getFunctionalityDefaultAccessList(): Observable<Functionality[]>{  
                    return this.http.get(this._getFunctionalityDefaultAccessListURL)
                                    .pipe(
                                            map((response: Response) => {
                                                    if(Array.isArray(response)) {
                                                          return <Functionality[]>response;
                                                    }                                        
                                            })
                                        );
        }

        getTransitionAccessList(): Observable<any[]>{
                      const httpOptions = {
                              headers: new HttpHeaders({ 'Content-Type': 'application/json' })
                      };
                      return this.http.get(this._getTransitionAccessListURL+this.userEmail).pipe(
                              map((response: Response) => {
                                    if(Array.isArray(response)) {
                                          return <any[]>response;
                                    }                    
                              }
                      ));
        }

        populateTransitionAccessList(){
                  console.log(  "populateTransitionAccessList"); 
                  this.getTransitionAccessList().subscribe((transitionList:any[]) => {
                    let transitionId='';
                    for(var i=0; i<transitionList.length; i++) {
                        transitionId = transitionList[i].TRANSITION_ID;
                        //alert("Setting transition id ...."+transitionId);
                        this.userAccessProfileService.setHasAccessTransitionID(transitionId);
                        //this.session.set("TRANSITION"+transitionId,transitionId);
                    }
                    this.transitionAccessListDone = true;
                    console.log("populateTransitionAccessList is done"); 
                    this.navigateIfDone();
                  });    
        }  


        populateUserAccessInfo(userEmail){
                  this.userAccessProfileService.setUserAccess(false);
                  this.userAccessProfileService.setSuperUserAccess(false);
                          this.userService.getUserAccessData(userEmail).subscribe((userList:any[]) => {
                                  for(var i=0; i<userList.length; i++) {
                                          this.userId = userList[i].USER_ID;
                                          this.userName = userList[i].USER_NAME;
                                          if (userList[i].USER_IS_SUPERUSER == 'Y'){
                                              this.userAccessProfileService.setSuperUserAccess(true);
                                          }
                                          this.userAccessProfileService.setUserTransionOrg(userList[i].USER_TRANSITION_ORG);

                                          //alert("Owning ORG) "+userList[i].USER_TRANSITION_ORG);
                                          //this.userAccessProfileService.setUserTransionOrg(userList[i].USER_TRANSITION_ORG);
                                          this.userAccessProfileService.setUserId(this.userId);
                                          this.userAccessProfileService.setUserAccess(true);
                                  }                          
                                  this.userAccessDone = true;
                                  this.navigateIfDone();
                          });    
        }  

        populateFunctionalities(functionalities:any[]){
                for(var i=0; i<functionalities.length; i++) {        
                        let functionality: Functionality = {
                                functionalityId:'',
                                functionalityName:'',
                                functionalityRouterLink:'',
                                functionalityDescription:'',
                                functionalityOperationType:'',
                                functionalityTransitionDependency:'',
                                functionalityModule:'',
                                functionalityDefault:'',
                                functionalityUOI:''                         
                        }
                            
                        functionality.functionalityId = functionalities[i].FUNCTIONALITY_ID;          
                        functionality.functionalityName = functionalities[i].FUNC_NAME;
                        functionality.functionalityRouterLink = functionalities[i].FUNC_ROUTERLINK;                
                        functionality.functionalityOperationType = functionalities[i].FUNC_OPERATION_TYPE;
                        functionality.functionalityTransitionDependency = functionalities[i].FUNC_TRANSITION_DEPENDENCY;
                        functionality.functionalityDefault = functionalities[i].FUNC_DEFAULT;
                        functionality.functionalityUOI = functionalities[i].FUNC_UOI;                                                         

                        //alert( functionality.functionalityName +"= "+functionality.functionalityRouterLink);
                        this.session.set((functionalities[i].FUNC_ROUTERLINK).trim(), functionality);
                        this.session.set((functionalities[i].FUNC_UOI).trim(), functionality);        
                }              
        }              
}
