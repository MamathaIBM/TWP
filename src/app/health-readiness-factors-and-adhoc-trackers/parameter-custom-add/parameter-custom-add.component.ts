import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { Parameter } from 'Vo/parameter';

import { DataandparamService } from 'Services/dataandparam.service';
import { Country } from 'Vo/country';
import { UtilityService } from 'Services/utility.service';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/filter';

import { ParameterService } from 'Services/parameter.service';
import { Keyvalue } from 'Vo/keyvalue';
import { NavtntService } from 'src/app/navtnt.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';

@Component({
  selector: 'app-parameter-custom-add',
  templateUrl: './parameter-custom-add.component.html',
  styleUrls: ['./parameter-custom-add.component.css']
})
export class ParameterCustomAddComponent implements OnInit {

  operatorTypes: Keyvalue[] = [];
  resourceTypes: Keyvalue[] = [];
  yn: Keyvalue[] = [];
  
  parameterId:string='';
  parameters: Parameter[] = [];
  globalParameter ='';
  customOrGlobal:string = 'C';

  parameterAddForm: FormGroup;
  transition_id:string='';


  parameter: Parameter = {
    parameterId:'',
    transitionId:'',
    parameterName:'',
    description:'',
    adoptedField:'',
    adoptionCompleted:'',
    parameterIdGlobal:'',      
    resourceTypeMeasured:'',
    evalTechniqueManual:'Y',
    evaluationExpression:'',        
    RAG_R_operation_1:'',
    RAG_R_operation_2:'',
    RAG_R_cutoff_value_low:'',
    RAG_R_cutoff_value_high:'',
    RAG_A_operation_1:'',
    RAG_A_operation_2:'',
    RAG_A_cutoff_value_low:'',
    RAG_A_cutoff_value_high:'',
    RAG_G_operation_1:'',
    RAG_G_operation_2:'',
    RAG_G_cutoff_value_low:'',
    RAG_G_cutoff_value_high:'',
    customOrGlobal:''
}


  constructor(private navigation: NavtntService, 
              fb: FormBuilder,
              private dataandparamService: DataandparamService, 
              private parameterService: ParameterService,
              private utilityService: UtilityService, 
              private router: Router, 
              private route: ActivatedRoute,
              private userAccessProfileService: UserAccessProfileService) {
    this.parameterAddForm = fb.group({
      parameterName:[''],
      description:[''],
      resourceTypeMeasured:[''],
      evalTechniqueManual:[''],
      evaluationExpression:[''],        
      RAG_R_operation_1:[''],
      RAG_R_operation_2:[''],
      RAG_R_cutoff_value_low:[''],
      RAG_R_cutoff_value_high:[''],
      RAG_A_operation_1:[''],
      RAG_A_operation_2:[''],
      RAG_A_cutoff_value_low:[''],
      RAG_A_cutoff_value_high:[''],
      RAG_G_operation_1:[''],
      RAG_G_operation_2:[''],
      RAG_G_cutoff_value_low:[''],
      RAG_G_cutoff_value_high:''                     
    });
  }

