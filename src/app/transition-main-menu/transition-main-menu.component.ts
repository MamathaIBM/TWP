import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { Component,  Inject, OnInit } from '@angular/core';
import { NavtntService } from '../navtnt.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceForm } from 'Services/form';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { DatePipe } from '@angular/common';
import { SprintPlanApplnLevelService } from 'src/app/account_sprint-plan/sprint-plan-appln-level/sprint-plan-appln-level/sprint-plan-appln-level.service';
import { environment } from 'src/environments/environment';
import {RaidService} from 'src/app/Manage-Sprint/raid/raid-module/raid.service';
import { ParameterService } from 'Services/parameter.service';
import { DefineEpicService } from 'src/app/account_sprint-plan/define-epic/define-epic/define-epic.service';
import { TransitionRiskAnalyzerAccountService } from '../transition-risk-analyzer-account/transition-risk-analyzer-account/transition-risk-analyzer-account.service';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';

export interface OTPDialogData {
  OTPStream: string;

}

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
  username: any;
  TransitionAccName: any;
  baseURL = environment.baseUrl
  AdminbaseURL = environment.AdminbaseUrl;
  OTPStream = new FormControl;


  constructor(private navigation: NavtntService,
    private userAccessProfileService: UserAccessProfileService, 
    private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private _frmser: ServiceForm,
    public datepipe: DatePipe,
    private SprintPlanApplnLevelService: SprintPlanApplnLevelService, 
    private _service : RaidService,
    private parameterService: ParameterService,
    private service: DefineEpicService, 
    private TRAService: TransitionRiskAnalyzerAccountService,
    public dialog : MatDialog,) {

   }

   TWBS(tabname){     
    this.ActiveTab(tabname);
    this.SceenName="Master  > Account Level Tailoring  > Tailor WBS"
	  var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/TWBS';
    this.URLvalues();
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }];
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
   }

   TEC(tabname){     
    this.ActiveTab(tabname);
    this.SceenName="Master  > Account Level Tailoring  > Tailor Exit Criteria"
	  var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/TEC';
    this.URLvalues();
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
    this.URLvalues();
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
    this.URLvalues();
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
         this.URLvalues();
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
    this.URLvalues();
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTT   S', param: this.OwningTTS } ]            
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
    }
  



    getReportList(){
  
        this.SceenName="Reports > Custom Reports"
        const sourceComponentPath = '/transition-Main';
        const destinationComponentPath = '/transition-Main/custom-report-list';
        this.URLvalues();      
        var destinationComponentParameterArray:any = [{ id: 'custom_or_admin', param: 'custom' }]  
        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
    }      
    

    SprintLevelPlan(tabname){
      this.ActiveTab(tabname);
      this.SceenName="Transition Plan  >  Sprint Execution Plan  > Scope Task Level Tracking"
      var sourceComponentPath = '/transition-Main/';
      var destinationComponentPath = '/transition-Main/SprintLevelPlan';
      this.URLvalues();
      var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
      { id: 'ViewFlag', param: this.ViewFlag },
      { id: 'OwningTTS', param: this.OwningTTS } ]            
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
      }

      SprintLevelPlan1(tabname){
        this.ActiveTab(tabname);
        this.SceenName="Transition Plan  >  Sprint Execution Plan  > Scope Level Tracking"
        var sourceComponentPath = '/transition-Main/';
        var destinationComponentPath = '/transition-Main/SprintApplnLevelPlan';
        this.URLvalues();
        var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
        { id: 'ViewFlag', param: this.ViewFlag },
        { id: 'OwningTTS', param: this.OwningTTS } ]            
        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
        }

   SprintScope(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Transition Plan  > Sprint Execution Plan  > Sprint Scope"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/SprintScope';
    this.URLvalues();
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
    this.URLvalues();
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
    this.URLvalues();
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }]   ;
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
   }
   
   epic(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Transition Plan  > Sprint Execution Plan  > Epic Plan"
    var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/epic';
    this.URLvalues();
    var destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }]   ;
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)
   }

   sprint(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Transition Plan  > Sprint Execution Plan  > Epic-Sprint Map"
    var sourceComponentPath = '/transition-Main/';
    var destinationComponentPath = '/transition-Main/sprint';
    this.URLvalues();
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
    this.URLvalues();
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
    this.URLvalues();
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
    this.URLvalues();
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
            { id: 'ViewFlag', param: this.ViewFlag },
            { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
   }

   stakeholder(tabname) {
    this.ActiveTab(tabname);
    this.SceenName="Master  > Team Details  > Stakeholder Information"
            const sourceComponentPath = '/transition-Main/';
            const destinationComponentPath = '/transition-Main/stakeholder';
            this.URLvalues();
            const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },                                           
                                            { id: 'ViewFlag', param: this.ViewFlag },
                                            { id: 'OwningTTS', param: this.OwningTTS } ];
            this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
      }

   stakeholder1(tabname) {
    this.ActiveTab(tabname);
    this.URLvalues();
      this.router.navigate(['/transition-Main/stakeholder'], {queryParams : {Id: this.ID}});
  }
  appServer(tabname) {
    this.ActiveTab(tabname);
    this.SceenName="Master  > Application Servers"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/application-server';
    this.URLvalues();
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },                                            
                                            { id: 'ViewFlag', param: this.ViewFlag },
                                            { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }

  trainee(tabname) {
    this.ActiveTab(tabname);   
    this.SceenName="Master  >  Team Details  > Trainee Information"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/trainee-info';
    this.URLvalues();
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }

  stInfo(tabname){
    this.ActiveTab(tabname);
    this.SceenName="Master  > Service Transition Info"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/master-stInfo';
    this.URLvalues();
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },                                            
                                            { id: 'ViewFlag', param: this.ViewFlag },
                                            { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }

  appInfo(tabname) {
    this.ActiveTab(tabname); 
    this.SceenName="Master  > Application Information" 
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/application-info';
    this.URLvalues();
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
    this.URLvalues();
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },   
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }

  ExecutionTeam(tabname) {
    this.ActiveTab(tabname);
    this.SceenName="Master  > Team Details  > Delivery Team"
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/ExecutionTeam';
    this.URLvalues();
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
      this.URLvalues();
      const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },   
      { id: 'ViewFlag', param: this.ViewFlag },
      { id: 'OwningTTS', param: this.OwningTTS } ];
      console.log(sourceComponentPath+"  "+destinationComponentPath )
      this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
    }
  TransitionTeam(tabname) {
       this.ActiveTab(tabname);  
       this.SceenName="Master  > Team Details  > Transition Team" 
      const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/TransitionTeam';
    this.URLvalues();
    const destinationComponentParameterArray = [{ id: 'Id', param: this.ID },   
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS } ];
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
  }
 // ##############################  HEALTH & READINESS PARTHA ADDED ##################################################
 showParameterCustomList(tabname){
  this.ActiveTab(tabname);
  this.SceenName="Master  > Account Level Tailoring  >  Health and Readiness Factor Configuration"
  const sourceComponentPath = '/transition-Main';
  const destinationComponentPath = '/transition-Main/parameter-custom-list';
  this.URLvalues();
  const destinationComponentParameterArray:any = [{ id: 'Id', param: this.ID }, 
  { id: 'ViewFlag', param: this.ViewFlag },
  { id: 'OwningTTS', param: this.OwningTTS }]    
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

parameterCustomTrackingList(tabname){
  this.ActiveTab(tabname); 
  this.SceenName="Manage Sprint  > Health & Readiness Tracking"
  var sourceComponentPath = '/transition-Main'; 
  var destinationComponentPath = '/transition-Main/parameter-custom-tracking-list';
  this.URLvalues();
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
  this.URLvalues();
  const destinationComponentParameterArray:any = []    
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
} 

URLvalues(){
  this.OwningTTS = this.userAccessProfileService.getCurrentTransitionOrg();
    this.ID = this.userAccessProfileService.getIntegrationID();
    this.ViewFlag = this.userAccessProfileService.getViewFlag();
}

exportATSchSummary(){
  var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
  this.SprintPlanApplnLevelService.getexportATSchSummary(this.username,this.ID,this.TransitionAccName+'-'+Ttoday);
  window.open(this.baseURL+'/getexportATSchSummary/'+this.username+"/"+this.ID+"/"+this.TransitionAccName+'-'+Ttoday);
}

exportOverallTranDash(){
  var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
     this.SprintPlanApplnLevelService.getexportOverallTranDash(this.username,this.ID,this.TransitionAccName+'-'+Ttoday);
     window.open(this.baseURL+'/getexportOverallTranDash/'+this.username+"/"+this.ID+"/"+this.TransitionAccName+'-'+Ttoday);
     //var url = this.baseURL+'/getexportOverallTranDash/'+this.username+"/"+this.IntegrationID;
     //window.location.href = url;
}

TranSchExpPPT(){
  var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
  this.SprintPlanApplnLevelService.TranSchExpPPT(this.username,this.ID,'TransitionSchedule-PlanView-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
  //var url = this.baseURL+'/TranSchExpPPT/'+this.username+"/"+this.IntegrationID+"/"+this.TransitionAccName+'.pptx';
  //window.location.href = url;
 window.open(this.baseURL+'/TranSchExpPPT/'+this.username+"/"+this.ID+"/"+'TransitionSchedule-PlanView-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
}

TranSchExpProgressPPT(){
  var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
  this.SprintPlanApplnLevelService.TranSchExpProgressPPT(this.username,this.ID,'TransitionSchedule-ProgressView-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
  //var url = this.baseURL+'/TranSchExpProgressPPT/'+this.username+"/"+this.IntegrationID+'.pptx';
  //window.location.href = url;
 window.open(this.baseURL+'/TranSchExpProgressPPT/'+this.username+"/"+this.ID+"/"+'TransitionSchedule-ProgressView-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
}

RAIDexportAsXLSX(){  
  var TypeRadioButtonValue = 'Both';
  var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
    this._service.getexecelfile(this.username,this.ID,this.TransitionAccName+'-'+Ttoday,TypeRadioButtonValue);
   window.open(this.baseURL+'/getexcelRAID/'+this.username+"/"+this.ID+"/"+this.TransitionAccName+'-'+Ttoday+"/"+TypeRadioButtonValue);
}

HealthexportAsXLSX() {

  var genReport = false;
  this.parameterService.getParameterCustomListForTracking(this.ID).subscribe((parameters:any[]) => {
  if (parameters.length>0){              
    genReport = true;
  } 

  if (genReport){
    var account = this.userAccessProfileService.getClientName();    
    window.open(this.AdminbaseURL+'/getExcelHealthReadinessTracker/'+this.ID+'/all/all'+'/'+encodeURIComponent(account));  
  }else{
    alert("There is no parameter ! Please create parameter to generate report");   
    return false;   
  } 
}); 
} 

exportEpicAsPPT(){
  this.service.getEpics(this.ID).subscribe(res => {
  if( res.length === 0){
    alert("No Records exists for "+this.TransitionAccName+" Account.");
    return false;
   }else{
        var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');               
        this.service.exportEpicAsPPT(this.username,this.ID,'EpicWiseStatusReport-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
        window.open(this.baseURL+'/ExportEpicPPT/'+this.username+'/'+this.ID+'/'+'EpicWiseStatusReport-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
   }
  });
}

TRAExportExcel(){
  this.TRAService.getTRAExportExcel(this.username,this.ID,this.TransitionAccName+".xls");
  window.open(this.baseURL+'/TRAExportExcel/'+this.username+"/"+this.ID+"/"+this.TransitionAccName+".xls");
}

TransProgramDashXLSX() {
  this.SprintPlanApplnLevelService.getTransProgramDash(this.username,this.ID,this.TransitionAccName+".xls");
  window.open(this.baseURL+'/TransProgramDashExport/'+this.username+"/"+this.ID+"/"+this.TransitionAccName+".xls");
}

OTP_OpenDialog(): void {

  const dialogRef = this.dialog.open(OTPStreamDialog, {
    disableClose: true,
    width: '350px',
    data: { OTPStream: this.OTPStream.value }
  });
  
  dialogRef.afterClosed().subscribe(result => {
      if((result==='OverAll') || (result==='AT') || (result==='ST')){
     // console.log(this.username+this.ID+this.TransitionAccName+".docm"+result)
      this.SprintPlanApplnLevelService.OTPDocReport(this.username,this.ID,this.TransitionAccName+".docm&^"+result);
      window.open(this.baseURL+'/OTPDocExport/'+this.username+"/"+this.ID+"/"+this.TransitionAccName+".docm&^"+result);
   }
  });
}
  


  ngOnInit() {    
    this.OwningTTS = this.userAccessProfileService.getCurrentTransitionOrg();
    this.ID = this.userAccessProfileService.getIntegrationID();
    this.ViewFlag = this.userAccessProfileService.getViewFlag();
    this.SceenName="Transition Profile";

    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);

    this.TransitionAccName = JSON.parse(sessionStorage.getItem('ACCOUNTClientName'));
    this.TransitionAccName = decodeURIComponent(this.TransitionAccName._value);
    this.TransitionAccName = this.TransitionAccName.replace(/\s/g,'');
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

    @Component({
      selector: 'transition-main-menu-dailog',
      templateUrl: 'transition-main-menu-dailog.html',
    })
    export class OTPStreamDialog{
    
      OTPStream = new FormControl;
    
      constructor(
        public dialogRef: MatDialogRef<OTPStreamDialog>,
        @Inject(MAT_DIALOG_DATA) public data: OTPDialogData ) {
          this.OTPStream.setValue(data.OTPStream);
      } 
    
      onNoClick(): void {
        this.dialogRef.close();
      }
    
    }
