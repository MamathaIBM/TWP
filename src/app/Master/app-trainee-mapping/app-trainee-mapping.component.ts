import { Component, OnInit } from '@angular/core';
import { RoleFunctionality } from 'Vo/roleFunctionality';
import { RoleFunctionalityService } from 'Services/roleFunctionality.service';
import { MatTableDataSource } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder, ControlContainer } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { NavtntService } from 'src/app/navtnt.service';
import { Application } from 'Vo/application';
import { ApplicationService } from 'Services/application.service ';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { UtilityService } from 'Services/utility.service';
import { environment } from '../../../environments/environment';
import { TraineeService } from 'Services/trainee.service';
import { Trainee } from 'Vo/trainee';
import { Observable, of } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { ApplicationTraineeSearch } from 'Vo/applicationtraineesearch';
import { Keyvalue } from 'Vo/keyvalue';


@Component({
  selector: 'app-app-trainee-mapping',
  templateUrl: './app-trainee-mapping.component.html',
  styleUrls: ['./app-trainee-mapping.component.css']
})
export class AppTraineeMappingComponent implements OnInit {


  appTraineeFilterForm: FormGroup;
  appFilterForm: FormGroup;
  appArray: FormArray;

  traineeListForm: FormGroup;
  traineeFilterForm: FormGroup;
  traineeArray: FormArray;
  selected:any;
  parameterCustomId = ""; 
  parameterName = "";                  
  resourceTypeMeasured = "";
  checked_value: boolean;
  appIds="";
  traineeIds="";
  count = 0;
  maps:any[];
  selectedAppCounter = 0;
  selectedTraineeCounter = 0;
  baseURL = environment.AdminbaseUrl 
  appDataLoaded: Observable<{}>;
  traineeDataLoaded: Observable<{}>;
  epics:any[]=[];
  sprints:any[]=[];

  
  previousEpic:ApplicationTraineeSearch ={
    applicationId:'',
    applicationName:'',
    sprintId:'',
    sprintName:'',
    epicId:'',
    epicName:'',
    newEpic:false,
    newSprint:false,
    sprintList:[],
    appList:[],
    overallAppList:[],
    epicControlCounter:-1,
    sprintControlCounter:-1,
    appControlCounter:-1,
    fte:0,
    traineeCount:0,
    trainees:'',
    traineeIds:''
  };

  previousSprint:ApplicationTraineeSearch ={
    applicationId:'',
    applicationName:'',
    sprintId:'',
    sprintName:'',
    epicId:'',
    epicName:'',
    newEpic:false,
    newSprint:false,
    sprintList:[],
    appList:[],
    overallAppList:[],
    epicControlCounter:-1,
    sprintControlCounter:-1,
    appControlCounter:-1,
    fte:0,
    traineeCount:0,
    trainees:'',
    traineeIds:''
  };
  
  application: ApplicationTraineeSearch = {
    applicationId:'',
    applicationName:'',
    sprintId:'',
    sprintName:'',
    epicId:'',
    epicName:'',
    newEpic:false,
    newSprint:false,
    sprintList:[],
    appList:[],
    overallAppList:[],
    epicControlCounter:-1,
    sprintControlCounter:-1,
    appControlCounter:-1,    
    fte:0,
    traineeCount:0,
    trainees:'',
    traineeIds:''                   
}

  applications: ApplicationTraineeSearch[] = [];
  trainees: Trainee[] = [];
  dataSource = new MatTableDataSource;  
  displayedColumns: string[] = [ 'epicName', 'sprintName', 'applicationName', 'applicationId'];


  dataSourceTrainee = new MatTableDataSource;  
  displayedColumnsTrainee: string[] = [ 'traineeName', 'traineeEmail', 'traineeSkill', 'traineeId'];
  countTrainee = 0;

  
  traineeName='all';
  traineeEmail='all';
  traineeSkill='all';


  appName ='all';
  mapped = 'all'
  epic ='all';
  sprint ='all';


  constructor(private navigation: NavtntService, 
              private utilityService: UtilityService,
              private fb: FormBuilder, 
              private fbuilder: FormBuilder, 
              private applicationService: ApplicationService, 
              private traineeService: TraineeService,
              private userAccessProfileService: UserAccessProfileService, 
              private router: Router, 
              private route: ActivatedRoute) {  
  }

