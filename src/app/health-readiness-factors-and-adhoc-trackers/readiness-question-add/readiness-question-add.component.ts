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

@Component({
  selector: 'app-readiness-question-add',
  templateUrl: './readiness-question-add.component.html',
  styleUrls: ['./readiness-question-add.component.css']
})
export class ReadinessQuestionAddComponent implements OnInit {

  fieldTypes: Keyvalue[] = [];
  dataTypes: Keyvalue[] = [];
  parameterId = "";
  parameterName = "";
  
  readinessQuestionId:string='';
  readinessQuestions: ReadinessQuestion[] = [];
  readinessQuestionAddForm: FormGroup;
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
              private dataandparamService: DataandparamService, 
              private readinessQuestionService: ReadinessQuestionService,
              private utilityService: UtilityService, 
              private router: Router, 
              private route: ActivatedRoute) {
    this.readinessQuestionAddForm = fb.group({
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
          this.fieldTypes = this.utilityService.getFieldTypeList();
          this.dataTypes = this.utilityService.getDataTypeList();          
      }
    });

  }


  
  onSubmit() {

    this.readinessQuestion.readinessQuestion = this.readinessQuestionAddForm.controls['readinessQuestion'].value;
    this.readinessQuestion.readinessQuestionAnswerFieldType = this.readinessQuestionAddForm.controls['readinessQuestionAnswerFieldType'].value;
    this.readinessQuestion.readinessQuestionAnswerSet = this.readinessQuestionAddForm.controls['readinessQuestionAnswerSet'].value;
    this.readinessQuestion.readinessQuestionDataType = this.readinessQuestionAddForm.controls['readinessQuestionDataType'].value;


     if (this.readinessQuestion.readinessQuestion.trim() == ''  || this.readinessQuestion.readinessQuestionAnswerFieldType.trim() == ''){
           alert("Mandatory fields must not be empty!");
     }else{
           this.createReadinessQuestion();
     }

  }

  createReadinessQuestion(){    
    let readinessQuestionParameter = 
    '{ "READINESS_QUESTION_CATEGORY": "'+ this.parameterId+ '","READINESS_QUESTION":"'+ this.readinessQuestion.readinessQuestion+'", '+
    '  "READINESS_QUESTION_ANSWER_FIELD_TYPE": "'+ this.readinessQuestion.readinessQuestionAnswerFieldType+ '","READINESS_QUESTION_ANSWER_DATA_TYPE": "'+ this.readinessQuestion.readinessQuestionDataType + '", '+
    '  "READINESS_QUESTION_ANSWER_SET": "'+ this.readinessQuestion.readinessQuestionAnswerSet+ '"}' ;

    this.readinessQuestionService.createReadinessQuestion(readinessQuestionParameter ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

      var sourceComponentPath = '/admin-home/readiness-question-add';
      var destinationComponentPath = '/admin-home/readiness-question-list';
      var destinationComponentParameterArray = [{ id: 'parameterId', param: this.parameterId },
      {id: 'parameterName', param: this.parameterName }]  
    
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
      //this.router.navigate(['/admin-home/readinessQuestion-list']);
    });

    
  }

  cancel(){
    var sourceComponentPath = '/admin-home/readiness-question-add';
    var destinationComponentPath = '/admin-home/readiness-question-list';
    var destinationComponentParameterArray = [{ id: 'parameterId', param: this.parameterId },
    {id: 'parameterName', param: this.parameterName }]  
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }
}
