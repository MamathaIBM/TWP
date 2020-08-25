import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Functionality } from 'Vo/functionality';
import { SessionStorageService } from 'angular-web-storage';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class UserAccessProfileService {


  AdminbaseUrl = environment.AdminbaseUrl;
  // baseUrl = environment.TempserverURL;
  errorMessage= '';

  userAccessDone = false;
  functionalityListDone = false;
  transitionAccessListDone = false;

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

  //private _getFunctionalityListURL = this.AdminbaseUrl+"/tnt/userFunctionalityList/";
  //private _getTransitionAccessListURL = this.AdminbaseUrl+"/tnt/userTransitionAccessList/";

  
  constructor(public session: SessionStorageService, private http: HttpClient, private userService: UserService) { 
    //alert("Constructer called User Access Profile Service ");
  }
  

  ngOnInit() {  
    //this.session.set("Admin_Profile",)
  }

  /*
  populateUserAccessProfile(email){
    this.userEmail = email
    alert(" this.userAccessDone = "+this.userAccessDone);
      
  
    this.checkUserAccessInTool(this.userEmail);
    this.populateFunctionalityAccessList();
    this.populateTransitionAccessList();
    alert("Before ending populateUserAccessProfile......................")
    
    while (!(this.userAccessDone  && this.functionalityListDone  && this.transitionAccessListDone)){
      //do nothing
      
    }
    
    alert("after ending populateUserAccessProfile......................")
    
  }
  */

  
  initialize(){
      this.setUserAccess(false);
      this.setSuperUserAccess(false);
  }
  


   hasFunctionalityAccess(routerString):boolean{

   //alert("routerString1 "+routerString+ "  Length "+routerString.length);

   let functionality = this.session.get(routerString);

   console.log("routerString "+routerString) ;

  //alert("functionality "+functionality);


    // check if the user does not have  component access return false 
    if (functionality == null){
          this.errorMessage = "You dont have access to this functionality 1";
          alert("You dont have access to this functionality");
          return false;
    }else if (functionality != null){

            // Check if transition org matches
            if (functionality.functionalityOperationType == 'READ' ){


                   /*
                   if (this.transitionOrgMatches()) {
                        return true;
                   }
                   alert("You dont have access to this organization ");
                   return false;  
                   */                
            }

            if (functionality.functionalityDefault == 'Y'){
                //alert("Has default access ");
                return true;
            }
            else if (this.hasTransitionDependancy(functionality)){
                    let transitionId = this.getCurrentTransitionID(); 

                    if (this.hasTransitionAccess(transitionId)){

                          //alert("has transition access...");
                          return true;
                    }else if (this.getViewFlag()=='Yes'){  // Check the View Mode

                                if (!this.transitionOrgMatches()) {
                                        alert("You dont have access to this owning TTS organization ");
                                        return false; 
                                } else {
                                        return true;
                                }  
                                                    
                    }else{
                                  alert("You dont have access to this transition ");
                                  this.errorMessage = "You cannot modify data for this transition";
                                  return false;
                    }

            } else{

                    //alert("Returning true ");
                    return true;
            }  
          
    } 
    
    //return false;   

   }

   hasTransitionAccess(transitionId):boolean{

           //alert(" transitionId "+transitionId);
            if (transitionId == null || transitionId == 'undefined' ){ // This occurs in the case of new transition execution
                  return true;  
            }else if (this.getHasAccessTransitionID(transitionId) != null){
                  //alert("Has transition access...")
                  return true;
            }else{
                    //alert("Has no transition access...")
                    return false;
            }
      

   }


   hasTransitionDependancy(functionality:Functionality):boolean{
         
      if (functionality.functionalityTransitionDependency =='Y'){
        return true;
      }

      return false;
   }

  /*
   getFunctionalityAccessList(): Observable<Functionality[]>{
    console.log("getUserList Service ");
    
    
    return this.http.get(this._getFunctionalityListURL).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <Functionality[]>response;
        }
          
    })) ;
  }
  */

setUserAccess(userAccess){

  //this.userAccess = userAccess;
  this.session.set("USER_ACCESS", userAccess);
  
}  

getUserAccess(){

  //this.userAccess = userAccess;
  return this.session.get("USER_ACCESS");
  
}  



hasToolAccess(){

      if (this.getUserAccess()){    
            return true;
      }else{
            return false;
      }   
}


setUserId(userId){
  //this.userId = userId;
 this.session.set("USER_ID", userId)

}


getUserId(){
  //this.userId = userId;
 return this.session.get("USER_ID");

}


/*
setTransitionKeyValue(transitionKeyValue:TransitionKeyValue){
  this.transitionKeyValue = transitionKeyValue;
}
*/

getErrorMessage(){
  return this.errorMessage;
}

setSuperUserAccess(access:boolean){

  this.session.set("SUPER_USER_ACCESS", access)
   //this.superUserAccess = access;
}

hasSuperUserAccess(){
  //alert("this.superUserAccess "+this.session.get("SUPER_USER_ACCESS"));
  return this.session.get("SUPER_USER_ACCESS");
}




hasAccess(routerPathComponent){


  //alert("  this.hasAccess() called ");


  //alert("hasAccess "+routerPathComponent);
  if (!this.hasToolAccess()){  
    //alert("User does not have tool access");
    return false;
  }else if (this.hasSuperUserAccess()){        
    return true;
  }else if (this.hasFunctionalityAccess(routerPathComponent.trim())){
    //alert("User has functionality access"); 
    return true;
  }else{  
    //alert("You don't have access to this functionality");    
    return false; 
  }
  
}


/*
populateFunctionalityAccessList(){
  console.log(  "getFunctionalityList()"); 
  this.getFunctionalityAccessList().subscribe((functionalities:any[]) => {
                   
    console.log("#####################################");
    console.log("functionalities.length "+functionalities.length); 
    for(var i=0; i<functionalities.length; i++) {
        console.log("Value of i"+i);
        let functionality: Functionality = {
          functionalityId:'',
          functionalityName:'',
          functionalityRouterLink:'',
          functionalityDescription:'',
          functionalityOperationType:'',
          functionalityTransitionDependency:'',
          functionalityModule:''           
        }
         
        functionality.functionalityId = functionalities[i].FUNCTIONALITY_ID;          
        functionality.functionalityName = functionalities[i].FUNC_NAME;
        functionality.functionalityRouterLink = functionalities[i].FUNC_ROUTERLINK;
        //functionality.functionalityDescription = functionalities[i].FUNC_DESCRIPTION;
        functionality.functionalityOperationType = functionalities[i].FUNC_OPERATION_TYPE;
        functionality.functionalityTransitionDependency = functionalities[i].FUNC_TRANSITION_DEPENDENCY;
        //functionality.functionalityModule = functionalities[i].FUNC_MODULE;
        this.functionalityKeyValue[functionalities[i].FUNC_ROUTERLINK] = functionality;
         this.functionalities.push(functionality);
    }
    this.setFunctionalityKeyValue(this.functionalityKeyValue);
   
    this.functionalityListDone = true;
        
    //this.navigateIfDone();
  });    
}
*/
/*
navigateIfDone(){
  
  console.log(" this.userAccessDone"+this.userAccessDone);
  console.log("this.functionalityListDone"+this.functionalityListDone);
  console.log("this.transitionAccessListDone"+this.transitionAccessListDone);
  if (this.userAccessDone  && this.functionalityListDone  && this.transitionAccessListDone ){
    //this.router.navigate(['transition-list']); 
    this.router.navigate(['controller-tnt', 'ConsentFormComponent']);
    //controller-tnt/ConsentFormComponent
  }
}
*/

/*
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
*/


/*
populateTransitionAccessList(){
  console.log(  "populateTransitionAccessList"); 
  this.getTransitionAccessList().subscribe((transitionList:any[]) => {
                   
    console.log("################################");
    console.log("functionalities.length "+transitionList.length); 
    
    let transitionId='';
    for(var i=0; i<transitionList.length; i++) {
        console.log("Value of i"+i);
        transitionId = transitionList[i].TRANSITION_ID;
        this.transitionKeyValue[transitionId] = transitionId;
    }
    this.setTransitionKeyValue(this.transitionKeyValue);
    this.transitionAccessListDone = true;
    //this.navigateIfDone();
  });    
}  
*/


    checkUserAccessInTool(userEmail){

    //alert(  "setUserAccess"); 

    this.userService.getUserAccessData(userEmail).subscribe((userList:any[]) => {
                    
      console.log("#############################################");

      console.log("userList.length "+userList.length); 
      

      for(var i=0; i<userList.length; i++) {

          
          this.session.set("USER_ID", userList[i].USER_ID);


          //alert("userList[i].USER_IS_SUPERUSER "+userList[i].USER_IS_SUPERUSER);

          if (userList[i].USER_IS_SUPERUSER == 'Y'){
              //alert("Has su access");
              this.setSuperUserAccess(true);
          }

          //this.userAccess = true;

          //this.setUserId(this.userId);
          this.setUserAccess(true);
      }

      
      this.userAccessDone = true;
      //this.navigateIfDone();


      //alert("After User Access Done ......");

    });    
    }  


    setCurrentTransitionID(integrationId){

      //alert(" Setting current intergration ID "+integrationId);
      this.session.set("TRANSITION_ID", integrationId) ;
    }

    getCurrentTransitionID(){
    return this.session.get("TRANSITION_ID");
    }


    setHasAccessTransitionID(integrationId){
          this.session.set("TRANSITION"+integrationId, integrationId) ;
    }

    getHasAccessTransitionID(integrationId){
        return this.session.get("TRANSITION"+integrationId);
    }


    setUserTransionOrg(transitionOrg){
      this.session.set("USER_TRAN_ORG", transitionOrg) ;
    }

    getUserTransionOrg(){
      return this.session.get("USER_TRAN_ORG")
    }


    setUserEmail(userEmail){

    this.session.set("USER_EMAIL", userEmail) ;
    //this.userEmail = userEmail;
    }


    setCurrentPath(path){

      this.session.set("CURRENT_PATH", path) ;
      //this.userEmail = userEmail;
      }

    getCurrentPath(){
        return this.session.get("CURRENT_PATH");
    }


    setUserName(name){

      //alert("UserAccessProfileService - setting user name "+ name );
      this.session.set("USER_NAME", name) ;
      //this.userName = name;
    }
    getUserName(){
      return this.session.get("USER_NAME");
    }

    setPhoto(userPhoto){

      this.session.set("USER_PHOTO", userPhoto) ;

      //this.photo = userPhoto;
    }

    getUserPhoto(){
      return this.session.get("USER_PHOTO") ;
    }

/*
setCurrentTransition(uniqueTransitionID){
   this.session.set("CURRENT_TRANSITION", uniqueTransitionID);
}
*/

    getCurrentTransition(){
      return this.session.get("CURRENT_TRANSITION");
    }

    setCurrentTransitionOrg(currentTransitionOrg){
      this.session.set("CURRENT_TRANSITION_ORG", currentTransitionOrg);
    }

    getCurrentTransitionOrg(){
      return this.session.get("CURRENT_TRANSITION_ORG");
    }

    transitionOrgMatches(){

      var result = false;

      var owning_orgs = this.getUserTransionOrg().split(",");
      if (owning_orgs.length >0){

          //var owning_orgs = this.getUserTransionOrg().split(",");
          for( var i=0; i< owning_orgs.length; i++){           
              if  (this.getCurrentTransitionOrg() ==  owning_orgs[i])   {
                    //return true;
                    result = true ;
              }
          }
      }else{      
           //return false;
           result = false ;
      } 
      return result;
    }


    initializeAccountDetails(paramarray:any[]){

      for(var i=0 ; i<paramarray.length; i++){
            this.session.set("ACCOUNT"+paramarray[i].id,paramarray[i].param) ;
      }

    }


    getIntegrationID(){
      return this.session.get("ACCOUNT"+"Id");
    }


    getClientName(){
      return this.session.get("ACCOUNT"+"ClientName");
    }

    getSector(){
      return this.session.get("ACCOUNT"+"Sector");
    }

    getIndustry(){
      return this.session.get("ACCOUNT"+"Industry");
    }

    getViewFlag(){
      return this.session.get("ACCOUNT"+"ViewFlag");
    }

    getFunctionality(router_link){
      return this.session.get(router_link);
    }

    getUserEmail(){
      //alert("Returning user email "+this.session.get("USER_EMAIL"));
      return this.session.get("USER_EMAIL");
    }

    setNewTransitionSetupInProgress(value){
          this.session.set("NEW_TRANSITION_SETUP_IN_PROGRESS",value) ;
    }

    getNewTransitionSetupInProgress(){
          return this.session.get("NEW_TRANSITION_SETUP_IN_PROGRESS");
    }

    setAppId(appName, appId){
          var tranId = this.getCurrentTransitionID();
          this.session.set(appName+tranId, appId);
    }

    getAppId(appName){
        var tranId = this.getCurrentTransitionID();
        return this.session.get(appName+tranId);
    }

    setTraineeId(email, traineeId){
        var tranId = this.getCurrentTransitionID();
        this.session.set(email+tranId, traineeId);
    }

    getTraineeId(email){
        var tranId = this.getCurrentTransitionID();
        return this.session.get(email+tranId);
    }    

}