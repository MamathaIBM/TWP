import { Component, OnInit } from '@angular/core';

import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';

import { Parameter } from 'Vo/parameter';
import { ParameterService } from 'Services/parameter.service';
import { NavtntService } from 'src/app/navtnt.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-parameter-custom-tracking-list',
  templateUrl: './parameter-custom-tracking-list.component.html',
  styleUrls: ['./parameter-custom-tracking-list.component.css']
})
export class ParameterCustomTrackingListComponent implements OnInit {


  dataLength = 0;
  customOrGlobal:string='C';
  globalParameterList:string='';
  transitionId:string="";
  baseURL = environment.AdminbaseUrl 
  genReport = false;

  parameter: Parameter = {
      parameterId:'',
      transitionId:'',
      parameterName:'',
      description:'',
      adoptedField:'',
      adoptionCompleted:'',
      parameterIdGlobal:'',       
      resourceTypeMeasured:'',
      evalTechniqueManual:'',
      evaluationExpression: '',        
      RAG_R_operation_1: '',
      RAG_R_operation_2: '',
      RAG_R_cutoff_value_low: '',
      RAG_R_cutoff_value_high: '',
      RAG_A_operation_1: '',
      RAG_A_operation_2: '',
      RAG_A_cutoff_value_low: '',
      RAG_A_cutoff_value_high: '',
      RAG_G_operation_1: '',
      RAG_G_operation_2: '',
      RAG_G_cutoff_value_low: '',
      RAG_G_cutoff_value_high:'',
      customOrGlobal:''
  }

  parameters: Parameter[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'parameterName', 'description','resourceTypeMeasured','parameterId'];

  constructor(private route:Router,
              private navigation: NavtntService, 
              private userAccessProfileService: UserAccessProfileService, 
              private parameterService: ParameterService,               
              private router: Router) { }

  ngOnInit() {

    //this.tran_id = this.dataandparamService.getTransitionId();
    this.transitionId = this.userAccessProfileService.getCurrentTransitionID();
    this.getParameterCustomTrackingList();
  }

  getParameterCustomTrackingList(){

    console.log(  "getParameterCustomTrackingList()"); 

    this.parameterService.getParameterCustomListForTracking(this.transitionId).subscribe((parameters:any[]) => {
                     
      console.log("###########################################");

      console.log("parameters.length "+parameters.length); 
      
      //Clears old data
      this.parameters = [];
      if (parameters.length>0){              
              this.globalParameterList = JSON.stringify(parameters);
              this.genReport = true;
      }
                    
      for(var i=0; i<parameters.length; i++) {

          console.log("Value of i"+i);


          let parameter: Parameter = {
              parameterId:'',
              transitionId:'',
              parameterName:'',
              description:'',
              adoptedField:'',
              adoptionCompleted:'',
              parameterIdGlobal:'',               
              resourceTypeMeasured:'',
              evalTechniqueManual:'',
              evaluationExpression: '',        
              RAG_R_operation_1: '',
              RAG_R_operation_2: '',
              RAG_R_cutoff_value_low: '',
              RAG_R_cutoff_value_high: '',
              RAG_A_operation_1: '',
              RAG_A_operation_2: '',
              RAG_A_cutoff_value_low: '',
              RAG_A_cutoff_value_high: '',
              RAG_G_operation_1: '',
              RAG_G_operation_2: '',
              RAG_G_cutoff_value_low: '',
              RAG_G_cutoff_value_high:'',
              customOrGlobal:''                      
          }
           

          parameter.parameterId = parameters[i].PARAMETER_ID;
          parameter.transitionId = parameters[i].TRANSITION_ID;
          parameter.parameterName = parameters[i].PARAMETER_NAME;
          parameter.description = parameters[i].DESCRIPTION;
          parameter.resourceTypeMeasured = parameters[i].RESOURCE_TYPE_MEASURED;
          parameter.evalTechniqueManual = parameters[i].EVALUATION_TECHNIQUE_MANUAL;
          parameter.evaluationExpression = parameters[i].EVALUATION_EXPRESSION;
          parameter.RAG_R_operation_1 = parameters[i].RAG_R_OPERATOR_1;
          parameter.RAG_R_operation_2 = parameters[i].RAG_R_OPERATOR_2;
          parameter.RAG_R_cutoff_value_low = parameters[i].RAG_R_CUTOFF_VALUE_LOW;
          parameter.RAG_R_cutoff_value_high = parameters[i].RAG_R_CUTOFF_VALUE_HIGH;
          parameter.RAG_A_operation_1 = parameters[i].RAG_A_OPERATOR_1;
          parameter.RAG_A_operation_2 = parameters[i].RAG_A_OPERATOR_2;
          parameter.RAG_A_cutoff_value_low = parameters[i].RAG_A_CUTOFF_VALUE_LOW;
          parameter.RAG_A_cutoff_value_high = parameters[i].RAG_A_CUTOFF_VALUE_HIGH;
          parameter.RAG_G_operation_1 = parameters[i].RAG_G_OPERATOR_1;
          parameter.RAG_G_operation_2 = parameters[i].RAG_G_OPERATOR_2;
          parameter.RAG_G_cutoff_value_low = parameters[i].RAG_G_CUTOFF_VALUE_LOW;
          parameter.RAG_G_cutoff_value_high = parameters[i].RAG_G_CUTOFF_VALUE_HIGH;

          this.customOrGlobal = parameters[i].CUSTOM_OR_GLOBAL_QUESTION;

         
          this.parameters.push(parameter);
      }



      this.dataSource = new MatTableDataSource(this.parameters);

      this.dataLength =  this.dataSource.data.length;
      
           //this.clients = clients1;
    });    
  }

