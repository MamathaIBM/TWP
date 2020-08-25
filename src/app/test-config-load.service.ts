import { Injectable } from '@angular/core';
import { Functionality } from 'Vo/functionality';
import { SessionStorageService } from 'angular-web-storage';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { UserService } from 'Services/user.service';
import { NavtntService } from './navtnt.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Component, OnInit, Inject } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class TestConfigLoadService {
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

  //functionalityKeyValue: FunctionalityKeyValue={};
  //transitionKeyValue: TransitionKeyValue={};
  userId:string = '';
  //userAccess:boolean = false;
  userEmail:string ='';
  userName:string = '';
  count = 0;
  userAccessDone = false;
  functionalityListDone = false;
  transitionAccessListDone = false;



  private _getFunctionalityListURL = "https://localhost:8081/tnt/userFunctionalityList/";
  private _getTransitionAccessListURL = "https://localhost:8081/tnt/userTransitionAccessList/";
  private _getFunctionalityDefaultAccessListURL = "https://localhost:8081/tnt/functionalityDefaultAccessList/";


  constructor(public session: SessionStorageService, 

    private router: Router, 
    private http: HttpClient, 
    private route: ActivatedRoute, 
    private userAccessProfileService: UserAccessProfileService,               
    private userService: UserService,
    private navigation: NavtntService) { 
}

load(emailAddress){
  
  //alert("test-config-load - called ");
  this.session.clear();
  this.userName = "XYZ";
  this.userAccessProfileService.setUserName(this.userName);

  //this.session.set("USER_NAME",this.userName );



  //this.nm = this.nm.replace("%20", " ");
  this.photo = "";

  this.userAccessProfileService.setPhoto(this.photo);
  //alert("this.rowData._json.emailAddress"+this.rowData._json.emailAddress);

  //this.userAccessProfileService.setPhoto(this.photo );
  //this.userAccessProfileService.setUserName(this.userName);
  
  //if (this.route.snapshot.paramMap.get('id') == null )  
  this.userEmail = emailAddress;
  //this.userEmail = 'saikatray@in.ibm.com'

  //this.userEmail = 'parthpra@in.ibm.com'
  //else
    // this.userEmail = this.route.snapshot.paramMap.get('id');    


  this.populateUserAccessInfo(this.userEmail);
  this.populateFunctionalityDefaultAccessList()
  this.populateFunctionalityAccessList();
  this.populateTransitionAccessList();
  
}

populateFunctionalityAccessList(){

  console.log(  "getFunctionalityList()"); 

  this.getFunctionalityAccessList().subscribe((functionalities:any[]) => {
                   
    console.log("#####################################");

    //alert("functionalities.length "+functionalities.length); 

    this.populateFunctionalities(functionalities)

    //this.userAccessProfileService.setFunctionalityKeyValue(this.functionalityKeyValue);

   
    this.functionalityListDone = true;
        
    this.navigateIfDone();
  });    
}


populateFunctionalityDefaultAccessList(){

  alert(  "populateFunctionalityDefaultAccessList()..........."); 

  this.getFunctionalityDefaultAccessList().subscribe((functionalities:any[]) => {
                   
    console.log("#####################################");

    alert("getFunctionalityDefaultAccessList.length "+functionalities.length); 

    this.populateFunctionalities(functionalities)

    //this.userAccessProfileService.setFunctionalityKeyValue(this.functionalityKeyValue);

   
    this.functionalityListDone = true;
        
    this.navigateIfDone();
  });    
}

navigateIfDone(){
  
  //alert("NavigateIfDone ...");
  console.log(" this.userAccessDone"+this.userAccessDone);
  console.log("this.functionalityListDone"+this.functionalityListDone);
  console.log("this.transitionAccessListDone"+this.transitionAccessListDone);
  if (this.userAccessDone  && this.functionalityListDone  && this.transitionAccessListDone ){
          //this.router.navigate(['transition-list']); 

          
          //var controllerPath = '/controller-tnt'
          var sourceComponentPath = '/access-denied'
          var destinationComponentPath = 'ConsentFormComponent'          
          var destinationComponentParameterArray = [{ id: 'access_denied_msg', param: 'You dont have access to the tool!...' } ]         

          
          //alert("Before navigating ...");
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
  }

}

 getFunctionalityAccessList(): Observable<Functionality[]>{
  
  return this.http.get(this._getFunctionalityListURL+this.userEmail).pipe(
    map((response: Response) => {

      if(Array.isArray(response)) {
        return <Functionality[]>response;
      }
        
  })) ;
}


