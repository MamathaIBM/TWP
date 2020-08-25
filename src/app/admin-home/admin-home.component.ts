import { Component, OnInit } from '@angular/core';
import { NavtntService } from '../navtnt.service';
import { Router } from '@angular/router';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css']
})
export class AdminHomeComponent implements OnInit {



  screen = "Functionality List";

  ngOnInit() {

    //var sourceComponentPath = "/admin-home";
    //var destinationComponentPath = "/admin-home/functionality-list";
    //var destinationComponentParameterArray:any = [] 
    //this.router.navigate([destinationComponentPath], {queryParams: {filter: JSON.stringify(destinationComponentParameterArray)}})


    /*
    We need to check here if the user has access to 'show functionality List" outside controller as controller 
    will give message that 'You dont have access to this functionality' will create confusion as User already in Admin home.
    On the other hand if user has access then this fuctionality should be displayed as default functionality when
    user is in Admin home. This is a special requirement and and hence code to be written here.
    */

    
    const destinationComponentPath = "/admin-home/functionality-list";



    let functionality = this.session.get(destinationComponentPath);
    
    if (functionality != null){        
         this.showFunctionalityList();
    }    
    
    

  }

   myQueryParams:any[]

  constructor(public session: SessionStorageService,
              private userAccessProfileService: UserAccessProfileService,
              private navigation: NavtntService, 
              private router : Router ) { }


  showFunctionalityList(){

        this.screen = "Functionality";
        //var controllerPath = '/controller-tnt'
        var sourceComponentPath = "/admin-home";
        var destinationComponentPath = "/admin-home/functionality-list";
        var destinationComponentParameterArray:any = []     

        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }

  showRoleList(){

        this.screen = "Role";
        var sourceComponentPath = "/admin-home";
        var destinationComponentPath = "/admin-home/role-list";
        var destinationComponentParameterArray:any = []     

        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
        //  this.router.navigate(['/admin-home/role-list'])    
  }

