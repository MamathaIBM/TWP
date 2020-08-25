import { Component, OnInit } from '@angular/core';

import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from 'src/app/navtnt.service';
import { ReadinessQuestion } from 'Vo/readinessquestion';
import { ReadinessQuestionService } from 'Services/readinessquestion.service';
import { ReadinessQuestionsTracker } from 'Vo/readinessquestionstracker';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';


@Component({
  selector: 'app-readiness-question-design-list',
  templateUrl: './readiness-question-design-list.component.html',
  styleUrls: ['./readiness-question-design-list.component.css']
})
export class ReadinessQuestionDesignListComponent implements OnInit {

  transitionId:string="";
  dataLength = 0;
  readinessQuestionTrackerId:string='';
  customOrGlobal:string="C"; //default is custom
  globalCriteriaList='';
  parameterId = "";
  parameterName = "";
  resourceTypeMeasured = "";
  thereAreMoreToAdopt ='N';
  readinessQuestionsToBeSubmitted:any[]=[];
  readinessQuestionDesignListForm: FormGroup;  
  questions: FormArray;
  checked_value:boolean;
  view_flag:boolean;

  readinessQuestion: ReadinessQuestion = {
        readinessQuestionId:'',
        readinessQuestionCategory:'',
        readinessQuestion:'',
        readinessQuestionAnswerFieldType: '',
        readinessQuestionDataType: '',
        readinessQuestionAnswerSet:'' ,
        readinessQuestionAnswer:'',  
        readinessQuestionDataList:[],
        adopted:''   
  }




  readinessQuestions: ReadinessQuestion[] = [];
  existingReadinessQuestionJsonString: string="";

