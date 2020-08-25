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
import { Observable, of } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { environment } from 'src/environments/environment';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core'



import * as _moment from 'moment';
import { UtilityService } from 'Services/utility.service';
import { DatePipe } from '@angular/common';
const moment =  _moment;





@Component({
      selector: 'app-readiness-question-tracking-landscape-list',
      templateUrl: './readiness-question-tracking-landscape-list.component.html',
      styleUrls: ['./readiness-question-tracking-landscape-list.component.css'],
      providers: [
        // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
        // `MatMomentDateModule` in your applications root module. We provide it at the component level
        // here, due to limitations of our example generation script.
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
      ],
})
export class ReadinessQuestionTrackingLandscapeListComponent implements OnInit {

  transition_id:string="";
  testDate:any;
  parameterCustomId:string="";
  parameterName ="";
  dataLength = 0;
  readinessQuestionTrackerId:string='';
  filtersLoaded: Observable<boolean>;
  dataLoaded: Observable<{}>;
  formControlsRowList:any[];  
  formColList:any[];
  headerKeyValue: KeyValue={};
  resourceTypeMeasured = "";
  keyValueObject = {};
  baseURL = environment.AdminbaseUrl;
  appIds = 'all';

 

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


  readinessQuestionTracker: ReadinessQuestionsTracker = {
    readinessQuestionTrackerId:'',
    transitionId:'',
    applicationId:'',
    parameterCustomId:'',
    readinessQuestionCategory:'',
    multipleLogicalCols:'',
    criteriaMet:'',
    markForChange:false    
}


  readinessQuestions: any[] = [];
  readinessAnswers: any[] = [];

  questions: FormArray;

  existingReadinessQuestionJsonString: string="";
  readinessQuestionTrackingForm: FormGroup;


  //readinessQuestionTrackers:ReadinessQuestionsTracker[] = [];
  dataSource = new MatTableDataSource;
  //displayedColumns: string[] = [ 'readinessQuestionCategory', 'readinessQuestion','readinessQuestionAnswerFieldType', 'readinessQuestionId'];
  displayedColumns:any[]=[];
  username: any; 



  constructor( 
              private fb: FormBuilder, 
              private route:ActivatedRoute,
              private datePipe : DatePipe, 
              private utilityService : UtilityService,
              private navigation: NavtntService, 
              private userAccessProfileService: UserAccessProfileService, 
              private readinessQuestionService: ReadinessQuestionService, 
              private dataandparamService: DataandparamService, 
              private router: Router) { 
  }

  ngOnInit() {


    
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value); 

          this.transition_id = this.userAccessProfileService.getCurrentTransitionID();
          this.readinessQuestionTrackingForm = this.fb.group({
            //readinessQuestionId:['']       
            //"readinessQuestionAnswer"+this.readinessQuestion.readinessQuestionId:''  
            questions:this.fb.array([])
                      
          });

          this.questions = this.readinessQuestionTrackingForm.get('questions') as FormArray;

