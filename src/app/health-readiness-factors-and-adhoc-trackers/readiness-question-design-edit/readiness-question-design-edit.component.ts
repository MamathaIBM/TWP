import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { ReadinessQuestion } from 'Vo/readinessQuestion';

import { DataandparamService } from 'Services/dataandparam.service';
import { Country } from 'Vo/country';
import { UtilityService } from 'Services/utility.service';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/filter';
import { NavtntService } from 'src/app/navtnt.service';
import { ReadinessQuestionService } from 'Services/readinessquestion.service';
import { Keyvalue } from 'Vo/keyvalue';
import { UserAccessProfileService } from 'Services/user-access-profile.service';

@Component({
  selector: 'app-readiness-question-design-edit',
  templateUrl: './readiness-question-design-edit.component.html',
  styleUrls: ['./readiness-question-design-edit.component.css']
})
export class ReadinessQuestionDesignEditComponent implements OnInit {

  fieldTypes: Keyvalue[] = [];
  dataTypes: Keyvalue[] = [];
  parameterId = "";
  parameterName = "";
  
  readinessQuestionId:string='';
  readinessQuestions: ReadinessQuestion[] = [];
  readinessQuestionDesignEditForm: FormGroup;
  readinessQuestion: ReadinessQuestion = {
        readinessQuestionId:'',
        readinessQuestionCategory:'',
        readinessQuestion:'',
        readinessQuestionAnswerFieldType: '',
        readinessQuestionDataType: '',
        readinessQuestionAnswerSet:'',
        readinessQuestionAnswer:'',  
        readinessQuestionDataList:[],
        adopted:''  
  }


  constructor(private navigation: NavtntService, 
              fb: FormBuilder,
              private userAccessProfileService: UserAccessProfileService, 
              private readinessQuestionService: ReadinessQuestionService,
              private utilityService: UtilityService, 
              private router: Router, 
              private route: ActivatedRoute) {
    this.readinessQuestionDesignEditForm = fb.group({
        readinessQuestionId:[''],
        readinessQuestionCategory:[''],
        readinessQuestion:[''],
        readinessQuestionAnswerFieldType: [''],
        readinessQuestionDataType: [''],
        readinessQuestionAnswerSet:['']                        
    });
  }

