import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavtntService } from '../navtnt.service';

@Component({
  selector: 'app-menu-admin-horizontal',
  templateUrl: './menu-admin-horizontal.component.html',
  styleUrls: ['./menu-admin-horizontal.component.css']
})
export class MenuAdminHorizontalComponent implements OnInit {
 
  myQueryParams:any[]

  constructor(private navigation: NavtntService, private router : Router ) { }

  ngOnInit() {
  }

  showFunctionalityList(){

        //var controllerPath = '/controller-tnt'
        var sourceComponentPath = "/admin-home";
        var destinationComponentPath = "/admin-home/functionality-list";
        var destinationComponentParameterArray:any = []     

        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }

  showRoleList(){

        //var controllerPath = '/admin-home/controller-admin'
        var sourceComponentPath = "/admin-home";
        var destinationComponentPath = "/admin-home/role-list";
        var destinationComponentParameterArray:any = []     

        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
        //  this.router.navigate(['/admin-home/role-list'])    
  }

  showUserLsit(){

        
        var sourceComponentPath = "/admin-home";
        var destinationComponentPath = "/admin-home/user-list";
        var destinationComponentParameterArray:any = []     

        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
        //this.router.navigate(['/admin-home/user-list'])    
  }


  showServiceBackLogPhaseActivityList(){

      //var controllerPath = '/controller-tnt'
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/service-backlog-activity-list";
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }
  
  showSprintBackLogPhaseActivityList(){

      //var controllerPath = '/controller-tnt'
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/sprint-backlog-activity-list";
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showPlanPhaseActivityList(){

      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/plan-phase-activity-list";
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showLearnPhaseActivityList(){
      
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/learn-phase-activity-list";      
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showPerformPhaseActivityList(){
      
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/perform-phase-activity-list";      
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showClosurePhaseActivityList(){
      
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/closure-phase-activity-list";      
    var destinationComponentParameterArray = []   
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}


  showServiceBackLogPhaseExitCriteriaList(){

      //var controllerPath = '/controller-tnt'
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = '/admin-home/service-backlog-exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }
  
  showSprintBackLogPhaseExitCriteriaList(){

      //var controllerPath = '/controller-tnt'
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/sprint-backlog-exit-criteria-list";
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showPlanPhaseExitCriteriaList(){

      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/plan-phase-exit-criteria-list";
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showLearnPhaseExitCriteriaList(){
      
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/learn-phase-exit-criteria-list";      
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  showPerformPhaseExitCriteriaList(){
      
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/perform-phase-exit-criteria-list";      
      var destinationComponentParameterArray = []   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }  

  showClosurePhaseExitCriteriaList(){
      
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/closure-phase-exit-criteria-list";      
    var destinationComponentParameterArray = []   
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

  showReadinessQuestionGlobalList(){

    //var controllerPath = '/controller-tnt'
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

testAngular(){

    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/testarray";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


showParameterList(){
    
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/parameter-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

showParameterCustomList(){
    
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/parameter-custom-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


tabClick(tab) {
    if (tab.index === 0) {          
        this.showFunctionalityList();                 
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
        this.showServiceBackLogPhaseActivityList();                 
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
        this.showServiceBackLogPhaseExitCriteriaList();                 
    }else if (tab.index === 1) {   
        this.showSprintBackLogPhaseExitCriteriaList();
    }else if (tab.index === 2) {
        this.showPlanPhaseExitCriteriaList(); 
    }else if (tab.index === 3) {
        this.showClosurePhaseExitCriteriaList();
    }
}


}