          this.route.queryParams.subscribe((p: any) => {    
            if (p.filter){

                this.parameterCustomId = this.navigation.getParameterValue(p.filter, 'parameterId')   
                this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName')                   
                this.resourceTypeMeasured = this.navigation.getParameterValue(p.filter, 'resourceTypeMeasured')   

                if (this.resourceTypeMeasured == 'application' || this.resourceTypeMeasured === 'ST-scope' 
                || this.resourceTypeMeasured === 'Process'
                || this.resourceTypeMeasured === 'Metrics'
                || this.resourceTypeMeasured === 'Reports'
                || this.resourceTypeMeasured === 'Tools' ){
                  this.appIds = this.navigation.getParameterValue(p.filter, 'appIds')   

                }

                this.getReadinessQuestionTrackingLandscapeList();

                //alert("this.displayedColumns.length "+this.displayedColumns.length);
            }
          });         
          
  }

  get questionsArray(){
         return this.readinessQuestionTrackingForm.get('questions') as FormArray;
  }

  loadData() {
        // Fake Slow Async Data
        return of({
          dataLoaded: true
        }).pipe(
                delay(0)
        );
  }


  getReadinessQuestionTrackingLandscapeList(){

    console.log( "getReadinessQuestionDesginList()"); 

    


    var jsonParam = '{' +
    '"transitionId":"'+this.transition_id+'", '+
    '"resourceTypeMeasured":"'+this.resourceTypeMeasured+'", '+
    '"parameterId":"'+this.parameterCustomId+'", '+
    '"appIds":"'+this.appIds+'" '+
   '}'

   this.formColList = [];
    // Form the DATA /FORM CONTROL ROWS
    this.readinessQuestionService.getReadinessQuestionTrackingList(jsonParam).subscribe((readinessAnswers:any[]) => {


             // var obj = {};                
              this.headerKeyValue['QUESTION'] = "Question";
              this.displayedColumns.push('QUESTION');


              for(var x=0; x<readinessAnswers.length;x++){ 
                
                  this.headerKeyValue[readinessAnswers[x].RESOURCE_ID] = readinessAnswers[x];
                  this.displayedColumns.push(readinessAnswers[x].RESOURCE_ID);

                  var multipleLogicalColumn = readinessAnswers[x].MULTIPLE_LOGICAL_COLS;

                  //alert("multipleLogicalColumn "+multipleLogicalColumn);
                  if (multipleLogicalColumn!=''){
                        
                        var multipleLogicalColumnForAnswers = JSON.parse(multipleLogicalColumn);
                                      
                        for(var i=0; i<multipleLogicalColumnForAnswers.length; i++) {
                          
                         //if (this.headerKeyValue[''+multipleLogicalColumnForAnswers[i].Q_ID].readinessQuestionAnswerFieldType == 'DATEFIELD'){
                                //this.keyValueObject[''+(readinessAnswers[x].RESOURCE_ID)+'-'+multipleLogicalColumnForAnswers[i].Q_ID]=this.utilityService.getMoment(multipleLogicalColumnForAnswers[i].ANSWER);                                              
                          //}else{
                                this.keyValueObject[''+(readinessAnswers[x].RESOURCE_ID)+'-'+multipleLogicalColumnForAnswers[i].Q_ID]=multipleLogicalColumnForAnswers[i].ANSWER;                                              
                          //}      
                        }
                  }

                  this.keyValueObject[''+(readinessAnswers[x].RESOURCE_ID)+'-'+'RAG'] = readinessAnswers[x].RAG;
              }

              //alert("readinessAnswers.length "+readinessAnswers.length);

      var applicationParameter = '{'+  
          '"transitionId":"'+this.transition_id+'", '+
          '"parameterId":"'+this.parameterCustomId+'" '+         
     '}';

     this.readinessQuestionService.getReadinessQuestionTrackingHeaderList(applicationParameter).subscribe((readinessQuestions:any[]) => {
console.log(readinessQuestions)
        // treat RAG as a question for generic table row traversal
        let ragQuestion: ReadinessQuestion = {
              readinessQuestionId:'RAG',
              readinessQuestionCategory:'',
              readinessQuestion:'Overall RAG',
              readinessQuestionAnswerFieldType: 'DROPDOWN',
              readinessQuestionDataType: 'TEXT',
              readinessQuestionAnswerSet:'R,A,G' ,
              readinessQuestionAnswer:'',  
              readinessQuestionDataList:[],
              adopted:''                        
        }


        var listValues1 = ragQuestion.readinessQuestionAnswerSet.split(",");
        for(var l=0; l<listValues1.length; l++) {
             ragQuestion.readinessQuestionDataList.push({id:listValues1[l], param:listValues1[l]})  
        }  


        this.readinessQuestions.push(ragQuestion);

        // addd the remaining questions
        for(var p=0; p<readinessQuestions.length; p++) {

                let readinessQuestion: ReadinessQuestion = {
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

                readinessQuestion.readinessQuestionId = readinessQuestions[p].READINESS_QUESTION_CUSTOM_ID ;          
                readinessQuestion.readinessQuestionCategory = readinessQuestions[p].READINESS_QUESTION_CATEGORY  ;
                readinessQuestion.readinessQuestion = readinessQuestions[p].READINESS_QUESTION ;
                readinessQuestion.readinessQuestionAnswerFieldType = readinessQuestions[p].READINESS_QUESTION_ANSWER_FIELD_TYPE ;
                readinessQuestion.readinessQuestionDataType = readinessQuestions[p].READINESS_QUESTION_ANSWER_DATA_TYPE ;
                readinessQuestion.readinessQuestionAnswerSet = readinessQuestions[p].READINESS_QUESTION_ANSWER_SET ;

                var listValues = readinessQuestion.readinessQuestionAnswerSet.split(",");
                for(var k=0; k<listValues.length; k++) {
                      readinessQuestion.readinessQuestionDataList.push({id:listValues[k], param:listValues[k]})  
                }       
                
                
                
                for(var x=0; x<readinessAnswers.length;x++){ 
                      if (readinessQuestion.readinessQuestionAnswerFieldType =='DATEFIELD'){
                            this.keyValueObject[''+(readinessAnswers[x].RESOURCE_ID)+'-'+readinessQuestion.readinessQuestionId]=this.utilityService.getMoment(this.keyValueObject[''+(readinessAnswers[x].RESOURCE_ID)+'-'+readinessQuestion.readinessQuestionId]);                                                                          
                      }   
                }    
                
                
                
                this.readinessQuestions.push(readinessQuestion);   
         }




        this.dataSource = new MatTableDataSource(this.readinessQuestions);

        this.formControlsRowList = this.readinessQuestions;
        //alert("readinessQuestions.length "+this.readinessQuestions.length);
        this.dataLength =  this.dataSource.data.length;
        this.dataLoaded = this.loadData().pipe(share());


        //Dynamic controls

        // 1st Row is for RAG

             
              this.questions.push(this.fb.group({                                                
                    questionId:'',                      
                    answer:'',
                    markForChange:false        
              })); 

              //dummy tracker for questions column
              let emptyQuestionTracker: ReadinessQuestionsTracker = {
                    readinessQuestionTrackerId:'',
                    transitionId:'',
                    applicationId:'',
                    parameterCustomId:'',
                    readinessQuestionCategory:'',
                    multipleLogicalCols:'',
                    criteriaMet:'',
                    markForChange:false    
              }

              this.formColList.push(emptyQuestionTracker);


        for(var x=0; x<readinessAnswers.length;x++){ 

                //alert("RAG"+this.keyValueObject[''+(readinessAnswers[x].RESOURCE_ID)+'-'+'RAG'] );
                this.questions.push(this.fb.group({                                                
                  rag:readinessAnswers[x].READINESS_QUESTION_TRACKER_ID,                      
                  answer:this.keyValueObject[''+(readinessAnswers[x].RESOURCE_ID)+'-'+'RAG'], 
                  fieldType:'DROPDOWN', 
                  markForChange:false         
                })); 


                let readinessQuestionTracker: ReadinessQuestionsTracker = {
                  readinessQuestionTrackerId:'',
                  transitionId:'',
                  applicationId:'',
                  parameterCustomId:'',
                  readinessQuestionCategory:'',
                  multipleLogicalCols:'',
                  criteriaMet:'',
                  markForChange:false    
                }

                readinessQuestionTracker.readinessQuestionTrackerId = readinessAnswers[x].READINESS_QUESTION_TRACKER_ID;                                                    
                readinessQuestionTracker.parameterCustomId = readinessAnswers[x].PARAMETER_CUSTOM_ID;
                readinessQuestionTracker.transitionId = readinessAnswers[x].TRANSITION_ID;
                readinessQuestionTracker.applicationId = readinessAnswers[x].RESOURCE_ID;
                readinessQuestionTracker.multipleLogicalCols = readinessAnswers[x].MULTIPLE_LOGICAL_COLS;
                
          
                this.formColList.push(readinessQuestionTracker);

        }  

        // 1st Row ends here 
 
        for(var q=1; q<this.readinessQuestions.length; q++) {    

              this.questions.push(this.fb.group({                                                
                      questionId:'',                      
                      answer:"",  
                      fieldType:this.readinessQuestions[q].readinessQuestionAnswerFieldType,
                      markForChange:false        
              })); 


        
              for(var y=0; y<readinessAnswers.length;y++){ 

                    //alert("value "+this.keyValueObject[''+(readinessAnswers[y].RESOURCE_ID)+'-'+this.readinessQuestions[q].readinessQuestionId]);

                    //alert("fieldType "+this.readinessQuestions[q].readinessQuestionAnswerFieldType);
                    var tmpAnswer:any;

                    if (this.readinessQuestions[q].readinessQuestionAnswerFieldType == 'DATEFIELD'){
                       this.testDate = this.keyValueObject[''+(readinessAnswers[y].RESOURCE_ID)+'-'+this.readinessQuestions[q].readinessQuestionId];
                    }  
                    //if (this.readinessQuestions[q].readinessQuestionAnswerFieldType == 'DATEFIELD'){
                        // tmpAnswer = this.utilityService.getMoment(this.keyValueObject[''+(readinessAnswers[y].RESOURCE_ID)+'-'+this.readinessQuestions[q].readinessQuestionId]);
                    //}else{
                    tmpAnswer = this.keyValueObject[''+(readinessAnswers[y].RESOURCE_ID)+'-'+this.readinessQuestions[q].readinessQuestionId];

                    //alert("tmpAnswer "+tmpAnswer);
                    //}

                    this.questions.push(this.fb.group({                                                
                         questionId:this.readinessQuestions[q].readinessQuestionId,                      
                         answer:tmpAnswer==null?"":tmpAnswer,  
                         fieldType:this.readinessQuestions[q].readinessQuestionAnswerFieldType,
                         markForChange:false        
                    }));                       
        
              }  
            }      
       if (this.userAccessProfileService.getViewFlag() =='Yes'){
            this.readinessQuestionTrackingForm.disable();
       }

     }
    )})

    
  }
    
  

  deleteReadinessQuestion(readinessQuestion_id:string){

    this.readinessQuestionService.deleteReadinessQuestion(readinessQuestion_id ).subscribe((readinessQuestions:any[]) => {
                     
      console.log("#####################################");
      this.getReadinessQuestionTrackingLandscapeList();
    });
  }


  /*
  onDelete(readinessQuestion) {
    console.log("Delete Clicked "+readinessQuestion.readinessQuestionId);    
    this.deleteReadinessQuestion(readinessQuestion.readinessQuestionId);
  }

  */


  onUpdate(readinessQuestion) {
    console.log("Update Clicked "+readinessQuestion.readinessQuestionId);    
    //this.router.navigate(['/admin-home/readinessQuestion-list/'+readinessQuestion.readinessQuestionId]);
    //this.router.navigate(['/admin-home/readinessQuestion-edit/'+readinessQuestion.readinessQuestionId]);
    //this.router.navigate(["/admin-home/readinessQuestion-edit"],{queryParams:{readinessQuestionId:readinessQuestion.readinessQuestionId}})
    //this.router.navigate(["/admin-home/readinessQuestion-edit/"+readinessQuestion.readinessQuestionId])

    //this.router.navigate(["/admin-home/controller-admin"],{queryParams:{destination:'/admin-home/readinessQuestion-list'}}) 

    /*
    var myQueryParams = [
      { id: 'destination', param: '/admin-home/readinessQuestion-edit' },
      { id: 'readinessQuestionId', param: readinessQuestion.readinessQuestionId }      
    ];
    */

    //this.router.navigate(['/admin-home/controller-admin'], {queryParams: {filter: JSON.stringify(myQueryParams)}})


    //var controllerPath = '/controller-tnt'
    var sourceComponentPath = '/admin-home/readiness-question-list';
    var destinationComponentPath = '/admin-home/readiness-question-edit';
    var destinationComponentParameterArray = [{ id: 'readinessQuestionId', param: readinessQuestion.readinessQuestionId } ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }



  createNew(readinessQuestionTrackerId) {
    //console.log("copyAndCreateNew Clicked "+readinessQuestionId);   
    //this.router.navigate(["/admin-home/readinessQuestion-add"],{queryParams:{readinessQuestionId:readinessQuestionId}}) 
    //this.router.navigate(['controller-tnt', 'readinessQuestion-add/'+readinessQuestionId]);

    var sourceComponentPath = '/admin-home/readiness-question-design-list';
    var destinationComponentPath = '/admin-home/readiness-question-design-add';
    var destinationComponentParameterArray = [{ id: 'readinessQuestionTrackerId', param: this.readinessQuestionTrackerId },
                                              { id: 'existingReadinessQuestionJsonString', param: this.existingReadinessQuestionJsonString } ] 

  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }


   save(){

    //alert("Inside save");
    var overallColChangeCounter = 0;
    var overallJSON = "";
    for(var j=0; j<this.formColList.length; j++) {

            if (this.formColList[j].markForChange){
                    var response = "";
                    var count = 0;                  
                    var numberOfRows = this.formControlsRowList.length;
                    // because of RAG column one less number of columns to be considered
                    for(var i=1; i<numberOfRows; i++) {
                            if (count>0){
                                response = response +",";
                            }

                            //alert(i*(this.displayedColumns.length)+j);

                            const fieldType = (this.readinessQuestionTrackingForm.get('questions'))['controls'][i*(this.displayedColumns.length)+j].value.fieldType;


                            if (fieldType =='DATEFIELD' ){
                                //inputData = this.datePipe.transform((<FormArray>this.readinessQuestionTrackingForm.get('questions')).controls[j*(numberOfColumns)+(j*2)+(i+1)].value.answer, 'MM-dd-yyyy');
                                //alert("dateData"+this.datePipe.transform(( this.readinessQuestionTrackingForm.get('questions'))['controls'][i*(this.displayedColumns.length)+j].value.answer));

                                var dateInput = "";
                                if (isNaN((<FormArray>this.readinessQuestionTrackingForm.get('questions'))['controls'][i*(this.displayedColumns.length)+j].value.answer)==false ){
                                      dateInput = this.datePipe.transform((<FormArray>this.readinessQuestionTrackingForm.get('questions'))['controls'][i*(this.displayedColumns.length)+j].value.answer, 'MM-dd-yyyy');                                      
                                }

                                  response = response + '{' +
                                  '"Q_ID":"'+this.formControlsRowList[i].readinessQuestionId+'",'+          
                                  '"ANSWER":"'+dateInput+
                                  '"}';
                            }
                            else{
                                   response = response + '{' +
                                  '"Q_ID":"'+this.formControlsRowList[i].readinessQuestionId+'",'+          
                                  '"ANSWER":"'+(this.readinessQuestionTrackingForm.get('questions'))['controls'][i*(this.displayedColumns.length)+j].value.answer+
                                  '"}';
                            }

                              //alert("XXX "+(j*(numberOfColumns)+(j*2)+(i+1)));

                            //alert("response "+response);   
                           // Update the readiness list with the latest change
                           // (this.readinessAnswers[j])[''+this.formControlsColumnList[i].READINESS_QUESTION_CUSTOM_ID] = (this.readinessQuestionTrackingForm.get('questions')).controls[j*(numberOfColumns)+i+1].value.answer;

                            count = count + 1;      
                    }
                    var multipleColumnsValue = '[' + response + ']'
                    //alert("multipleColumnsValue"+multipleColumnsValue);


                    //var rag = this.formControlsColumnList[numberOfColumns-1];
                    //alert("numberOfColumns "+numberOfColumns);
                    //alert("counter"+((j+1)*(numberOfColumns)+j*2+1));
                    var rag = (this.readinessQuestionTrackingForm.get('questions'))['controls'][j].value.answer;
                    //alert("j*(numberOfColumns)+(numberOfColumns-1)+1"+j*(numberOfColumns)+(numberOfColumns)+1);

                    if (overallColChangeCounter>0){
                            overallJSON = overallJSON +",";
                    }

                    overallJSON = overallJSON + '{' +
                                            '"READINESS_QUESTION_TRACKER_ID":"'+this.formColList[j].readinessQuestionTrackerId+'",'+          
                                            '"PARAMETER_CUSTOM_ID":"'+this.parameterCustomId+'",'+   
                                            '"TRANSITION_ID":"'+this.transition_id+'",'+   
                                            '"READINESS_QUESTION_MEASURED_AGAINST_PARAMETER_VALUE":"'+this.formColList[j].applicationId+'",'+   
                                            '"MULTIPLE_LOGICAL_COLS":'+multipleColumnsValue+', '+   
                                            '"RAG":"'+rag+'" '+   
                    '}';

                    //alert("overallJSON "+overallJSON);

                    overallColChangeCounter = overallColChangeCounter + 1;
            }               
  }

  overallJSON = '[' + overallJSON + ']';


  if (overallColChangeCounter>0){ // Then only submit

    
    //alert("overallJSON "+overallJSON);
    var parameterJSON ='{' +
                        '"PARAMETER":'+overallJSON +''+                  
                       '}'
                       console.log("overall Json "+parameterJSON);
    
      console.log("##################################################################################################");

        // mark the row change for false 
        for(var n=0; n<this.formColList.length; n++) {
            if (this.formColList[n].markForChange){
                  this.formColList[n].markForChange = false;
            }
        } 
    
      
      var sourceComponentPath = '/transition-Main/readiness-question-tracking-landscape-list';
      var destinationComponentPath = '/transition-Main/readiness-question-tracking-save';
      var destinationComponentParameterArray =  [
                                                    { id: 'jsonRecords', param: parameterJSON },
                                                    { id: 'transition_id', param: this.transition_id },
                                                    { id: 'parameterId', param: this.parameterCustomId },
                                                    { id: 'resourceTypeMeasured', param: this.resourceTypeMeasured },
                                                    { id: 'parameterName', param: this.parameterName },
                                                    { id: 'returnPath', param: sourceComponentPath },
                                                    { id: 'appIds', param: this.appIds }   
                                                ]     
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                            
  }






  }

  onChange(colIndex){

        //alert("onChange called "+rowIndex);

        //alert(" this.formRowList[rowIndex].markForChange  "+this.formRowList[rowIndex].markForChange );
        //alert(" this.formRowList[rowIndex].readinessQuestionTrackerId "+this.formRowList[rowIndex].readinessQuestionTrackerId);
        this.formColList[colIndex].markForChange = true;        
        //alert("onChange is done")
  }


  addOrUpdateReadinessQuestionTrackingLandscape(){ 
  }

  readinessQuestionTrackingList(parameterId,parameterName, resourceTypeMeasured){

    var sourceComponentPath = '/transition-Main/readiness-question-tracking-landscape-list';
    var destinationComponentPath = '/transition-Main/readiness-question-tracking-list';
    var destinationComponentParameterArray:any =  [{ id: 'parameterId', param: parameterId },
    { id: 'parameterName', param: parameterName },
    { id: 'resourceTypeMeasured', param: resourceTypeMeasured },
    { id: 'appIds', param: this.appIds }  ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }


  onDelete(headerElement){

    //alert(" headerElement.readinessQuestionId "+headerElement.readinessQuestionId);

    var applicationParameter = '{'+  
          '"readinessQuestionId":"'+headerElement.readinessQuestionId+'", '+
          '"parameterCustomId":"'+this.parameterCustomId+'" '+         
    '}'


    //alert(" applicationParameter "+applicationParameter);

    this.readinessQuestionService.checkReadinessQuestionData(applicationParameter ).subscribe((containsData:any[]) => {                      
          if (containsData.length >0){
              if(confirm("You have captured reponses against this question. Data will be lost if you delete. Are you sure to delete?")) {
                var sourceComponentPath = '/transition-Main/readiness-question-tracking-list';
                var destinationComponentPath = '/transition-Main/readiness-question-tracking-delete';
                var destinationComponentParameterArray =  [
                                                              { id: 'jsonRecords', param: applicationParameter },
                                                              { id: 'transition_id', param: this.transition_id },
                                                              { id: 'parameterId', param: this.parameterCustomId },
                                                              { id: 'resourceTypeMeasured', param: this.resourceTypeMeasured },
                                                              { id: 'parameterName', param: this.parameterName }, 
                                                              { id: 'returnPath', param: sourceComponentPath }                                                    
                                                          ]     
                this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                  
              }
          }    
          else{
            if(confirm("You have NOT captured any reponse against this question. It is safe to delete. Are you sure to delete?")) {
              var sourceComponentPath2 = '/transition-Main/readiness-question-tracking-list';
              var destinationComponentPath2 = '/transition-Main/readiness-question-tracking-delete';
              var destinationComponentParameterArray2 =  [
                                                            { id: 'jsonRecords', param: applicationParameter },
                                                            { id: 'transition_id', param: this.transition_id },
                                                            { id: 'parameterId', param: this.parameterCustomId },
                                                            { id: 'resourceTypeMeasured', param: this.resourceTypeMeasured },
                                                            { id: 'parameterName', param: this.parameterName }, 
                                                            { id: 'returnPath', param: sourceComponentPath2 }                                                    
                                                        ]     
              this.navigation.goToComponent(sourceComponentPath2,destinationComponentPath2,destinationComponentParameterArray2)                  
            }

          }
    });

 }

 HealthsingleexportAsXLSX() {
  //this.readinessQuestionService.getExcelHealthReadinessSingle(this.transition_id, this.parameterCustomId, this.parameterName, this.resourceTypeMeasured, this.username);

  var account = this.userAccessProfileService.getClientName();
  window.open(this.baseURL+'/getExcelHealthReadinessTracker/'+this.transition_id+'/'+this.parameterCustomId+'/'+encodeURIComponent(this.appIds)+'/'+encodeURIComponent(account));
}

back(){

  if (this.resourceTypeMeasured == 'application'){
        this.applicationFilterSimple();
  }else{
        this.parameterCustomTrackingList();
  }
  
}




parameterCustomTrackingList(){
  var sourceComponentPath = '/transition-Main'; 
  var destinationComponentPath = '/transition-Main/parameter-custom-tracking-list';
  var destinationComponentParameterArray:any = []    
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}
      

applicationFilterSimple() {

  var sourceComponentPath = '/transition-Main';
  var destinationComponentPath = '/transition-Main/app-filter-simple';
  var destinationComponentParameterArray:any =  [
        { id: 'parameterId', param: this.parameterCustomId },
        { id: 'parameterName', param: this.parameterName },
        { id: 'resourceTypeMeasured', param: this.resourceTypeMeasured }  ]     
  
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}



}



export interface KeyValue {
  [id :string]: string;
}