  ngOnInit() {



    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){

          this.readinessQuestionId = this.navigation.getParameterValue(p.filter, 'readinessQuestionId');   
          this.parameterId = this.navigation.getParameterValue(p.filter, 'parameterId');  
          this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName');   

          /*
          if (this.readinessQuestionId !=='NEW'){            
               this.getReadinessQuestionData(this.readinessQuestionId);
          }  
          */
         this.fieldTypes = this.utilityService.getFieldTypeList();
         this.dataTypes = this.utilityService.getDataTypeList();   
         
         this.getReadinessQuestionCustomData(this.readinessQuestionId);
      }
    });

  }


  
  onSubmit() {

      this.readinessQuestion.readinessQuestion = this.readinessQuestionDesignEditForm.controls['readinessQuestion'].value;
      this.readinessQuestion.readinessQuestionAnswerFieldType = this.readinessQuestionDesignEditForm.controls['readinessQuestionAnswerFieldType'].value;
      this.readinessQuestion.readinessQuestionAnswerSet = this.readinessQuestionDesignEditForm.controls['readinessQuestionAnswerSet'].value;
      this.readinessQuestion.readinessQuestionDataType = this.readinessQuestionDesignEditForm.controls['readinessQuestionDataType'].value;
 

     if (this.readinessQuestion.readinessQuestion.trim() =='' || (this.readinessQuestion.readinessQuestionAnswerFieldType =='') ){
           alert("Mandatory fields can not be empty!");
     }else{
           this.editReadinessQuestion();
     }

      
    
  }

  editReadinessQuestion(){

    
    let readinessQuestionParameter = 
    '{ "READINESS_QUESTION_CUSTOM_ID": "'+ this.readinessQuestionId+'","READINESS_QUESTION_CATEGORY": "'+ this.parameterId+ '","READINESS_QUESTION":"'+ this.readinessQuestion.readinessQuestion+'", '+
    '  "READINESS_QUESTION_ANSWER_FIELD_TYPE": "'+ this.readinessQuestion.readinessQuestionAnswerFieldType+ '","READINESS_QUESTION_ANSWER_DATA_TYPE": "'+ this.readinessQuestion.readinessQuestionDataType + '", '+
    '  "READINESS_QUESTION_ANSWER_SET": "'+ this.readinessQuestion.readinessQuestionAnswerSet+ '"}' ;

    this.readinessQuestionService.editReadinessQuestionCustom(readinessQuestionParameter ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

      var sourceComponentPath = '/transition-Main/readiness-question-design-edit';
      var destinationComponentPath = '/transition-Main/readiness-question-design-list';
      var destinationComponentParameterArray = [{ id: 'parameterId', param: this.parameterId },
                                                { id: 'parameterName', param: this.parameterName }]  
    
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
      //this.router.navigate(['/admin-home/readinessQuestion-list']);
    });

    
  }

  showReadinessQuestionCustomList(){

    var sourceComponentPath = '/transition-Main';
    var destinationComponentPath = '/transition-Main/readiness-question-design-list';
    var destinationComponentParameterArray:any = [{ id: 'parameterId', param: this.parameterId },
                                                  { id: 'parameterName', param: this.parameterName }  ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  getReadinessQuestionCustomData(readinessQuestion_id){

    console.log(  "getReadinessQuestionData()"); 

    this.readinessQuestionService.getReadinessQuestionCustomData(readinessQuestion_id).subscribe((readinessQuestions:any[]) => {                          
                     
      for(var i=0; i<readinessQuestions.length; i++) {

          let readinessQuestion: ReadinessQuestion = { 
                  readinessQuestionId:'',
                  readinessQuestionCategory:'',
                  readinessQuestion:'',
                  readinessQuestionAnswerFieldType: '',
                  readinessQuestionDataType: '',
                  readinessQuestionAnswerSet:'',
                  readinessQuestionAnswer:'',  
                  readinessQuestionDataList:[],
                  adopted:''                
          }
           
    
          readinessQuestion.readinessQuestionId = readinessQuestions[i].READINESS_QUESTION_ID ;          
          readinessQuestion.readinessQuestionCategory = readinessQuestions[i].READINESS_QUESTION_CATEGORY  ;
          readinessQuestion.readinessQuestion = readinessQuestions[i].READINESS_QUESTION ;
          readinessQuestion.readinessQuestionAnswerFieldType = readinessQuestions[i].READINESS_QUESTION_ANSWER_FIELD_TYPE ;
          readinessQuestion.readinessQuestionDataType = readinessQuestions[i].READINESS_QUESTION_ANSWER_DATA_TYPE ;
          readinessQuestion.readinessQuestionAnswerSet = readinessQuestions[i].READINESS_QUESTION_ANSWER_SET ;           

           this.readinessQuestions.push(readinessQuestion);
      }
       
      this.readinessQuestion = this.readinessQuestions.pop();

      this.readinessQuestionDesignEditForm.controls['readinessQuestion'].setValue(this.readinessQuestion.readinessQuestion);
      this.readinessQuestionDesignEditForm.controls['readinessQuestionAnswerFieldType'].setValue(this.readinessQuestion.readinessQuestionAnswerFieldType);
      this.readinessQuestionDesignEditForm.controls['readinessQuestionAnswerSet'].setValue(this.readinessQuestion.readinessQuestionAnswerSet);
      this.readinessQuestionDesignEditForm.controls['readinessQuestionDataType'].setValue(this.readinessQuestion.readinessQuestionDataType);

      if (this.userAccessProfileService.getViewFlag()=='Yes'){
            this.readinessQuestionDesignEditForm.disable();
      }

    });      

  }

  cancel(){
    var sourceComponentPath = '/transition-Main/readiness-question-design-edit';
    var destinationComponentPath = '/transition-Main/readiness-question-design-list';
    var destinationComponentParameterArray = [{ id: 'parameterId', param: this.parameterId },
                                              { id: 'parameterName', param: this.parameterName }]  
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }
}
