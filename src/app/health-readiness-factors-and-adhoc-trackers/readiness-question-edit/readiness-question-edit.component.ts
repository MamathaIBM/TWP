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
  selector: 'app-readiness-question-edit',
  templateUrl: './readiness-question-edit.component.html',
  styleUrls: ['./readiness-question-edit.component.css']
})
export class ReadinessQuestionEditComponent implements OnInit {

  fieldTypes: Keyvalue[] = [];
  dataTypes: Keyvalue[] = [];
  parameterId = "";
  parameterName = "";
  
  readinessQuestionId:string='';
  readinessQuestions: ReadinessQuestion[] = [];
  readinessQuestionEditForm: FormGroup;
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
              private readinessQuestionService: ReadinessQuestionService,
              private utilityService: UtilityService, 
              private router: Router, 
              private route: ActivatedRoute,
              ) {
    this.readinessQuestionEditForm = fb.group({
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
         
         this.getReadinessQuestionData(this.readinessQuestionId);
      }
    });


  }


  
  onSubmit() {

      this.readinessQuestion.readinessQuestion = this.readinessQuestionEditForm.controls['readinessQuestion'].value;
      this.readinessQuestion.readinessQuestionAnswerFieldType = this.readinessQuestionEditForm.controls['readinessQuestionAnswerFieldType'].value;
      this.readinessQuestion.readinessQuestionAnswerSet = this.readinessQuestionEditForm.controls['readinessQuestionAnswerSet'].value;
      this.readinessQuestion.readinessQuestionDataType = this.readinessQuestionEditForm.controls['readinessQuestionDataType'].value;      

      if (this.readinessQuestion.readinessQuestion.trim() == '' || this.readinessQuestion.readinessQuestionAnswerFieldType.trim() ==''){
            alert("Mandatory fields must not be empty");
      }else{        
            this.editReadinessQuestion();
      }    
  }

  editReadinessQuestion(){

    
    let readinessQuestionParameter = 
    '{ "READINESS_QUESTION_ID": "'+ this.readinessQuestionId+'","READINESS_QUESTION_CATEGORY": "'+ this.parameterId+ '","READINESS_QUESTION":"'+ this.readinessQuestion.readinessQuestion+'", '+
    '  "READINESS_QUESTION_ANSWER_FIELD_TYPE": "'+ this.readinessQuestion.readinessQuestionAnswerFieldType+ '","READINESS_QUESTION_ANSWER_DATA_TYPE": "'+ this.readinessQuestion.readinessQuestionDataType + '", '+
    '  "READINESS_QUESTION_ANSWER_SET": "'+ this.readinessQuestion.readinessQuestionAnswerSet+ '"}' ;

    this.readinessQuestionService.editReadinessQuestion(readinessQuestionParameter ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

      var sourceComponentPath = '/admin-home/readiness-question-edit';
      var destinationComponentPath = '/admin-home/readiness-question-list';
      var destinationComponentParameterArray = [{ id: 'parameterId', param: this.parameterId },
                                                {id: 'parameterName', param: this.parameterName }]  
    
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
      //this.router.navigate(['/admin-home/readinessQuestion-list']);
    });

    
  }

  getReadinessQuestionData(readinessQuestion_id){

    console.log(  "getReadinessQuestionData()"); 

    this.readinessQuestionService.getReadinessQuestionData(readinessQuestion_id).subscribe((readinessQuestions:any[]) => {
                     
      console.log("##################################################################################################");

    

                     
      for(var i=0; i<readinessQuestions.length; i++) {

          console.log("Value of i"+i);

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


      this.readinessQuestionEditForm.controls['readinessQuestion'].setValue(this.readinessQuestion.readinessQuestion);
      this.readinessQuestionEditForm.controls['readinessQuestionAnswerFieldType'].setValue(this.readinessQuestion.readinessQuestionAnswerFieldType);
      this.readinessQuestionEditForm.controls['readinessQuestionAnswerSet'].setValue(this.readinessQuestion.readinessQuestionAnswerSet);
      this.readinessQuestionEditForm.controls['readinessQuestionDataType'].setValue(this.readinessQuestion.readinessQuestionDataType);

    });      
  }

  cancel(){
    var sourceComponentPath = '/admin-home/readiness-question-edit';
    var destinationComponentPath = '/admin-home/readiness-question-list';
    var destinationComponentParameterArray = [{ id: 'parameterId', param: this.parameterId },
                                              {id: 'parameterName', param: this.parameterName }]  
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

}