  ngOnInit() {     
         this.transition_id = this.userAccessProfileService.getCurrentTransitionID();                            
         this.resourceTypes = this.utilityService.getResourceTypeList();     
         this.operatorTypes = this.utilityService.getOpeartorTypeList();      
         this.yn = this.utilityService.getYN();
         this.route.queryParams.subscribe((p: any) => {    
          if (p.filter){    
                 this.globalParameter = this.navigation.getParameterValue(p.filter, 'globalParameterList');                         
                 this.customOrGlobal = this.navigation.getParameterValue(p.filter, 'customOrGlobal');                  
          }
      });   

  }


  
  create() {

      this.parameter.parameterName = this.parameterAddForm.controls['parameterName'].value;
      this.parameter.description = this.parameterAddForm.controls['description'].value;
      this.parameter.resourceTypeMeasured = this.parameterAddForm.controls['resourceTypeMeasured'].value;
      this.parameter.evaluationExpression = this.parameterAddForm.controls['evaluationExpression'].value;
      this.parameter.evalTechniqueManual = this.parameterAddForm.controls['evalTechniqueManual'].value;
      this.parameter.RAG_R_operation_1 = this.parameterAddForm.controls['RAG_R_operation_1'].value;
      this.parameter.RAG_R_operation_2 = this.parameterAddForm.controls['RAG_R_operation_2'].value;
      this.parameter.RAG_R_cutoff_value_low = this.parameterAddForm.controls['RAG_R_cutoff_value_low'].value;
      this.parameter.RAG_R_cutoff_value_high = this.parameterAddForm.controls['RAG_R_cutoff_value_high'].value;
      this.parameter.RAG_A_operation_1 = this.parameterAddForm.controls['RAG_A_operation_1'].value;
      this.parameter.RAG_A_operation_2 = this.parameterAddForm.controls['RAG_A_operation_2'].value;
      this.parameter.RAG_R_cutoff_value_low = this.parameterAddForm.controls['RAG_R_cutoff_value_low'].value;
      this.parameter.RAG_A_cutoff_value_high = this.parameterAddForm.controls['RAG_A_cutoff_value_high'].value;
      this.parameter.RAG_G_operation_1 = this.parameterAddForm.controls['RAG_G_operation_1'].value;
      this.parameter.RAG_G_operation_2 = this.parameterAddForm.controls['RAG_G_operation_2'].value;
      this.parameter.RAG_G_cutoff_value_low = this.parameterAddForm.controls['RAG_G_cutoff_value_low'].value;
      this.parameter.RAG_G_cutoff_value_high = this.parameterAddForm.controls['RAG_G_cutoff_value_high'].value;    

      if (this.parameter.parameterName.trim() =='' || this.parameter.resourceTypeMeasured.trim() =='' ){
              alert("Mandatory fields must not be empty!");
      }  
      else{

        // Now check for duplicate record
        var query = "select PARAMETER_CUSTOM_ID from PARAMETER_CUSTOM "+
                    " where PARAMETER_NAME='"+this.parameter.parameterName+"'  "+
                    "  and RESOURCE_TYPE_MEASURED='"+this.parameter.resourceTypeMeasured+"'  "+
                    " and TRANSITION_ID='"+this.transition_id+"'  ";

        this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

                if (tmp_records.length > 0){                  
                     alert("Paramter already exists!");                                    
                }else{
                     this.createParameter();  
                }  
        });
      }                            
  }

  createParameter(){
   
    let customParameter = 
   '{ ' +
        '"PARAMETER_NAME":"'+this.parameter.parameterName+'",'+
        '"DESCRIPTION":"'+this.parameter.description+'",'+
        '"RESOURCE_TYPE_MEASURED":"'+this.parameter.resourceTypeMeasured+'",'+
        '"EVALUATION_EXPRESSION":"'+this.parameter.evaluationExpression+'",'+
        '"EVALUATION_TECHNIQUE_MANUAL":"'+this.parameter.evalTechniqueManual+'",'+
        '"RAG_R_OPERATOR_1":"'+this.parameter.RAG_R_operation_1+'",'+
        '"RAG_R_OPERATOR_2":"'+this.parameter.RAG_R_operation_2+'",'+
        '"RAG_R_CUTOFF_VALUE_LOW":"'+this.parameter.RAG_R_cutoff_value_low+'",'+
        '"RAG_R_CUTOFF_VALUE_HIGH":"'+this.parameter.RAG_R_cutoff_value_high+'",'+
        '"RAG_A_OPERATOR_1":"'+this.parameter.RAG_A_operation_1+'",'+
        '"RAG_A_OPERATOR_2":"'+this.parameter.RAG_A_operation_2+'",'+
        '"RAG_A_CUTOFF_VALUE_LOW":"'+this.parameter.RAG_A_cutoff_value_low+'",'+
        '"RAG_A_CUTOFF_VALUE_HIGH":"'+this.parameter.RAG_A_cutoff_value_high+'",'+
        '"RAG_G_OPERATOR_1":"'+this.parameter.RAG_G_operation_1+'",'+
        '"RAG_G_OPERATOR_2":"'+this.parameter.RAG_G_operation_2+'",'+
        '"RAG_G_CUTOFF_VALUE_LOW":"'+this.parameter.RAG_G_cutoff_value_low+'",'+
        '"RAG_G_CUTOFF_VALUE_HIGH":"'+this.parameter.RAG_G_cutoff_value_high+'"'+
   '}'     


   let transitionParameter = '';


   transitionParameter = 
   '{ ' +              
       '"CUSTOM_PARAMETER":'+customParameter+',  '+
       '"CUSTOM_OR_GLOBAL_QUESTION":"'+this.customOrGlobal+'" '+
   '}' 

   if (this.customOrGlobal ==='G'){

      transitionParameter = 
      '{ ' +
            '"GLOBAL_PARAMETER":'+this.globalParameter+','+
            '"CUSTOM_PARAMETER":'+customParameter+', '+
            '"CUSTOM_OR_GLOBAL_QUESTION":"'+this.customOrGlobal+'" '+
      '}'
        
  }   


    
  


   console.log("transitionParameter "+transitionParameter);

    this.parameterService.appendParameterCustom(transitionParameter,this.transition_id ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

          var sourceComponentPath = '/transition-Main/parameter-custom-add';
          var destinationComponentPath = '/transition-Main/parameter-custom-list';
          var destinationComponentParameterArray = []     
        
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
      
    });

    
  }

  getParameterData(parameter_id){

    console.log(  "getParameterData()"); 

    this.parameterService.getParameterData(parameter_id).subscribe((parameters:any[]) => {
                     
      console.log("##################################################################################################");

    

                     
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
                                    evaluationExpression:'',        
                                    RAG_R_operation_1:'',
                                    RAG_R_operation_2:'',
                                    RAG_R_cutoff_value_low:'',
                                    RAG_R_cutoff_value_high:'',
                                    RAG_A_operation_1:'',
                                    RAG_A_operation_2:'',
                                    RAG_A_cutoff_value_low:'',
                                    RAG_A_cutoff_value_high:'',
                                    RAG_G_operation_1:'',
                                    RAG_G_operation_2:'',
                                    RAG_G_cutoff_value_low:'',
                                    RAG_G_cutoff_value_high:'',
                                    customOrGlobal:''
                                }
           
    
          parameter.parameterId = parameters[i].READINESS_QUESTION_ID ;          
          //parameter.parameterCategory = parameters[i].READINESS_QUESTION_CATEGORY  ;
          //parameter.parameter = parameters[i].READINESS_QUESTION ;
          //parameter.parameterAnswerFieldType = parameters[i].READINESS_QUESTION_ANSWER_FIELD_TYPE ;
          //parameter.parameterDataType = parameters[i].READINESS_QUESTION_ANSWER_DATA_TYPE ;
          //parameter.parameterAnswerSet = parameters[i].READINESS_QUESTION_ANSWER_SET ;           

           this.parameters.push(parameter);
      }
       
      this.parameter = this.parameters.pop();

    });      
  }

  cancel(){

    var sourceComponentPath = '/transition-Main/parameter-custom-add';
    var destinationComponentPath = '/transition-Main/parameter-custom-list';
    var destinationComponentParameterArray = []     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }
}
