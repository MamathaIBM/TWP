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


@Component({
  selector: 'app-app-filter-simple',
  templateUrl: './app-filter-simple.component.html',
  styleUrls: ['./app-filter-simple.component.css']
})
export class AppFilterSimpleComponent implements OnInit {


  appFilterForm: FormGroup;
  appArray: FormArray;
  selected:any;
  parameterCustomId = ""; 
  parameterName = "";                  
  resourceTypeMeasured = "";
  checked_value: boolean;
  appIds="";
  count = 0;
  heading : string;

  
  previousEpic:Application ={
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
  };

  previousSprint:Application ={
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
  };
  
  application: Application = {
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
}

  applications: Application[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'epicName', 'sprintName', 'applicationName', 'applicationId'];

  constructor(private navigation: NavtntService, private fbuilder: FormBuilder, private applicationService: ApplicationService, 
              private userAccessProfileService: UserAccessProfileService, 
              private router: Router, 
              private route: ActivatedRoute) { 

                /*
    this.appFilterForm = fbuilder.group({    
        appArray: fbuilder.array([
          this.fbuilder.control('')
     ])
    })

    */


  }

  ngOnInit() {

    this.checked_value = false;
    this.appFilterForm = this.fbuilder.group({
      appArray:this.fbuilder.array([])                
    });

    this.appArray = this.appFilterForm.get('appArray') as FormArray;
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
  
          this.parameterCustomId = this.navigation.getParameterValue(p.filter, 'parameterId')   
          this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName')                   
          this.resourceTypeMeasured = this.navigation.getParameterValue(p.filter, 'resourceTypeMeasured')   
  console.log( this.resourceTypeMeasured)
          this.getApplicationList(this.userAccessProfileService.getCurrentTransitionID());
       
  
          //alert("this.displayedColumns.length "+this.displayedColumns.length);
      }
    }); 
    
  }

 

  getApplicationList(transitionId){
    if(this.resourceTypeMeasured=== 'application'){
      this.heading = 'Application'
    }else{
      this.heading = 'ST Scope'
    }

    console.log(  "getApplicationList() " + this.resourceTypeMeasured); 

    //console.log("application.epicName "+application.epicName);

    this.applicationService.getApplicationList(transitionId,this.resourceTypeMeasured).subscribe((applications:any[]) => {
                
      var coontrolCounter = -1;
      for(var i=0; i<applications.length; i++) {

          let application: Application = {
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
                appControlCounter:-1                          
          }
           
      
          application.applicationId = applications[i].RESOURCE_ID;          
          application.applicationName = applications[i].RESOURCE_NAME;
          application.sprintId = applications[i].SPRINT_ID;
          application.sprintName = applications[i].SPRINT_NAME;
          //application.epicId = applications[i].FUNC_OPERATION_TYPE;
          application.epicName = applications[i].EPIC_NAME;

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
      this.count= this.applications.length;

      this.checked_value = false;      

    });    
  }


  gotoAppFilterSimple() {
       
    this.router.navigate(['controller-tnt', 'role-functionality-add']);

    
    //var sourceComponentPath = "/admin-home/role-functionality-add";
    //var destinationComponentPath = "/admin-home/role-functionality-add";
    //var destinationComponentParameterArray = [{ id: 'roleId', param: this.roleId } ] 
  }


  onSprintChange(event, application) {

    if(event.checked) {
          for(var i=0; i<application.appList.length; i++) {
            (<FormArray>this.appFilterForm.get('appArray')).controls[application.appList[i]].setValue(true);
          }
    }else{
          for(var i=0; i<application.appList.length; i++) {
            (<FormArray>this.appFilterForm.get('appArray')).controls[application.appList[i]].setValue(false);
          }
    }  

  }


  onEpicChange(event, application) {

    //alert(application.sprintList.length);


    if(event.checked) {
          //this.checked_value = true;
          for(var i=0; i<application.sprintList.length; i++) {
              (<FormArray>this.appFilterForm.get('appArray')).controls[application.sprintList[i]].setValue(true);
              //alert(application.sprintList[i]);
          }

          for(var i=0; i<application.overallAppList.length; i++) {
            (<FormArray>this.appFilterForm.get('appArray')).controls[application.overallAppList[i]].setValue(true);
          }

    }else{
          //this.checked_value = false;
          for(var i=0; i<application.sprintList.length; i++) {
            (<FormArray>this.appFilterForm.get('appArray')).controls[application.sprintList[i]].setValue(false);
          }
          for(var i=0; i<application.overallAppList.length; i++) {
            (<FormArray>this.appFilterForm.get('appArray')).controls[application.overallAppList[i]].setValue(false);
          }
    }
  } 

  onCheckAll(event) {

    
    if(event.checked) {
          for(var i=0; i<this.applications.length; i++) {
              (<FormArray>this.appFilterForm.get('appArray')).controls[this.applications[i].appControlCounter].setValue(true);
          }
    }else{
          for(var i=0; i<this.applications.length; i++) {
            (<FormArray>this.appFilterForm.get('appArray')).controls[this.applications[i].appControlCounter].setValue(false);
          }
    }  
    





}

  track(){


      this.appIds ='';
      var counter =0;
      //Collect App Ids
      for(var i=0; i<this.applications.length; i++) {

          console.log();
          if ((<FormArray>this.appFilterForm.get('appArray')).controls[this.applications[i].appControlCounter].value ){

                if (counter == 0)
                      this.appIds = this.applications[i].applicationId;
                else 
                      this.appIds = this.appIds +","+ this.applications[i].applicationId;
                  
                counter = counter + 1;     
          }        
      }
      //alert("counter "+counter);

      if (counter == 0){
              alert("Please select at least one  "+this.heading+" to track");
      }else{
              this.readinessQuestionTrackingList();
      }

      
    
  }   

  readinessQuestionTrackingLandscapeList(){

    var sourceComponentPath = '/transition-Main';
    var destinationComponentPath = '/transition-Main/readiness-question-tracking-landscape-list';
    var destinationComponentParameterArray:any =  [{ id: 'parameterId', param: this.parameterCustomId },
    { id: 'parameterName', param: this.parameterName },
    { id: 'resourceTypeMeasured', param: this.resourceTypeMeasured },
    { id: 'appIds', param: this.appIds }  ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  readinessQuestionTrackingList(){
console.log(this.appIds)
    var sourceComponentPath = '/transition-Main';
    var destinationComponentPath = '/transition-Main/readiness-question-tracking-list';
    var destinationComponentParameterArray:any =  [{ id: 'parameterId', param: this.parameterCustomId },
    { id: 'parameterName', param: this.parameterName },
    { id: 'resourceTypeMeasured', param: this.resourceTypeMeasured },
    { id: 'appIds', param: this.appIds }  ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  back(){
    var sourceComponentPath = '/transition-Main'; 
    var destinationComponentPath = '/transition-Main/parameter-custom-tracking-list';
    var destinationComponentParameterArray:any = []    
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)  
  }

}