getFunctionalityDefaultAccessList(): Observable<Functionality[]>{
  
  return this.http.get(this._getFunctionalityDefaultAccessListURL).pipe(
    map((response: Response) => {

      if(Array.isArray(response)) {
        return <Functionality[]>response;
      }
        
  })) ;
}


getTransitionAccessList(): Observable<any[]>{

  const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  console.log("getTransitionAccessList ");
  
  
  return this.http.get(this._getTransitionAccessListURL+this.userEmail).pipe(
    map((response: Response) => {

      if(Array.isArray(response)) {
        return <any[]>response;
      }
        
  })) ;
}

          populateTransitionAccessList(){

            console.log(  "populateTransitionAccessList"); 

            this.getTransitionAccessList().subscribe((transitionList:any[]) => {
                            
              console.log("################################");

              console.log("functionalities.length "+transitionList.length); 
              
              let transitionId='';
              for(var i=0; i<transitionList.length; i++) {

                  console.log("Value of i"+i);
                  transitionId = transitionList[i].TRANSITION_ID;
                  //this.transitionKeyValue[transitionId] = transitionId;
                  this.session.set("TRANSITION"+transitionId,transitionId);

              }

              //this.userAccessProfileService.setTransitionKeyValue(this.transitionKeyValue);

              this.transitionAccessListDone = true;
              this.navigateIfDone();

            });    
          }  



          populateUserAccessInfo(userEmail){

          //alert(  "setUserAccess"); 
          // In the beginning it is false
          this.userAccessProfileService.setUserAccess(false);
          this.userAccessProfileService.setSuperUserAccess(false);
                  this.userService.getUserAccessData(userEmail).subscribe((userList:any[]) => {
                                  
                    console.log("#############################################");

                    console.log("userList.length "+userList.length); 
                    alert("userList.length=============== "+userList.length)

                          for(var i=0; i<userList.length; i++) {

                              
                              this.userId = userList[i].USER_ID;
                              this.userName = userList[i].USER_NAME;
alert(this.userId)
                              //alert("userList[i].USER_IS_SUPERUSER "+userList[i].USER_IS_SUPERUSER);

                              if (userList[i].USER_IS_SUPERUSER == 'Y'){
                                  //alert("Has su access");
                                  this.userAccessProfileService.setSuperUserAccess(true);
                              }

                              //this.userAccessProfileService.userAccess = true;

                              this.userAccessProfileService.setUserId(this.userId);
                              this.userAccessProfileService.setUserAccess(true);
                          }

                    
                          this.userAccessDone = true;
                          this.navigateIfDone();

                  });    
          }  

          populateFunctionalities(functionalities:any[]){


                  for(var i=0; i<functionalities.length; i++) {

                    console.log("Value of i"+i);
            
            
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
                    //functionality.functionalityDescription = functionalities[i].FUNC_DESCRIPTION;
                    functionality.functionalityOperationType = functionalities[i].FUNC_OPERATION_TYPE;
                    functionality.functionalityTransitionDependency = functionalities[i].FUNC_TRANSITION_DEPENDENCY;
                    functionality.functionalityDefault = functionalities[i].FUNC_DEFAULT;
                    functionality.functionalityUOI = functionalities[i].FUNC_UOI;          
                    //functionality.functionalityModule = functionalities[i].FUNC_MODULE;
            
            
                    // Keep reference by router link
                    this.session.set(functionalities[i].FUNC_ROUTERLINK, functionality);
                    // Keep refernces by unique operation identifier
                    this.session.set(functionalities[i].FUNC_UOI, functionality);
            
                    //var x = this.session.get(functionalities[i].FUNC_ROUTERLINK);
            
                    //alert("x.functionalityName  "+x.functionalityName);
            
            
                    //this.functionalityKeyValue[functionalities[i].FUNC_ROUTERLINK] = functionality;
            
                    //this.functionalities.push(functionality);
                }              
                }

}
