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
import { UtilityService } from 'Services/utility.service';


@Component({
  selector: 'app-parameter-custom-list',
  templateUrl: './parameter-custom-list.component.html',
  styleUrls: ['./parameter-custom-list.component.css']
})
export class ParameterCustomListComponent implements OnInit {

  //tran_id:string="-1";
  dataLength = 0;
  customOrGlobal:string='C';
  globalParameterList:string='';
  thereAreMoreToAdopt:string='N';
  
  transitionId:string="";

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


  paraAdoptStatus: ParaAdoptStatus ={
    index:'0',
    adoptionCompleted:'N',
    adoptedField:'N'
  }
  
  
  parameters: Parameter[] = [];
  parametersToBeSubmitted: ParaAdoptStatus[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'parameterName', 'description','resourceTypeMeasured', 
                                 'evalTechniqueManual', 'evaluationExpression','parameterId'];

  constructor(private route:Router,
              private utilityService:UtilityService,
              private navigation: NavtntService, 
              private userAccessProfileService: UserAccessProfileService, 
              private parameterService: ParameterService, 
              private dataandparamService: DataandparamService, 
              private router: Router) { }

  ngOnInit() {

    //this.tran_id = this.dataandparamService.getTransitionId();
    this.transitionId = this.userAccessProfileService.getCurrentTransitionID();

    this.getParameterCustomList();
  }

  getParameterCustomList(){

    console.log(  "getParameterCustomList()"); 

    this.parameterService.getParameterCustomList(this.transitionId).subscribe((parameters:any[]) => {
                     
      console.log("###########################################");

      console.log("parameters.length "+parameters.length); 

      this.parameters = [];
                    
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
          
          /*
          let paraAdoptStatus: ParaAdoptStatus ={
            index:'0',
            adoptionCompleted:'N',
            adoptedField:'N'
          }
          */

          parameter.parameterId = parameters[i].PARAMETER_ID;
          parameter.transitionId = parameters[i].TRANSITION_ID;
          parameter.parameterName = parameters[i].PARAMETER_NAME;          
          parameter.description = parameters[i].DESCRIPTION;
          parameter.adoptedField = parameters[i].ADOPTED_PARAMETER;
          parameter.adoptionCompleted = parameters[i].ADOPTION_COMPLETED;
          parameter.parameterIdGlobal = parameters[i].PARAMETER_GLOBAL_ID;
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
          parameter.customOrGlobal = parameters[i].CUSTOM_OR_GLOBAL_QUESTION;

          this.customOrGlobal = parameters[i].CUSTOM_OR_GLOBAL_QUESTION;

          // if there is a single item not addopted yet
          if (parameter.adoptedField ==='N'){
              this.thereAreMoreToAdopt = 'Y';
          }
         
          this.parameters.push(parameter);
          //this.parametersToBeSubmitted.push(paraAdoptStatus);
      }

      this.dataSource = new MatTableDataSource(this.parameters);
       
      this.dataLength =  this.dataSource.data.length;
      
           //this.clients = clients1;
    });    
  }

  deleteParameterCustom(parameter){

        var query = "select READINESS_QUESTION_CUSTOM_ID from READINESS_QUESTION_CUSTOM "+
                    " where READINESS_QUESTION_CATEGORY='"+parameter.parameterId+"'  "+
                    "  and READINESS_QUESTION_ADOPTED in ('Y', 'NA' ) ";

        this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

        if (tmp_records.length == 0){

            if(confirm(" No questions are associated with this parameter. It is safe to delete. Are you sure to delete "+parameter.parameterName+" ?")) { 
                    this.parameterService.deleteParameterCustom(parameter.parameterId ).subscribe((parameters:any[]) => {                            
                        this.getParameterCustomList();
                    });   
            }              
              
        }else{
                 alert(" Questions are associated with this paremeter, please delete the questions first ");
        } 

        });    
  }

  onDelete(parameter) {
    console.log("Delete Clicked "+parameter.parameterId);    
    this.deleteParameterCustom(parameter);
  }


  onUpdate(parameter) {
    console.log("Update Clicked "+parameter.parameterId);    
    var sourceComponentPath = '/transition-Main/parameter-custom-list';
    var destinationComponentPath = '/transition-Main/parameter-custom-edit';
    var destinationComponentParameterCustomArray = [{ id: 'parameterId', param: parameter.parameterId }, 
                                                    { id: 'resourceTypeMeasured', param: parameter.resourceTypeMeasured }]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterCustomArray)    

  }



  createNew() {
    
    var sourceComponentPath = '/transition-Main/parameter-custom-list';
    var destinationComponentPath = '/transition-Main/parameter-custom-add';
    var destinationComponentParameterArray:any=[{id:'customOrGlobal', param:this.customOrGlobal}];

    if (this.customOrGlobal === 'G'){    
          if (this.parameters.length>0){
                  destinationComponentParameterArray = [{id:'globalParameterList', param:JSON.stringify(this.parameters)},{id:'customOrGlobal', param:this.customOrGlobal}] ;         
          }                 
    }
      
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath, destinationComponentParameterArray)    

  }

  onCheck(event) {
     //alert("Before "+this.parameters[event.source.value].adoptedField);



     
     //alert("After "+this.parameters[event.source.value].adoptedField);
    if(event.checked) {

          //this.parametersToBeSubmitted.push(event.source.value);
          //this.parametersToBeSubmitted[event.source.value].adoptedField = 'Y'
          //alert("Checked "+this.parametersToBeSubmitted[event.source.value].adoptedField);  
          
          let paraAdoptStatus: ParaAdoptStatus ={
                index:event.source.value,
                adoptionCompleted:'N',
                adoptedField:'Y'
          }

          this.parametersToBeSubmitted.push(paraAdoptStatus);

    } else {
          
          this.parametersToBeSubmitted.splice(event.source.value,1);
          //alert("Length "+this.parametersToBeSubmitted.length)
            
    }

  }


  save(){

        if (this.parametersToBeSubmitted.length>0){


          //change the parameter
          for(var j=0; j<this.parametersToBeSubmitted.length; j++){
                 this.parameters[this.parametersToBeSubmitted[j].index].adoptedField = this.parametersToBeSubmitted[j].adoptedField;
                 this.parameters[this.parametersToBeSubmitted[j].index].adoptionCompleted = this.parametersToBeSubmitted[j].adoptionCompleted;
          }

          this.globalParameterList = JSON.stringify(this.parameters);  

          //alert(" this.globalParameterList in custom list "+this.globalParameterList);
          console.log(" this.globalParameterList in custom list "+this.globalParameterList);
          var sourceComponentPath = '/transition-Main/parameter-custom-list';
          var destinationComponentPath = '/transition-Main/parameter-custom-adopt';
          var destinationComponentParameterArray = [{id:'globalParameterList', param:this.globalParameterList}]                   
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                  

      }  
}