  deleteParameterCustom(parameter_id:string){

    this.parameterService.deleteParameterCustom(parameter_id ).subscribe((parameters:any[]) => {
                     
      console.log("#####################################");
      this.getParameterCustomTrackingList();
    });
  }

  onDelete(parameter) {
    console.log("Delete Clicked "+parameter.parameterId);    
    this.deleteParameterCustom(parameter.parameterId);
  }


  onUpdate(parameter) {
    console.log("Update Clicked "+parameter.parameterId);    
    var sourceComponentPath = '/admin-home/parameter-list';
    var destinationComponentPath = '/admin-home/parameter-edit';
    var destinationComponentParameterCustomArray = [{ id: 'parameterId', param: parameter.parameterId } ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterCustomArray)    

  }



  createNew() {
    
    var sourceComponentPath = '/transition-Main/parameter-custom-list';
    var destinationComponentPath = '/transition-Main/parameter-custom-add';
    var destinationComponentParameterCustomArray = [] 

  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterCustomArray)    

  }


  save(){
    this.parameterService.createParameterCustom('{"globalParameterList":'+this.globalParameterList+'}', this.transitionId ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

      var sourceComponentPath = '/admin-home/parameter-custom-list';
      var destinationComponentPath = '/admin-home/parameter-custom-list';
      var destinationComponentParameterArray = []     
      
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                  
    });       
}

showReadinessQuestionCustomList(parameter){

  //var controllerPath = '/controller-tnt'
  var sourceComponentPath = '/transition-Main';
  var destinationComponentPath = '/transition-Main/readiness-question-design-list';
  var destinationComponentParameterArray:any = [{ id: 'parameterId', param: parameter.parameterId },
                                                { id: 'parameterName', param: parameter.parameterName }  ]     

  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}



