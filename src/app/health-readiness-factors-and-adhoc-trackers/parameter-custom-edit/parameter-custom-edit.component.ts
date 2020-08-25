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
  selector: 'app-parameter-custom-edit',
  templateUrl: './parameter-custom-edit.component.html',
  styleUrls: ['./parameter-custom-edit.component.css']
})
export class ParameterCustomEditComponent implements OnInit {

  operatorTypes: Keyvalue[] = [];
  resourceTypes: Keyvalue[] = [];
  yn: Keyvalue[] = [];
  
  resourceTypeMeasuredInitialValue:string='';

  parameterId:string='';
  parameters: Parameter[] = [];
  parameterEditForm: FormGroup;

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
              private userAccessProfileService: UserAccessProfileService,  
              private parameterService: ParameterService,
              private utilityService: UtilityService, 
              private router: Router, 
              private route: ActivatedRoute) {
    this.parameterEditForm = fb.group({
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
    
         
         this.resourceTypes = this.utilityService.getResourceTypeList();     
         this.operatorTypes = this.utilityService.getOpeartorTypeList();      
         this.yn = this.utilityService.getYN();
         this.route.queryParams.subscribe((p: any) => {    
            if (p.filter){    
                this.parameterId = this.navigation.getParameterValue(p.filter, 'parameterId');              
                this.getParameterData(this.parameterId);
            }
        });         

  }


  
  update() {       
    
    
      this.parameter.parameterName = this.parameterEditForm.controls['parameterName'].value;
      this.parameter.description = this.parameterEditForm.controls['description'].value;
      this.parameter.resourceTypeMeasured = this.parameterEditForm.controls['resourceTypeMeasured'].value;
      this.parameter.evaluationExpression = this.parameterEditForm.controls['evaluationExpression'].value;
      this.parameter.evalTechniqueManual = this.parameterEditForm.controls['evalTechniqueManual'].value;
      this.parameter.RAG_R_operation_1 = this.parameterEditForm.controls['RAG_R_operation_1'].value;
      this.parameter.RAG_R_operation_2 = this.parameterEditForm.controls['RAG_R_operation_2'].value;
      this.parameter.RAG_R_cutoff_value_low = this.parameterEditForm.controls['RAG_R_cutoff_value_low'].value;
      this.parameter.RAG_R_cutoff_value_high = this.parameterEditForm.controls['RAG_R_cutoff_value_high'].value;
      this.parameter.RAG_A_operation_1 = this.parameterEditForm.controls['RAG_A_operation_1'].value;
      this.parameter.RAG_A_operation_2 = this.parameterEditForm.controls['RAG_A_operation_2'].value;
      this.parameter.RAG_R_cutoff_value_low = this.parameterEditForm.controls['RAG_R_cutoff_value_low'].value;
      this.parameter.RAG_A_cutoff_value_high = this.parameterEditForm.controls['RAG_A_cutoff_value_high'].value;
      this.parameter.RAG_G_operation_1 = this.parameterEditForm.controls['RAG_G_operation_1'].value;
      this.parameter.RAG_G_operation_2 = this.parameterEditForm.controls['RAG_G_operation_2'].value;
      this.parameter.RAG_G_cutoff_value_low = this.parameterEditForm.controls['RAG_G_cutoff_value_low'].value;
      this.parameter.RAG_G_cutoff_value_high = this.parameterEditForm.controls['RAG_G_cutoff_value_high'].value; 

      if (this.parameter.parameterName.trim() =='' || this.parameter.resourceTypeMeasured =='' ){
           alert("Mandatory fields must not be empty!");
      }  
      else{

          if (this.resourceTypeMeasuredInitialValue != this.parameterEditForm.controls['resourceTypeMeasured'].value){
                 this.checkAndUpdate();
          }else{
                 this.updateParameter();  
          }

      }
  }

  updateParameter(){
   
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







    this.parameterService.updateParameterCustom(this.parameterId, transitionParameter ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

          var sourceComponentPath = '/transition-Main/parameter-custom-edit';
          var destinationComponentPath = '/transition-Main/parameter-custom-list';
          var destinationComponentParameterArray = []     
        
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
      
    });

    
  }

  getParameterData(parameter_id){

    console.log(  "getParameterData()"); 

    this.parameterService.getParameterDataCustom(parameter_id).subscribe((parameters:any[]) => {
                     
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
           
    
                                parameter.parameterId = parameters[i].PARAMETER_GLOBAL_ID;
                                parameter.transitionId = parameters[i].TRANSITION_ID;
                                parameter.parameterName = parameters[i].PARAMETER_NAME;
                                parameter.description = parameters[i].DESCRIPTION;
                                parameter.resourceTypeMeasured = parameters[i].RESOURCE_TYPE_MEASURED;

                                this.resourceTypeMeasuredInitialValue = parameter.resourceTypeMeasured;

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

           this.parameters.push(parameter);
      }
       
      this.parameter = this.parameters.pop();

      this.parameterEditForm.controls['parameterName'].setValue(this.parameter.parameterName);
      this.parameterEditForm.controls['description'].setValue(this.parameter.description);
      this.parameterEditForm.controls['resourceTypeMeasured'].setValue(this.parameter.resourceTypeMeasured);
      this.parameterEditForm.controls['evaluationExpression'].setValue(this.parameter.evaluationExpression);
      this.parameterEditForm.controls['evalTechniqueManual'].setValue(this.parameter.evalTechniqueManual);
      this.parameterEditForm.controls['RAG_R_operation_1'].setValue(this.parameter.RAG_R_operation_1);
      this.parameterEditForm.controls['RAG_R_operation_2'].setValue(this.parameter.RAG_R_operation_2);
      this.parameterEditForm.controls['RAG_R_cutoff_value_low'].setValue(this.parameter.RAG_R_cutoff_value_low);
      this.parameterEditForm.controls['RAG_R_cutoff_value_high'].setValue(this.parameter.RAG_R_cutoff_value_high);
      this.parameterEditForm.controls['RAG_A_operation_1'].setValue(this.parameter.RAG_A_operation_1);
      this.parameterEditForm.controls['RAG_A_operation_2'].setValue(this.parameter.RAG_A_operation_2);
      this.parameterEditForm.controls['RAG_R_cutoff_value_low'].setValue(this.parameter.RAG_R_cutoff_value_low);
      this.parameterEditForm.controls['RAG_A_cutoff_value_high'].setValue(this.parameter.RAG_A_cutoff_value_high);
      this.parameterEditForm.controls['RAG_G_operation_1'].setValue(this.parameter.RAG_G_operation_1);
      this.parameterEditForm.controls['RAG_G_operation_2'].setValue(this.parameter.RAG_G_operation_2);
      this.parameterEditForm.controls['RAG_G_cutoff_value_low'].setValue(this.parameter.RAG_G_cutoff_value_low);
      this.parameterEditForm.controls['RAG_G_cutoff_value_high'].setValue(this.parameter.RAG_G_cutoff_value_high); 


      if (this.userAccessProfileService.getViewFlag() =='Yes'){
            this.parameterEditForm.disable();
      }

    });      
  }

  cancel(){
    var sourceComponentPath = '/transition-Main/parameter-custom-edit';
    var destinationComponentPath = '/transition-Main/parameter-custom-list';
    var destinationComponentParameterArray = []     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }



  checkAndUpdate(){

    var query = "select READINESS_QUESTION_TRACKER_ID from READINESS_QUESTION_TRACKER "+
                " where PARAMETER_CUSTOM_ID='"+this.parameterId+"'  ";

    this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        
          if (tmp_records.length == 0){
                  this.updateParameter();                               
          }else{
                  alert(" Questions/Answers are already associated with this parameter. You can't change resource type measured against");
          } 
    });  

  }


}