showReadinessQuestionCustomList(parameter){

  var sourceComponentPath = '/transition-Main';
  var destinationComponentPath = '/transition-Main/readiness-question-design-list';
  var destinationComponentParameterArray:any = [{ id: 'parameterId', param: parameter.parameterId },
                                                { id: 'parameterName', param: parameter.parameterName }  ]     

  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}


showReadinessQuestionListForAdoption(parameter){


  //alert("parameter.parameterIdGlobal "+parameter.parameterIdGlobal);
  var sourceComponentPath = '/transition-Main';
  var destinationComponentPath = '/transition-Main/readiness-question-adopt';
  var destinationComponentParameterArray:any = [{ id: 'parameterIdGlobal', param: parameter.parameterIdGlobal },
                                                { id: 'parameterId', param: parameter.parameterId },
                                                { id: 'parameterName', param: parameter.parameterName }  ]     

  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

/*
readinessQuestionTrackingList(parameter){

  //var controllerPath = '/controller-tnt'
  var sourceComponentPath = '/transition-Main';
  var destinationComponentPath = '/transition-Main/readiness-question-tracking-list';
  var destinationComponentParameterArray:any =  [{ id: 'parameterId', param: parameter.parameterId },
  { id: 'parameterName', param: parameter.parameterName }  ]     

  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}
*/

}


export class ParaAdoptStatus {
  index:string;
  adoptedField:string;
  adoptionCompleted:string       
}