  ngOnInit() {    


    this.maps = this.utilityService.getYN();
    this.checked_value = false;
    this.appFilterForm = this.fb.group({
        appName:[''],
        mapped:[''],
        epic:[''],
        sprint:['']                         
    });

    this.getEpicsWithSprintIds();
    this.getSprints();

    this.appTraineeFilterForm = this.fbuilder.group({
        appArray:this.fbuilder.array([])                
    });
    this.appArray = this.appTraineeFilterForm.get('appArray') as FormArray;

    this.traineeFilterForm = this.fb.group({
        traineeName:[''],
        traineeEmail:[''],
        traineeSkill:['']                            
    });    
    this.traineeListForm = this.fbuilder.group({
      traineeArray:this.fbuilder.array([])                
    });

    this.traineeArray = this.traineeListForm.get('traineeArray') as FormArray;


    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
  
          this.parameterCustomId = this.navigation.getParameterValue(p.filter, 'parameterId')   
          this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName')                   
          this.resourceTypeMeasured = this.navigation.getParameterValue(p.filter, 'resourceTypeMeasured')   
  
          this.getApplicationList(this.userAccessProfileService.getCurrentTransitionID(),this.appName, this.mapped, this.epic, this.sprint );
          this.getTraineeList(this.userAccessProfileService.getCurrentTransitionID(),'all',this.traineeName, this.traineeEmail, this.traineeSkill);
 
  
          //alert("this.displayedColumns.length "+this.displayedColumns.length);
      }
    }); 
       

  }

  getApplicationList(transitionId, appName, mapped, epic, sprint){

    console.log(  "getApplicationList()"); 

    //console.log("application.epicName "+application.epicName);

    this.applicationService.getApplicationSearchList(transitionId,appName, mapped, epic, sprint).subscribe((applications:any[]) => {                
        //Re -initialize
        this.appName ='all';
        this.epic ='all';
        this.sprint ='all';
        this.mapped ='all';
        this.appFilterForm.controls['epic'].setValue('');
        this.appFilterForm.controls['sprint'].setValue('');
        this.appFilterForm.controls['appName'].setValue('');
        this.appFilterForm.controls['mapped'].setValue('');
        this.processApplications(applications);
    });    
  }


   getAllApp(){
    this.applicationService.getApplicationSearchList(this.userAccessProfileService.getCurrentTransitionID(),'all', 'all','all', 'all').subscribe((applications:any[]) => {                
      this.processApplications(applications);
 });  
   }

  getTraineeList(transitionId,traineeIds,traineeName, traineeEmail, traineeSkill){

    console.log(  "getTraineeList()"); 

    this.traineeService.getTraineeList(transitionId, traineeIds, traineeName, traineeEmail, traineeSkill).subscribe((trainees:any[]) => {                
         this.processTrainees(trainees);
    });    
  }


  gotoAppSearch() {
       
    this.router.navigate(['controller-tnt', 'role-functionality-add']);

    
    //var sourceComponentPath = "/admin-home/role-functionality-add";
    //var destinationComponentPath = "/admin-home/role-functionality-add";
    //var destinationComponentParameterArray = [{ id: 'roleId', param: this.roleId } ] 
  }


  onSprintChange(event, application) {

    if(event.checked) {
          for(var i=0; i<application.appList.length; i++) {
            (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[application.appList[i]].setValue(true);
          }
    }else{
          for(var i=0; i<application.appList.length; i++) {
            (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[application.appList[i]].setValue(false);
          }
    }  

  }


  onEpicChange(event, application) {

    //alert(application.sprintList.length);


    if(event.checked) {
          //this.checked_value = true;
          for(var i=0; i<application.sprintList.length; i++) {
              (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[application.sprintList[i]].setValue(true);
              //alert(application.sprintList[i]);
          }

          for(var i=0; i<application.overallAppList.length; i++) {
            (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[application.overallAppList[i]].setValue(true);
          }

    }else{
          //this.checked_value = false;
          for(var i=0; i<application.sprintList.length; i++) {
            (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[application.sprintList[i]].setValue(false);
          }
          for(var i=0; i<application.overallAppList.length; i++) {
            (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[application.overallAppList[i]].setValue(false);
          }
    }
  } 

  onCheckAll(event) {
    
    if(event.checked) {
          for(var i=0; i<this.applications.length; i++) {
              (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[this.applications[i].appControlCounter].setValue(true);
          }
    }else{
          for(var i=0; i<this.applications.length; i++) {
            (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[this.applications[i].appControlCounter].setValue(false);
          }
    }    
  }

  /*
  onChange(event) {
    
       alert(event.checked);
       alert(event);

        if(event.checked) {
          (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[this.applications[event].appControlCounter].setValue(true);
        }else{
          (<FormArray>this.appTraineeFilterForm.get('appArray')).controls[this.applications[event].appControlCounter].setValue(false);
        }    
  }
  */




  onCheckAllTrainees(event) {
    
    if(event.checked) {
          for(var i=0; i<this.trainees.length; i++) {
              (<FormArray>this.traineeListForm.get('traineeArray')).controls[this.trainees[i].counter].setValue(true);
          }
    }else{
          for(var i=0; i<this.trainees.length; i++) {
            (<FormArray>this.traineeListForm.get('traineeArray')).controls[this.trainees[i].counter].setValue(false);
          }
    }    
  }


  collectAppTraineeIds(){
      this.appIds ='';
      this.selectedAppCounter = 0;
      //Collect App Ids
      for(var i=0; i<this.applications.length; i++) {
            console.log();
            if ((<FormArray>this.appTraineeFilterForm.get('appArray')).controls[this.applications[i].appControlCounter].value ){
                      if (this.selectedAppCounter == 0)
                            this.appIds = this.applications[i].applicationId;
                      else 
                            this.appIds = this.appIds +","+ this.applications[i].applicationId;                 
                      this.selectedAppCounter = this.selectedAppCounter + 1;     
            }        
      }

      //Collect Trainee Ids

      this.traineeIds ='';
      this.selectedTraineeCounter = 0;
      for(var i=0; i<this.trainees.length; i++) {
        console.log();
        if ((<FormArray>this.traineeListForm.get('traineeArray')).controls[this.trainees[i].counter].value ){
                  if (this.selectedTraineeCounter == 0)
                        this.traineeIds = this.trainees[i].traineeId;
                  else 
                        this.traineeIds = this.traineeIds +","+ this.trainees[i].traineeId;
                  this.selectedTraineeCounter = this.selectedTraineeCounter + 1;     
        }        
     }
 
  }   



  gotoUploadTemplateScreen(){

    var sourceComponentPath = '/transition-Main/app-trainee-mapping';
    var destinationComponentPath = '/transition-Main/app-trainee-map-upload';
    var destinationComponentParameterArray:any = []         
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }  


  map(){
        var sourceComponentPath = '/transition-Main/app-trainee-mapping';
        var destinationComponentPath = '/transition-Main/app-trainee-map-edit';
        var destinationComponentParameterArray:any = []    
        
        this.collectAppTraineeIds();  
        if (this.selectedAppCounter == 0){
              alert("Please select at least one App");
        } else if (this.selectedTraineeCounter == 0){
              alert("Please select at least one Trainee");
        }else{              
              destinationComponentParameterArray = [{ id: 'appIds', param: this.appIds },
              { id: 'traineeIds', param: this.traineeIds } ] 
              this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray) ;   
        }  
  } 

  mapAll(){
    var sourceComponentPath = '/transition-Main/app-trainee-mapping';
    var destinationComponentPath = '/transition-Main/app-trainee-map-edit';
    var destinationComponentParameterArray:any = []                     
    destinationComponentParameterArray = [
                                            { id: 'appIds', param: 'all' },
                                            { id: 'traineeIds', param: 'all' } 
                                         ] 
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray) ;   
     
} 



  openApplicationMap(appIds,tmpTraineeIds){

       //alert("openApplicationMap");
        //Collect Trainee Ids
        var traineeIds ='';

        var newTraineeIds = tmpTraineeIds.split(",");
        var selectedTraineeCounter = 0;
        for(var i=0; i<newTraineeIds.length; i++) {
          console.log();
          if (newTraineeIds[i] !='' ){
                    if (selectedTraineeCounter == 0)
                          traineeIds = newTraineeIds[i];
                    else 
                          traineeIds = traineeIds +","+ newTraineeIds[i];

                    selectedTraineeCounter = selectedTraineeCounter + 1;     
          }        
        }

        var sourceComponentPath = '/transition-Main/app-trainee-mapping';
        var destinationComponentPath = '/transition-Main/app-trainee-map-edit';
        var destinationComponentParameterArray:any = [] 
        destinationComponentParameterArray = [{ id: 'appIds', param: appIds },
        { id: 'traineeIds', param: traineeIds } ] 
        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray) ;   
  }

  openTraineeMap(traineeIds,tmpAppIds){

    //Collect App Ids
    var appIds ='';

    var newAppIds = tmpAppIds.split(",");
    var selectedAppCounter = 0;
    for(var i=0; i<newAppIds.length; i++) {
      console.log();
      if (newAppIds[i] !='' ){
                if (selectedAppCounter == 0)
                      appIds = newAppIds[i];
                else 
                      appIds = appIds +","+ newAppIds[i];

                selectedAppCounter = selectedAppCounter + 1;     
      }        
    }

    var sourceComponentPath = '/transition-Main/app-trainee-mapping';
    var destinationComponentPath = '/transition-Main/app-trainee-map-edit';
    var destinationComponentParameterArray:any = [] 
    destinationComponentParameterArray = [{ id: 'appIds', param: appIds },
    { id: 'traineeIds', param: ""+traineeIds } ] 
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray) ;   
}

  searchApp(){

            var query ="";
            var transitionId = this.userAccessProfileService.getCurrentTransitionID();
            //var appName = this.appFilterForm.controls['appName'].value



            if  (this.appFilterForm.controls['appName'].value !=''){
                  this.appName = this.appFilterForm.controls['appName'].value;
            }

            if  (this.appFilterForm.controls['mapped'].value !=''){
                  this.mapped = this.appFilterForm.controls['mapped'].value;                  
            }
            
            if  (this.appFilterForm.controls['epic'].value !=''){
                  this.epic = this.appFilterForm.controls['epic'].value;
            }    

            if  (this.appFilterForm.controls['sprint'].value !=''){

                  this.sprint = this.appFilterForm.controls['sprint'].value;    

                  // Convert entirely to Sprint
                  if (this.epic !='all') {
                         //alert("this.appFilterForm.controls['epic'].value"+this.appFilterForm.controls['epic'].value);
                         this.sprint = this.appFilterForm.controls['epic'].value+","+this.appFilterForm.controls['sprint'].value;
                         this.epic = 'all';
                  }                   

            }else{
                  if  (this.appFilterForm.controls['epic'].value != ''){
                      this.sprint =  this.appFilterForm.controls['epic'].value;
                      this.epic = 'all';
                  }
            }    

            //this.epic = 'all';


            //alert("this.sprint "+this.sprint);
            //alert("this.epic"+this.epic);
            //alert("this.mapped "+this.mapped);
            //alert("this.appName"+this.appName);            

            this.getApplicationList(this.userAccessProfileService.getCurrentTransitionID(),this.appName, this.mapped, this.epic, this.sprint );

            this.appName ='all';
            this.mapped = 'all'
            this.epic ='all';
            this.sprint ='all';

      
  }



  searchTrainee(){
    
        if  (this.traineeFilterForm.controls['traineeName'].value !=''){
              this.traineeName = this.traineeFilterForm.controls['traineeName'].value;
        }
        
        if  (this.traineeFilterForm.controls['traineeEmail'].value !=''){
              this.traineeEmail = this.traineeFilterForm.controls['traineeEmail'].value;
        }    

        if  (this.traineeFilterForm.controls['traineeSkill'].value !=''){
              this.traineeSkill = this.traineeFilterForm.controls['traineeSkill'].value;
        }    

        this.getTraineeList(this.userAccessProfileService.getCurrentTransitionID(),'all',this.traineeName, this.traineeEmail, this.traineeSkill);        
        //Re -initialize
        this.traineeName ='all';
        this.traineeEmail ='all';
        this.traineeSkill ='all';
  }

  getAllTrainee(){
        this.getTraineeList(this.userAccessProfileService.getCurrentTransitionID(),'all','all', 'all','all');        
  }


  processApplications(applications:any[]){

    this.applications =[]; //Clear the previous data
    var coontrolCounter = -1;
    for(var i=0; i<applications.length; i++) {

        let application: ApplicationTraineeSearch = {
              applicationId:'',
              applicationName:'',
              sprintId:'',
              sprintName:'',
              epicId:'',
              epicName:'',
              newEpic:false,
              newSprint:false,
              sprintList:[],
              appList:[],
              overallAppList:[],
              epicControlCounter:-1,
              sprintControlCounter:-1,
              appControlCounter:-1,
              fte:0,
              traineeCount:0,
              trainees:'',
              traineeIds:''                          
        }
         
    
        application.applicationId = applications[i].RESOURCE_ID;          
        application.applicationName = applications[i].RESOURCE_NAME;
        application.sprintId = applications[i].SPRINT_ID;
        application.sprintName = applications[i].SPRINT_NAME;
        //application.epicId = applications[i].FUNC_OPERATION_TYPE;
        application.epicName = applications[i].EPIC_NAME;
        application.fte = applications[i].FTE;
        application.traineeCount = applications[i].TRAINEE_COUNT;
        application.trainees = applications[i].TRAINEES;
        application.traineeIds = applications[i].TRAINEE_IDS;

        this.userAccessProfileService.setAppId(application.applicationName,application.applicationId );

        console.log("application.epicName "+application.epicName);

        if (this.previousEpic.epicName != application.epicName){
             
             application.newEpic = true;
             application.newSprint = true;              
             //application.sprintList.push(application.sprintId);
             coontrolCounter = coontrolCounter + 1;
             application.epicControlCounter = coontrolCounter;
             coontrolCounter = coontrolCounter + 1;
             application.sprintControlCounter = coontrolCounter;
             coontrolCounter = coontrolCounter + 1;
             application.appControlCounter = coontrolCounter;
             application.sprintList.push(""+application.sprintControlCounter);  
             this.previousEpic = application;
             //this.previousEpic.sprintList.push(""+application.sprintControlCounter);  

             application.appList.push(""+application.appControlCounter);
             this.previousEpic.overallAppList.push(""+application.appControlCounter);
             this.previousSprint = application;
             //this.previousSprint.appList.push(""+application.appControlCounter);

             this.appArray.push(this.fbuilder.control(''));
             this.appArray.push(this.fbuilder.control(''));
          
        }else{
              
              if (this.previousSprint.sprintName != application.sprintName ){
                     application.newSprint = true;                       
                     coontrolCounter = coontrolCounter + 1;
                     application.sprintControlCounter = coontrolCounter;
                     coontrolCounter = coontrolCounter + 1;
                     application.appControlCounter = coontrolCounter;
                     application.appList.push(""+application.appControlCounter);                                             
                     this.previousSprint = application;
                     this.previousEpic.sprintList.push(""+application.sprintControlCounter);
                     this.previousEpic.overallAppList.push(""+application.appControlCounter);

                     this.appArray.push(this.fbuilder.control(''));
              }else{
                     coontrolCounter = coontrolCounter + 1;
                     application.appControlCounter = coontrolCounter;                  
                     this.previousSprint.appList.push(""+application.appControlCounter);
                     this.previousEpic.overallAppList.push(""+application.appControlCounter);
              }
        }
                                      
        this.applications.push(application);

        //form Array population
        this.appArray.push(this.fbuilder.control(''));
    }

    this.dataSource = new MatTableDataSource(this.applications);
    this.appDataLoaded = this.loadData().pipe(share());      
    this.count= this.applications.length;

    this.checked_value = false;      

  }


  processTrainees(trainees:any[]){

    this.trainees =[]; //Clear the previous data

    for(var i=0; i<trainees.length; i++) {

        let trainee: Trainee = {
              traineeId:'',
              traineeName:'',  
              traineeEmail:'',
              traineeSkill:'',
              counter:-1,
              appCount:0,  
              fte:0,
              apps:'',
              appIds:'',
        }
         
    
        trainee.traineeId = trainees[i].TRAINEE_ID;          
        trainee.traineeName = trainees[i].TRAINEE_NAME;
        trainee.traineeEmail = trainees[i].TRAINEE_EMAIL;
        trainee.traineeSkill = trainees[i].TRAINEE_SKILLS;
        trainee.counter = i;
        trainee.appCount = trainees[i].APP_COUNT;
        trainee.fte = trainees[i].FTE;
        trainee.apps = trainees[i].APPS;
        trainee.appIds = trainees[i].APP_IDS;

        this.userAccessProfileService.setTraineeId(trainee.traineeEmail.trim(), trainee.traineeId );
                                      
        this.trainees.push(trainee);
        this.traineeArray.push(this.fbuilder.control(''));

    }

    this.dataSourceTrainee = new MatTableDataSource(this.trainees);
    this.countTrainee = this.trainees.length;
    this.traineeDataLoaded = this.loadTraineeData().pipe(share());    
    

  }

  getExcelTemplate() { 
      this.collectAppTraineeIds();  
      if (this.selectedAppCounter == 0){
            alert("Please select at least one App");
      } else if (this.selectedTraineeCounter == 0){
            alert("Please select at least one Trainee");
      }else{
           window.open(this.baseURL+'/getExcelTemplateAppVsTraineeMapping/'+this.userAccessProfileService.getCurrentTransitionID()+'/'+this.appIds+'/'+this.traineeIds); 
      }
  } 

  loadData() {
    // Fake Slow Async Data
    return of({
      appDataLoaded: true
    }).pipe(
            delay(0)
    );
  }
  loadTraineeData() {
    // Fake Slow Async Data
    return of({
      traineeDataLoaded: true
    }).pipe(
            delay(0)
    );
  }

  getDropdownValues(query, list){               
        this.utilityService.getRecords(query).subscribe((records:any[]) => {        
                for(var i=0; i<records.length; i++) {

                        let keyValue: Keyvalue = {
                            id:'',
                            param:''
                        }  

                        keyValue.id = records[i].Categoryvalues;
                        keyValue.param = records[i].Categoryvalues;
                        list.push(keyValue);
                }                                  
        });         
  }

  getEpics(){
     var query = "select epicUNID EPIC_ID, epicName EPIC_NAME "+
                      "from EPICS where IntegrationID='"+this.userAccessProfileService.getCurrentTransitionID()+"' "+
                           " order by EPIC_NAME";     
     this.utilityService.getRecords(query).subscribe((records:any[]) => {        
      for(var i=0; i<records.length; i++) {

              let keyValue: Keyvalue = {
                  id:'',
                  param:''
              }  

              keyValue.id = records[i].EPIC_ID;
              keyValue.param = records[i].EPIC_NAME;
              this.epics.push(keyValue);
      }                                  
    });         
  }

  
  getEpicsWithSprintIds(){
    var query = "select group_concat(SPRINT.sprintUNID) SPRINT_ID, EPICS.epicName  EPIC_NAME "+
                  " from EPICS, SPRINT "+
                        "where EPICS.IntegrationID='"+this.userAccessProfileService.getCurrentTransitionID()+"'  "+
                              "and SPRINT.IntegrationID='"+this.userAccessProfileService.getCurrentTransitionID()+"'  "+
                              " and EPICS.epicUNID=SPRINT.epicUNID "+
                              " group by EPICS.epicName  "+
                              " order by EPICS.epicName  ";       
    this.utilityService.getRecords(query).subscribe((records:any[]) => {        
     for(var i=0; i<records.length; i++) {

             let keyValue: Keyvalue = {
                 id:'',
                 param:''
             }  

             keyValue.id = records[i].SPRINT_ID;
             keyValue.param = records[i].EPIC_NAME;
             this.epics.push(keyValue);
     }                                  
   });         
 }

  getSprints(){
    var query = "select SPRINT.sprintUNID SPRINT_ID, concat(EPICS.epicName,'-', SPRINT.sprintName) SPRINT_NAME "+
                   " from EPICS, SPRINT "+
                       "where EPICS.IntegrationID='"+this.userAccessProfileService.getCurrentTransitionID()+"'  "+
                              "and SPRINT.IntegrationID='"+this.userAccessProfileService.getCurrentTransitionID()+"'  "+
                              " and EPICS.epicUNID=SPRINT.epicUNID "+
                              " order by SPRINT_NAME ";    

    this.utilityService.getRecords(query).subscribe((records:any[]) => {        
        for(var i=0; i<records.length; i++) {

              let keyValue: Keyvalue = {
                  id:'',
                  param:''
              }  

              keyValue.id = records[i].SPRINT_ID;
              keyValue.param = records[i].SPRINT_NAME;
              this.sprints.push(keyValue);
        }                                  
    });
  }

}
