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
  selector: 'app-readiness-question-design-add',
  templateUrl: './readiness-question-design-add.component.html',
  styleUrls: ['./readiness-question-design-add.component.css']
})
export class ReadinessQuestionDesignAddComponent implements OnInit {

  parameterId='';
  parameterName ='';
  fieldTypes: Keyvalue[] = [];
  dataTypes: Keyvalue[] = [];
  readinessQuestionTrackerId:string='';  
  readinessQuestionId:string='';
  transitionId:string='';
  existingReadinessQuestionJsonString:string='';
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
              private route: ActivatedRoute,
              private userAccessProfileService: UserAccessProfileService) {

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


    this.transitionId = this.userAccessProfileService.getCurrentTransitionID();
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){

          this.parameterId = this.navigation.getParameterValue(p.filter, 'parameterId');              
          this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName');              
          this.readinessQuestionTrackerId = this.navigation.getParameterValue(p.filter, 'readinessQuestionTrackerId');              
          this.existingReadinessQuestionJsonString = this.navigation.getParameterValue(p.filter, 'existingReadinessQuestionJsonString');

          /*
          if (this.readinessQuestionId !=='NEW'){            
               this.getReadinessQuestionData(this.readinessQuestionId);
          }  
          */
         this.fieldTypes = this.utilityService.getFieldTypeList();
         this.dataTypes = this.utilityService.getDataTypeList();          
      }
    });


    /*
    this.route.queryParams
    .filter(params => params.readinessQuestionId)
    .subscribe(params => {
      console.log(params); //

      this.readinessQuestionId = params.readinessQuestionId;

      alert("readinessQuestionId in add  param....."+this.readinessQuestionId);


      if (this.readinessQuestionId !=='NEW'){

        alert("this.readinessQuestionId !=='NEW' ");

        this.getReadinessQuestionData(this.readinessQuestionId);
      }      
      
    });
    //this.readinessQuestionId = this.route.snapshot.paramMap.get('id');  
    */
  }


  
  onSubmit() {

        this.readinessQuestion.readinessQuestion = this.readinessQuestionAddForm.controls['readinessQuestion'].value;
        this.readinessQuestion.readinessQuestionAnswerFieldType = this.readinessQuestionAddForm.controls['readinessQuestionAnswerFieldType'].value;
        this.readinessQuestion.readinessQuestionAnswerSet = this.readinessQuestionAddForm.controls['readinessQuestionAnswerSet'].value;
        this.readinessQuestion.readinessQuestionDataType = this.readinessQuestionAddForm.controls['readinessQuestionDataType'].value;
    
        if (this.readinessQuestion.readinessQuestion.trim() =='' || (this.readinessQuestion.readinessQuestionAnswerFieldType =='')){
              alert("Mandatory fields can not be empty!!");
        }else{
              this.appendReadinessQuestionCustom();
        }
    
  }



  appendReadinessQuestionCustom(){

    
    let readinessQuestionCustomParameter = 
    '{ "READINESS_QUESTION_CATEGORY": "'+ this.parameterId+ '","READINESS_QUESTION":"'+ this.readinessQuestion.readinessQuestion+'", '+
    '  "READINESS_QUESTION_ANSWER_FIELD_TYPE": "'+ this.readinessQuestion.readinessQuestionAnswerFieldType+ '","READINESS_QUESTION_ANSWER_DATA_TYPE": "'+ this.readinessQuestion.readinessQuestionDataType + '", '+
    '  "READINESS_QUESTION_ANSWER_SET": "'+ this.readinessQuestion.readinessQuestionAnswerSet+ '",'+
    '  "READINESS_QUESTION_SHORT_FORM": "'+ "test"+ '",'+
    '  "READINESS_QUESTION_DISPLAY_ORDER": "'+ "0"+ '"'+    
    '}';

    this.readinessQuestionService.appendReadinessQuestionCustom(readinessQuestionCustomParameter, this.transitionId ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

      var sourceComponentPath = '/transition-Main/readiness-question-design-add';
      var destinationComponentPath = '/transition-Main/readiness-question-design-list';
      var destinationComponentParameterArray = [{id:'parameterId', param:this.parameterId},
      {id:'parameterName', param:this.parameterName}]     
    
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

    });      

  }

  cancel(){
        var sourceComponentPath = '/transition-Main/readiness-question-design-add';
        var destinationComponentPath = '/transition-Main/readiness-question-design-list';
        var destinationComponentParameterArray = [{id:'parameterId', param:this.parameterId},
        {id:'parameterName', param:this.parameterName}]           
        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }
}