  //readinessQuestionTrackers:ReadinessQuestionsTracker[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [  'readinessQuestion','readinessQuestionAnswerFieldType', 
                                 'readinessQuestionDataType', 'readinessQuestionAnswerSet','readinessQuestionId'];

  constructor(
              private route:ActivatedRoute,private navigation: NavtntService,  
              private fb: FormBuilder,
              private userAccessProfileService: UserAccessProfileService, private readinessQuestionService: ReadinessQuestionService, private dataandparamService: DataandparamService, private router: Router) { 

              this.readinessQuestionDesignListForm = this.fb.group({
                  questions:this.fb.array([])

              })                            
  }

  ngOnInit() {

    this.questions = this.readinessQuestionDesignListForm.get('questions') as FormArray;    
    this.transitionId = this.userAccessProfileService.getCurrentTransitionID();
    this.checked_value = false;

    if (this.userAccessProfileService.getViewFlag()=='No'){
            this.view_flag = false;
    }else{
            this.view_flag = true;
    }
    

    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.parameterId = this.navigation.getParameterValue(p.filter, 'parameterId')   
          this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName')   
          this.resourceTypeMeasured = this.navigation.getParameterValue(p.filter, 'resourceTypeMeasured')   

          this.getReadinessQuestionCustomList( );

      }

    });    
  }





  getReadinessQuestionCustomList(){

    console.log(  "getReadinessQuestionDesginList()"); 


    var applicationParameter = '{'+  
          '"transitionId":"'+this.transitionId+'", '+
          '"parameterId":"'+this.parameterId+'" '+         
    '}'

    //applicationParameter = JSON.stringify(applicationParameter);

    this.readinessQuestionService.getReadinessQuestionDesignList(applicationParameter).subscribe((readinessQuestions:any[]) => {
                     
      this.readinessQuestionsToBeSubmitted = [];
      this.readinessQuestionsToBeSubmitted = readinessQuestions;

      if (readinessQuestions.length>0){
        // Clears old data
        this.readinessQuestions = [];
      }
                    
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
           
          this.customOrGlobal = readinessQuestions[i].CUSTOM_OR_GLOBAL_QUESTION;
          readinessQuestion.readinessQuestionId = readinessQuestions[i].READINESS_QUESTION_CUSTOM_ID; 
          readinessQuestion.adopted = readinessQuestions[i].READINESS_QUESTION_ADOPTED ;                     
          readinessQuestion.readinessQuestionCategory = readinessQuestions[i].READINESS_QUESTION_CATEGORY  ;
          readinessQuestion.readinessQuestion = readinessQuestions[i].READINESS_QUESTION ;
          readinessQuestion.readinessQuestionAnswerFieldType = readinessQuestions[i].READINESS_QUESTION_ANSWER_FIELD_TYPE ;
          readinessQuestion.readinessQuestionDataType = readinessQuestions[i].READINESS_QUESTION_ANSWER_DATA_TYPE ;
          readinessQuestion.readinessQuestionAnswerSet = readinessQuestions[i].READINESS_QUESTION_ANSWER_SET ;
         

          // if there is a single item not addopted yet
          if (readinessQuestion.adopted ==='N'){
              this.thereAreMoreToAdopt = 'Y';
          }

          this.readinessQuestions.push(readinessQuestion);

          if (readinessQuestion.adopted == 'N'){
                //this.readinessQuestionsToBeSubmitted.push(readinessQuestion);    
                this.questions.push(this.fb.group({                                                
                  adopted: new FormControl(true),
                  submitted:true           
                }));        
          }else{
            this.questions.push(this.fb.group({                                                
                adopted: new FormControl(true),
                submitted:false           
            }));
          }



      }

      this.dataSource = new MatTableDataSource(this.readinessQuestions);
      this.dataLength =  this.dataSource.data.length;
      //alert("this.questions.length "+this.questions.length);
      this.checked_value = false;

      //for(var i=0; i<this.questions.length;i++ ){
           //this.questions.controls[i].setValue(true);
           //alert(" Control  "+this.questions.controls['adopted']);
      //}

  });    
}



  deleteReadinessQuestion(readinessQuestion_id:string){

    this.readinessQuestionService.deleteReadinessQuestion(readinessQuestion_id ).subscribe((readinessQuestions:any[]) => {
                     
      console.log(" To JSON "+JSON.stringify(readinessQuestions));
      this.getReadinessQuestionCustomList();
    });
  }


  /*
  onDelete(readinessQuestion) {
    console.log("Delete Clicked "+readinessQuestion.readinessQuestionId);    
    this.deleteReadinessQuestion(readinessQuestion.readinessQuestionId);
  }
  */



 onDelete(headerElement){

  //alert(" headerElement.readinessQuestionId "+headerElement.readinessQuestionId);

  var applicationParameter = '{'+  
        '"readinessQuestionId":"'+headerElement.readinessQuestionId+'", '+
        '"parameterCustomId":"'+this.parameterId+'" '+         
  '}'

  this.readinessQuestionService.checkReadinessQuestionData(applicationParameter ).subscribe((containsData:any[]) => {                      
        if (containsData.length >0){
            if(confirm("You have captured reponses against this question. Data will be lost if you delete. Are you sure to delete?")) {
              var sourceComponentPath = '/transition-Main/readiness-question-design-list';
              var destinationComponentPath = '/transition-Main/readiness-question-tracking-delete';
              var destinationComponentParameterArray =  [
                                                            { id: 'jsonRecords', param: applicationParameter },
                                                            { id: 'transition_id', param: this.transitionId },
                                                            { id: 'parameterId', param: this.parameterId },
                                                            { id: 'resourceTypeMeasured', param: this.resourceTypeMeasured },
                                                            { id: 'parameterName', param: this.parameterName }, 
                                                            { id: 'returnPath', param: sourceComponentPath }                                                    
                                                        ]     
              this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                  
            }
        }    
        else{
          if(confirm("You have NOT captured any reponse against this question. It is safe to delete. Are you sure to delete?")) {
            var sourceComponentPath2 = '/transition-Main/readiness-question-design-list';
            var destinationComponentPath2 = '/transition-Main/readiness-question-tracking-delete';
            var destinationComponentParameterArray2 =  [
                                                          { id: 'jsonRecords', param: applicationParameter },
                                                          { id: 'transition_id', param: this.transitionId },
                                                          { id: 'parameterId', param: this.parameterId },
                                                          { id: 'resourceTypeMeasured', param: this.resourceTypeMeasured },
                                                          { id: 'parameterName', param: this.parameterName }, 
                                                          { id: 'returnPath', param: sourceComponentPath2 }                                                    
                                                      ]     
            this.navigation.goToComponent(sourceComponentPath2,destinationComponentPath2,destinationComponentParameterArray2)                  
          }

        }
  });

  /*
  markAllForDeletion(){

    if (this.activities.length == 0){
      alert("You have not selected any record to delete!");
    }

    if (this.activities.length > 0){

          if(confirm("You have selected "+this.activities.length+" record(s). Are you sure to delete?")) {

                  var X='';
                  for(var i=0; i<this.activities.length; i++) {
                        if (i>0){
                          X = X +',';
                        }  
                        X = X + this.activities[i];
                  }

                  let activitiesParameter = '{"activities":"'+X+'"}'                                                        
                  this.standardActivityService.deleteActivities(activitiesParameter ).subscribe((applications:any[]) => {                     
                        this.getStandardActivityList(this.phase);  
                  });  
          }        
    }     
  }
 */

}



  onUpdate(readinessQuestion) {
    console.log("Update Clicked "+readinessQuestion.readinessQuestionId);    

    var sourceComponentPath = '/transition-Main/readiness-question-design-list';
    var destinationComponentPath = '/transition-Main/readiness-question-design-edit';
    var destinationComponentParameterArray = [{ id: 'readinessQuestionId', param: readinessQuestion.readinessQuestionId },
                                              { id: 'parameterId', param: this.parameterId },
                                              { id: 'parameterName', param: this.parameterName } ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }



  createNew() {
    
    var sourceComponentPath = '/transition-Main/readiness-question-design-list';
    var destinationComponentPath = '/transition-Main/readiness-question-design-add';
    var destinationComponentParameterArray = [{ id: 'parameterId', param: this.parameterId },
                                              { id: 'parameterName', param: this.parameterName } ] 

  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }


  back(){

    var sourceComponentPath = '/transition-Main/readiness-question-adopt';
    const destinationComponentPath = '/transition-Main/parameter-custom-list';
    const destinationComponentParameterArray:any = []    
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }



   save(){

      //alert(this.readinessQuestionDesignListForm.controls['3'].value.checked);

      
      this.globalCriteriaList = JSON.stringify(this.readinessQuestionsToBeSubmitted);
      
      //alert(this.globalCriteriaList);
      console.log(" this.globalCriteriaList "+this.globalCriteriaList);
      var sourceComponentPath = '/transition-Main/readiness-question-design-list';
      var destinationComponentPath = '/transition-Main/readiness-question-design-save';
      var destinationComponentParameterArray = [{ id: 'globalCriteriaList', param: this.globalCriteriaList },
                                                { id: 'transitionId', param: this.transitionId },
                                                { id: 'parameterId', param: this.parameterId },
                                                { id: 'parameterName', param: this.parameterName } ]     
      
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                        
      
  }

  onCheck(event) {
        if(event.checked) {
                //alert("It is checked "+event.source.value);
                console.log("It is checked "+event.source.value);
                this.readinessQuestionsToBeSubmitted[event.source.value].READINESS_QUESTION_ADOPTED='Y';
        } else {     
                //alert("It is not checked ")  
                console.log("It is NOT checked "+event.source.value);
                this.readinessQuestionsToBeSubmitted[event.source.value].READINESS_QUESTION_ADOPTED='N';         
        }
  }

  onCheckAll(event) {

    if(event.checked) {
          this.checked_value = true;
          for(var i=0; i<this.readinessQuestionsToBeSubmitted.length;i++ ){
               this.readinessQuestionsToBeSubmitted[i].READINESS_QUESTION_ADOPTED='Y';
          }
    }else{
          this.checked_value = false;
          for(var l=0; l<this.readinessQuestionsToBeSubmitted.length;l++ ){
              this.readinessQuestionsToBeSubmitted[l].READINESS_QUESTION_ADOPTED='N';
          }
    }  

}


}
