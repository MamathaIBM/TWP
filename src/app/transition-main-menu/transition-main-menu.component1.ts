
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavtntService } from '../navtnt.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceForm } from 'Services/form';
import { UserAccessProfileService } from 'Services/user-access-profile.service';

@Component({
  selector: 'app-transition-main-menu',
  templateUrl: './transition-main-menu.component.html',
  styleUrls: ['./transition-main-menu.component.css']
})
export class TransitionMainMenuComponent implements OnInit {

  private ID: string ;
  private Client: string;
  private Sector: string;
  private Industry: string;
  private ViewFlag: string;
  buttonColor: string;
  buttonColorinactive: string;
  count: number;
  selectedIndex: number;
  ActiveExecutions: any;
  OwningTTS: string;
  url: string;
  selectedTab: number;
  selectedTab1: number;
  SceenName: any;
  constructor(private navigation: NavtntService,private userAccessProfileService: UserAccessProfileService, private router: Router, private activatedRoute: ActivatedRoute, private _frmser: ServiceForm ) {

   }

   TWBS(tabname){     
    this.ActiveTab(tabname);
    this.SceenName="Master  > Tailor WBS"
	  var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/TWBS';
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }];
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
   }

   TEC(tabname){     
    this.ActiveTab(tabname);
    this.SceenName="Master  > Tailor Exit Criteria"
	  var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/TEC';
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }];
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
   }

   ECAccount(tabname){     
    this.ActiveTab(tabname);
    this.SceenName="Tranistion Closure  > Exit Criteria"
	  var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/ECAccount';
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }]   ;
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
  }

   DeliverCompletion(tabname){     
    this.ActiveTab(tabname);
    this.SceenName="Tranistion Closure  > Deliverable Completion"
	  var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/DeliverCompletion';
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }]   ;
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
   }
   sevenkey(tabname){
         this.ActiveTab(tabname);
         this.SceenName="Manage Sprint  > Seven Key (Weekly Transition Review )"
         var sourceComponentPath = '/transition-Main/';
         var destinationComponentPath = '/transition-Main/seven-key';    
         var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },                                                 
                                                  { id: 'ViewFlag', param: this.ViewFlag },
                                                  { id: 'OwningTTS', param: this.OwningTTS }]           
         this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)   
       } 

   RAID(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Manage Sprint  > RAID"
    var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/raid';
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS } ]            
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
    }
  
    SprintLevelPlan(tabname){
      this.ActiveTab(tabname);
      this.SceenName="Transition Plan  >  Sprint Execution Plan - Application Task Level "
      var sourceComponentPath = '/transition-Main/';
      var destinationComponentPath = '/transition-Main/SprintLevelPlan';
      var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
      { id: 'ViewFlag', param: this.ViewFlag },
      { id: 'OwningTTS', param: this.OwningTTS } ]            
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
      }

      SprintLevelPlan1(tabname){
        this.ActiveTab(tabname);
        this.SceenName="Transition Plan  > Sprint Execution Plan - Application Level "
        var sourceComponentPath = '/transition-Main/';
        var destinationComponentPath = '/transition-Main/SprintApplnLevelPlan';
        var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
        { id: 'ViewFlag', param: this.ViewFlag },
        { id: 'OwningTTS', param: this.OwningTTS } ]            
        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
        }

   SprintScope(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Transition Plan  > Sprint Scope"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/SprintScope';
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
            { id: 'ViewFlag', param: this.ViewFlag },
            { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  } 
     
   SB(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Transition Plan  > Service Backlog"
    var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/SB';
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }]   ;
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
  }
  
   SPB(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Transition Plan  > Sprint Backlog"
    var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/SPB';
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }]   ;
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
   }
   
   epic(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Transition Plan  > Epic Plan"
    var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/epic';
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }]   ;
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
   }

   sprint(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Transition Plan  > Epic-Sprint Map"
    var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/sprint';
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }]   ;
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
   }

   
   TransitionProfile(tabname) {
    //this.ActiveTab(tabname);
    this.SceenName="Transition Profile"
    this.buttonColor = '#345465'; // desired Color
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main';
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
            { id: 'ViewFlag', param: this.ViewFlag },
            { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }

   TranstionClosure(tabname) {
    this.ActiveTab(tabname);
    this.SceenName="Transition Plan  > Tranistion Closure"
    this.buttonColor = '#345465'; // desired Color
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/TranstionClosure';
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
            { id: 'ViewFlag', param: this.ViewFlag },
            { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
   }

   CompleteWBS(tabname) {
    this.ActiveTab(tabname);
    this.SceenName="Complete WBS"
    this.buttonColor = '#345465'; // desired Color
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/CompleteWBS';
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
            { id: 'ViewFlag', param: this.ViewFlag },
            { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
   }

   stakeholder(tabname) {
    this.ActiveTab(tabname);
    this.SceenName="Master  > Stakeholder Information"
            const sourceComponentPath = '/transition-Main/';
            const destinationComponentPath = '/transition-Main/stakeholder';
            const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },                                           
                                            { id: 'ViewFlag', param: this.ViewFlag },
                                            { id: 'OwningTTS', param: this.OwningTTS } ];
            this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
      }

   stakeholder1(tabname) {
    this.ActiveTab(tabname);
      this.router.navigate(['/transition-Main/stakeholder'], {queryParams : {Id: this.ID}});
  }
  appServer(tabname) {
    this.ActiveTab(tabname);
    this.SceenName="Master  > Application Servers"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/application-server';
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },                                            
                                            { id: 'ViewFlag', param: this.ViewFlag },
                                            { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }

  trainee(tabname) {
    this.ActiveTab(tabname);   
    this.SceenName="Master  > Trainee Information"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/trainee-info';
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }

  appInfo(tabname) {
    this.ActiveTab(tabname); 
    this.SceenName="Master  > Application Information" 
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/application-info';
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },    
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }

  ContraDeliv(tabname) {
    this.ActiveTab(tabname);
    this.SceenName="Master  > Contractual Deliverables"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/ContractualDeliverables';
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },   
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }

  ExecutionTeam(tabname) {
    this.ActiveTab(tabname);
    this.SceenName="Master  > Delivery Team"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/ExecutionTeam';
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },   
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }
ActiveTab(tabname) {
             const tablinks = document.getElementsByClassName('mat-button');
              for (let i = 0; i < tablinks.length; i++) {
            if (tablinks[i].id === tabname) {
              document.getElementById(tabname).classList.add('active');
                   }  else {
                    tablinks[i].className = 'mat-button';
                     }
      }
    }
    transition_R_A_Account(tabname){
      this.ActiveTab(tabname);   
      this.SceenName="Master  > Transition Risk Analysis & Calculation"
        const sourceComponentPath = '/transition-Main/';
      const destinationComponentPath = '/transition-Main/transition_R_A_Account';
      const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },   
      { id: 'ViewFlag', param: this.ViewFlag },
      { id: 'OwningTTS', param: this.OwningTTS } ];
      console.log(sourceComponentPath+"  "+destinationComponentPath )
      this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
    }
  TransitionTeam(tabname) {
       this.ActiveTab(tabname);  
       this.SceenName="Master  > Transition Team" 
      const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/TransitionTeam';

    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },   
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }
 // ##############################  HEALTH & READINESS PARTHA ADDED ##################################################
 showParameterCustomList(tabname){
  this.ActiveTab(tabname);
  this.SceenName="Master  > Health & Readiness Tracking"
  const sourceComponentPath = '/transition-Main';
  const destinationComponentPath = '/transition-Main/parameter-custom-list';
  const destinationComponentParameterArray:any = [{ id: 'Id', param: this.ID }, 
  { id: 'ViewFlag', param: this.ViewFlag },
  { id: 'OwningTTS', param: this.OwningTTS }]    
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

parameterCustomTrackingList(tabname){
  this.ActiveTab(tabname); 
  this.SceenName="Manage Sprint  > Health & Readiness Tracking List"
  var sourceComponentPath = '/transition-Main'; 
  var destinationComponentPath = '/transition-Main/parameter-custom-tracking-list';
  var destinationComponentParameterArray:any = [{ id: 'Id', param: this.ID }, 
  { id: 'ViewFlag', param: this.ViewFlag },
  { id: 'OwningTTS', param: this.OwningTTS }]    
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}
  
 // ############################# APP VS TRAINEE MAPPING #######################################################

showTraineeAndSearchScreen(tabname){
  this.ActiveTab(tabname);
  this.SceenName="Master  > App Vs Trainee Mapping"
  const sourceComponentPath = '/transition-Main';
  const destinationComponentPath = '/transition-Main/app-trainee-mapping';
  const destinationComponentParameterArray:any = []    
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
} 


  ngOnInit() {    
    this.OwningTTS = this.userAccessProfileService.getCurrentTransitionOrg();
    this.ID = this.userAccessProfileService.getIntegrationID();
    this.ViewFlag = this.userAccessProfileService.getViewFlag();
    this.SceenName="Transition Profile";
  }

   ParameterAlert(alertmess){
    alert(alertmess)
    return false;
  }
  
  tabClick(tab) {
    this.OwningTTS = this.userAccessProfileService.getCurrentTransitionOrg();
    this.ID = this.userAccessProfileService.getIntegrationID();
    this.ViewFlag = this.userAccessProfileService.getViewFlag();
    if (tab.index === 0) {          
      this.TransitionProfile('TransitionProfile');     
    }else if (tab.index === 1) {   
      this.TransitionTeam('TransitionTeam');   
      this.selectedTab = tab.index;
      setTimeout(() => {
       if (window.location.pathname === '/transition-Main') {           
        this.selectedTab = 0;
       }
        if(this.ID===null){   
        this.selectedTab = 0;
        window.alert('Please save the Profile before proceeding to other tabs.') 
       }  
      }, 1000);   
    }else if (tab.index === 2) {
      this.SB('SB');    
      this.selectedTab = tab.index;
       this.selectedTab1 = 0;
      setTimeout(() => {
        if (window.location.pathname === '/transition-Main') {          
        this.selectedTab = 0;
        }
        if(this.ID===null){   
        this.selectedTab = 0;
        window.alert('Please save the Profile before proceeding to other tabs.') 
       }  
      }, 1000);  
    }else if (tab.index === 3) {
      this.parameterCustomTrackingList('parameterCustomTrackingList');   
      // this.RAID('RAID');  
      this.selectedTab = tab.index;     
      setTimeout(() => {
       if (window.location.pathname === '/transition-Main') { 
        this.selectedTab = 0;        
       } 
        if(this.ID===null){   
        this.selectedTab = 0;
        window.alert('Please save the Profile before proceeding to other tabs.') 
       }  
      }, 1000);     
    }else if (tab.index === 4) {     
      this.ECAccount('ECAccount');    
      this.selectedTab = tab.index;
      setTimeout(() => {
       if (window.location.pathname === '/transition-Main') { 
        this.selectedTab = 0;                   
       }  
        if(this.ID===null){   
        this.selectedTab = 0;
        window.alert('Please save the Profile before proceeding to other tabs.') 
       }  
      }, 1000);      
    } 
}
    tabClick1(tab1) {     
      
      if (tab1.index === 0) {
        this.selectedTab1 = tab1.index;
     this.SB('SB');
      } else if (tab1.index === 1) {
        this.selectedTab1 = tab1.index;
        this.SPB('SPB');
      }else if (tab1.index === 2) {
        this.selectedTab1 = tab1.index;
        this.epic('epic');
      }else if (tab1.index === 3) {
        this.selectedTab1 = tab1.index;
//         this.sprint('sprint');
        this.TranstionClosure('TranstionClosure');
      }
      else if (tab1.index === 4) {
        this.selectedTab1 = tab1.index;
        this.SprintScope('SprintScope');
      }
      else if (tab1.index === 5) {
        this.selectedTab1 = tab1.index;
        this.SprintLevelPlan1('SprintLevelPlan1');
      }
      else if (tab1.index === 6) {
        this.selectedTab1 = tab1.index;
        this.TranstionClosure('TranstionClosure');
      }
      }
    }