  TransitionRiskAnalyzerAdmin(){
    this.screen = "Transition Risk Analyzer";
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/Riskanalyzer-Admin";
    var destinationComponentParameterArray:any = []     
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


  showUserLsit(){
        this.screen = "User";
        var sourceComponentPath = "/admin-home";
        var destinationComponentPath = "/admin-home/user-list";
        var destinationComponentParameterArray:any = []     

        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
        //this.router.navigate(['/admin-home/user-list'])    
  }


  showServiceBackLogPhaseActivityList(){

      //var controllerPath = '/controller-tnt'
      this.screen = "Standard phase activities";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/service-backlog-activity-list";
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }
  
  showSprintBackLogPhaseActivityList(){

    this.screen = "Standard phase activities";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/sprint-backlog-activity-list";
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showPlanPhaseActivityList(){

      this.screen = "Standard phase activities";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/plan-phase-activity-list";
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showLearnPhaseActivityList(){
      
      this.screen = "Standard phase activities";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/learn-phase-activity-list";      
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showPerformPhaseActivityList(){
      
      this.screen = "Standard phase activities";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/perform-phase-activity-list";      
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showSTPlanPhaseActivityList(){
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = '/admin-home/st-plan-phase-activity-list';
    var destinationComponentParameterArray = []
    
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
    }

    showSTDefinePhaseActivityList(){
        var sourceComponentPath = "/admin-home";
        var destinationComponentPath = '/admin-home/st-define-phase-activity-list';
        var destinationComponentParameterArray = []    
        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
        }
    
    showSTImplementPhaseActivityList(){
            var sourceComponentPath = "/admin-home";
            var destinationComponentPath = '/admin-home/st-implement-phase-activity-list';
            var destinationComponentParameterArray = []    
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
            }
    showSTHandoverPhaseActivityList(){
                var sourceComponentPath = "/admin-home";
                var destinationComponentPath = '/admin-home/st-handover-phase-activity-list';
                var destinationComponentParameterArray = []    
                this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
            }
  
    showSTPlanPhaseExitCriteriaList(){
                var sourceComponentPath = "/admin-home";
                var destinationComponentPath = '/admin-home/st-plan-phase-exit-activity-list';                                                
                var destinationComponentParameterArray = []    
                this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
            }
            
        showSTDefinePhaseExitCriteriaList(){
                var sourceComponentPath = "/admin-home";
                var destinationComponentPath = '/admin-home/st-define-phase-exit-activity-list';   
                var destinationComponentParameterArray = []    
                this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
            }
            
        showSTImplementPhaseExitCriteriaList(){
                var sourceComponentPath = "/admin-home";
                var destinationComponentPath = '/admin-home/st-implement-phase-exit-activity-list';   
                var destinationComponentParameterArray = []    
                this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
            }
            
        showSTHandoverPhaseExitCriteriaList(){
                var sourceComponentPath = "/admin-home";
                var destinationComponentPath = '/admin-home/st-handover-phase-exit-activity-list';   
                var destinationComponentParameterArray = []    
                this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
            }
  showClosurePhaseActivityList(){
      
    this.screen = "Standard phase activities";
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/closure-phase-activity-list";      
    var destinationComponentParameterArray = []   
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

  showServiceBackLogPhaseExitCriteriaList(){

    
      this.screen = "Service Backlog - Exit Criteria - List";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = '/admin-home/service-backlog-exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }
  
  showSprintBackLogPhaseExitCriteriaList(){

      this.screen = "Sprint Backlog - Exit Criteria - List";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/sprint-backlog-exit-criteria-list";
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showPlanPhaseExitCriteriaList(){

      this.screen = "AT Plan - Exit Criteria - List";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/plan-phase-exit-criteria-list";
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showLearnPhaseExitCriteriaList(){
      
      this.screen = "AT Learn - Exit Criteria - List";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/learn-phase-exit-criteria-list";      
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showPerformPhaseExitCriteriaList(){
      
      this.screen = "AT Perform - Exit Criteria - List";
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/perform-phase-exit-criteria-list";      
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }  

  showClosurePhaseExitCriteriaList(){
      
    this.screen = "Closure - Exit Criteria - List";
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/closure-phase-exit-criteria-list";      
    var destinationComponentParameterArray = []   
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

  showReadinessQuestionGlobalList(){

    this.screen = "Health & Readiness Question - List";
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/readiness-question-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}

/*
readinessQuestionCustomList(){

    //var controllerPath = '/controller-tnt'
    var sourceComponentPath = '/admin-home';
    var destinationComponentPath = '/admin-home/readiness-question-design-list';
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


readinessQuestionTrackingList(){

    //var controllerPath = '/controller-tnt'
    var sourceComponentPath = '/admin-home';
    var destinationComponentPath = '/admin-home/readiness-question-tracking-list';
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}
*/

onMessageRecieved(event) {
    alert(event);
    console.log(event);
  }


showParameterList(){
    
    this.screen = "Health & Readiness Criteria";
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/parameter-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}


showGlobalConfigParameterList(){
    
    this.screen = "Configuration Parameter";
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/config-parameter-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

showParameterCustomList(){
    
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/parameter-custom-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


showSystemSettingsList(){
    
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/system-settings-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


showContentTypeList(){
    
    this.screen = "Content Type List";
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/content-type-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}



showReportTemplateList(){
    
    this.screen = "Report template list";
    var sourceComponentPath = "/admin-home";
    
    var destinationComponentPath = "/admin-home/custom-report-list-admin";
     
    var destinationComponentParameterArray:any = [{ id: 'custom_or_admin', param: 'admin' }]  

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}


showReportOrgList(){
    
    this.screen = "Org level reports";
    var sourceComponentPath = "/admin-home";
    
    var destinationComponentPath = "/admin-home/custom-report-list-org";
     
    var destinationComponentParameterArray:any = [{ id: 'custom_or_admin', param: 'admin' }]  

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

showReportGlobalList(){
    
    this.screen = "Global reports";
    var sourceComponentPath = "/admin-home";
    
    var destinationComponentPath = "/admin-home/custom-report-list-global";
     
    var destinationComponentParameterArray:any = [{ id: 'custom_or_admin', param: 'admin' }]  

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}


tabClick(tab) {
    if (tab.index === 0) {          
        //this.showFunctionalityList();  
        const destinationComponentPath = "/admin-home/functionality-list";
        let functionality = this.session.get(destinationComponentPath);        
        if (functionality != null){        
             this.showFunctionalityList();
        }                 
    }else if (tab.index === 1) {   
        this.showServiceBackLogPhaseActivityList();
    }else if (tab.index === 2) {
        this.showServiceBackLogPhaseExitCriteriaList(); 
    }else if (tab.index === 3) {
        this.showParameterList();
    }
}


activityTabClick(tab) {

    if (tab.index === 0) {          
             
        
        var destinationComponentPath = "/admin-home/service-backlog-activity-list";
        let functionality = this.session.get(destinationComponentPath);        
        if (functionality != null){        
            this.showServiceBackLogPhaseActivityList(); 
        } 
    }else if (tab.index === 1) {   
        this.showSprintBackLogPhaseActivityList();
    }else if (tab.index === 2) {
        this.showPlanPhaseActivityList(); 
    }else if (tab.index === 3) {
        this.showClosurePhaseActivityList();
    }
}

exitCriteriaTabClick(tab) {

    if (tab.index === 0) {    
        var destinationComponentPath = '/admin-home/service-backlog-exit-criteria-list';
        let functionality = this.session.get(destinationComponentPath);        
        if (functionality != null){        
            this.showServiceBackLogPhaseExitCriteriaList();  
        }       
                       
    }else if (tab.index === 1) {   
        this.showSprintBackLogPhaseExitCriteriaList();
    }else if (tab.index === 2) {
        this.showPlanPhaseExitCriteriaList(); 
    }else if (tab.index === 3) {
        this.showClosurePhaseExitCriteriaList();
    }
}


}
