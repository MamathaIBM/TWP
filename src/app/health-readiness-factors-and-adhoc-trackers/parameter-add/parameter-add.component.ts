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

@Component({
  selector: 'app-parameter-add',
  templateUrl: './parameter-add.component.html',
  styleUrls: ['./parameter-add.component.css']
})
export class ParameterAddComponent implements OnInit {

  operatorTypes: Keyvalue[] = [];
  resourceTypes: Keyvalue[] = [];
  yn: Keyvalue[] = [];
  
  parameterId:string='';
  parameters: Parameter[] = [];
  parameterAddForm: FormGroup;

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
    customOrGlobal:'',
    
}


  constructor(private navigation: NavtntService, 
              fb: FormBuilder,
              private dataandparamService: DataandparamService, 
              private parameterService: ParameterService,
              private utilityService: UtilityService, 
              private router: Router, 
              private route: ActivatedRoute) {
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
      RAG_G_cutoff_value_high:'',
      submit_button:''                     
    });
  }

  ngOnInit() {                                 
         this.resourceTypes = this.utilityService.getResourceTypeList();     
         this.operatorTypes = this.utilityService.getOpeartorTypeList();      
         this.yn = this.utilityService.getYN();
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


        if (this.parameter.parameterName.trim() == '' || this.parameter.resourceTypeMeasured.trim() == ''){
              alert("Mandatory fields must not be empty");
        }else{              
              this.createParameter();    
        }
      
  }

  createParameter(){
   
    let transitionParameter = 
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


    this.parameterService.createParameter(transitionParameter ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

          var sourceComponentPath = '/admin-home/parameter-add';
          var destinationComponentPath = '/admin-home/parameter-list';
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
    var sourceComponentPath = '/admin-home/parameter-add';
    var destinationComponentPath = '/admin-home/parameter-list';
    var destinationComponentParameterArray = []     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }
}