track(parameter){



  if (
    (parameter.resourceTypeMeasured === 'trainee') || 
    (parameter.resourceTypeMeasured === 'epic') || 
    (parameter.resourceTypeMeasured === 'sprint') ||
    (parameter.resourceTypeMeasured === 'ST-sprint')||
    (parameter.resourceTypeMeasured === 'AT-sprint')||
    (parameter.resourceTypeMeasured === 'Others-sprint')  ){
        this.readinessQuestionTrackingList(parameter);
  }

  if ((parameter.resourceTypeMeasured === 'sprintbacklog') || (parameter.resourceTypeMeasured === 'servicebacklog') 
  || (parameter.resourceTypeMeasured === 'transition') || (parameter.resourceTypeMeasured === 'closure')  ){
        this.readinessQuestionTrackingLandscapeList(parameter);
  }

  if (parameter.resourceTypeMeasured === 'application') {
        this.applicationFilterSimple(parameter);
  }
  
  if (parameter.resourceTypeMeasured === 'ST-scope') {
    this.applicationFilterSimple(parameter);
}
if (parameter.resourceTypeMeasured === 'ST-scope-Process') {
  parameter.resourceTypeMeasured = 'Process'
  this.applicationFilterSimple(parameter);
}
if (parameter.resourceTypeMeasured === 'ST-scope-Metrics') {
  parameter.resourceTypeMeasured = 'Metrics'
  this.applicationFilterSimple(parameter);
}
if (parameter.resourceTypeMeasured === 'ST-scope-Reports') {
  parameter.resourceTypeMeasured = 'Reports'
  this.applicationFilterSimple(parameter);
}
if (parameter.resourceTypeMeasured === 'ST-scope-Tools') {
  parameter.resourceTypeMeasured = 'Tools'
  this.applicationFilterSimple(parameter);
}                                        
if (parameter.resourceTypeMeasured === 'ST-scope-Governance') {
  parameter.resourceTypeMeasured = 'Governance'
  this.applicationFilterSimple(parameter);
}
console.log(parameter.resourceTypeMeasured)
  //this.applicationFilter(parameter);

 
}

readinessQuestionTrackingList(parameter){

  var sourceComponentPath = '/transition-Main';
  var destinationComponentPath = '/transition-Main/readiness-question-tracking-list';
  var destinationComponentParameterArray:any =  [{ id: 'parameterId', param: parameter.parameterId },
  { id: 'parameterName', param: parameter.parameterName },
  { id: 'resourceTypeMeasured', param: parameter.resourceTypeMeasured }  ]     

  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}



applicationFilter(parameter){

  var sourceComponentPath = '/transition-Main';
  var destinationComponentPath = '/transition-Main/application-filter';
  var destinationComponentParameterArray:any =  [{ id: 'parameterId', param: parameter.parameterId },
  { id: 'parameterName', param: parameter.parameterName },
  { id: 'resourceTypeMeasured', param: parameter.resourceTypeMeasured }  ]     

  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}


applicationFilterSimple(parameter){

  var sourceComponentPath = '/transition-Main';
  var destinationComponentPath = '/transition-Main/app-filter-simple';
  var destinationComponentParameterArray:any =  [{ id: 'parameterId', param: parameter.parameterId },
  { id: 'parameterName', param: parameter.parameterName },
  { id: 'resourceTypeMeasured', param: parameter.resourceTypeMeasured }  ]     

  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}


readinessQuestionTrackingLandscapeList(parameter){

  var sourceComponentPath = '/transition-Main';
  var destinationComponentPath = '/transition-Main/readiness-question-tracking-landscape-list';
  var destinationComponentParameterArray:any =  [{ id: 'parameterId', param: parameter.parameterId },
  { id: 'parameterName', param: parameter.parameterName },
  { id: 'resourceTypeMeasured', param: parameter.resourceTypeMeasured }  ]     

  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

HealthexportAsXLSX() {
 

    if (this.genReport){

          var account = this.userAccessProfileService.getClientName();    
          window.open(this.baseURL+'/getExcelHealthReadinessTracker/'+this.transitionId+'/all/all'+'/'+encodeURIComponent(account));  
    }      
    else
         alert("There is no parameter ! Please create parameter to generate report");      
} 


}
