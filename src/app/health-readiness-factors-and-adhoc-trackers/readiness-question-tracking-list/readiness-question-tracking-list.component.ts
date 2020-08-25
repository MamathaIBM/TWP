import { Component, OnInit, ViewChild } from '@angular/core';

import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource, MatPaginator, MatDatepicker } from '@angular/material';
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
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core'






import * as _moment from 'moment';
import { UtilityService } from 'Services/utility.service';
// tslint:disable-next-line:no-duplicate-imports
//import {default as _rollupMoment} from 'moment';

//const moment = _rollupMoment || _moment;
const moment =  _moment;

@Component({
      selector: 'app-readiness-question-tracking-list',
      templateUrl: './readiness-question-tracking-list.component.html',
      styleUrls: ['./readiness-question-tracking-list.component.css'],
      providers: [
            // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
            // `MatMomentDateModule` in your applications root module. We provide it at the component level
            // here, due to limitations of our example generation script.
            {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
            {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
          ],
})
export class ReadinessQuestionTrackingListComponent implements OnInit {

  @ViewChild(MatDatepicker) datepicker: MatDatepicker<Date>;      

  @ViewChild(MatPaginator) paginator: MatPaginator;  
  transition_id:string="";

  parameterCustomId:string="";
  parameterName ="";
  dataLength = 0;
  readinessQuestionTrackerId:string='';
  filtersLoaded: Observable<boolean>;
  dataLoaded: Observable<{}>;
  formControlsColumnList:any[];  
  formRowList:any[];
  headerKeyValue: KeyValue={};
  resourceTypeMeasured = "";
  baseURL = environment.AdminbaseUrl;
  username: any; 
  dateTest ="02/13/2019";

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
  appIds = 'all';


  //readinessQuestionTrackers:ReadinessQuestionsTracker[] = [];
  dataSource = new MatTableDataSource;
  
  //displayedColumns: string[] = [ 'readinessQuestionCategory', 'readinessQuestion','readinessQuestionAnswerFieldType', 'readinessQuestionId'];
  displayedColumns:any[]=[];


  constructor( 
                  private datePipe : DatePipe, 
                  private utilityService : UtilityService,
                  private fb: FormBuilder, 
                  private route:ActivatedRoute,
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


          //this.readinessQuestionTrackingForm.disable();

          this.questions = this.readinessQuestionTrackingForm.get('questions') as FormArray;

          this.route.queryParams.subscribe((p: any) => {    
            if (p.filter){

                this.parameterCustomId = this.navigation.getParameterValue(p.filter, 'parameterId')   
                this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName')                   
                this.resourceTypeMeasured = this.navigation.getParameterValue(p.filter, 'resourceTypeMeasured')   

                if (this.resourceTypeMeasured === 'application' || this.resourceTypeMeasured === 'ST-scope' 
                || this.resourceTypeMeasured === 'Process'
                || this.resourceTypeMeasured === 'Metrics'
                || this.resourceTypeMeasured === 'Reports'
                || this.resourceTypeMeasured === 'Governance'
                || this.resourceTypeMeasured === 'Tools' ){
                      this.appIds = this.navigation.getParameterValue(p.filter, 'appIds')   
                }

                this.getReadinessQuestionTrackingList();
             
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


  getReadinessQuestionTrackingList(){

    console.log( "getReadinessQuestionDesginList()"); 

    var applicationParameter = '{'+  
          '"transitionId":"'+this.transition_id+'", '+
          '"parameterId":"'+this.parameterCustomId+'" '+         
    '}'


    this.readinessQuestionService.getReadinessQuestionTrackingHeaderList(applicationParameter).subscribe((readinessQuestions:any[]) => {
                     
            console.log("###########################################");


            this.formControlsColumnList = readinessQuestions;
             // Form the HEADER METADATA

             //App Column Header
            let appColumnHeader: ReadinessQuestion = {
                      readinessQuestionId:'',
                      readinessQuestionCategory:'',
                      readinessQuestion:this.resourceTypeMeasured,
                      readinessQuestionAnswerFieldType: 'LABEL',
                      readinessQuestionDataType: '',
                      readinessQuestionAnswerSet:'' ,
                      readinessQuestionAnswer:'',  
                      readinessQuestionDataList:[],
                      adopted:''                        
            }           


            this.headerKeyValue['RESOURCE_TYPE']=appColumnHeader;
            this.displayedColumns.push('RESOURCE_TYPE');


            // Answer Column Headers
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

                      var listValues1 = readinessQuestion.readinessQuestionAnswerSet.split(",");
                      for(var k=0; k<listValues1.length; k++) {
                            readinessQuestion.readinessQuestionDataList.push({id:listValues1[k], param:listValues1[k]})  
                      }
                
                      this.headerKeyValue[''+readinessQuestions[p].READINESS_QUESTION_CUSTOM_ID] = readinessQuestion;
                      this.displayedColumns.push(''+readinessQuestions[p].READINESS_QUESTION_CUSTOM_ID);     
            }

             //RAG Column Header
             let ragColumnHeader: ReadinessQuestion = {
                    readinessQuestionId:'',
                    readinessQuestionCategory:'',
                    readinessQuestion:'RAG',
                    readinessQuestionAnswerFieldType: 'DROPDOWN',
                    readinessQuestionDataType: '',
                    readinessQuestionAnswerSet:'R,A,G' ,
                    readinessQuestionAnswer:'',  
                    readinessQuestionDataList:[],
                    adopted:''                        
              }  
              
             
              var listValues = ragColumnHeader.readinessQuestionAnswerSet.split(",");
              for(var m=0; m<listValues.length; m++) {
                   ragColumnHeader.readinessQuestionDataList.push({id:listValues[m], param:listValues[m]})  
              }              

              this.headerKeyValue['RAG']=ragColumnHeader;
              this.displayedColumns.push('RAG');


              var jsonParam = '{' +
                                    '"transitionId":"'+this.transition_id+'", '+
                                    '"resourceTypeMeasured":"'+this.resourceTypeMeasured+'", '+
                                    '"parameterId":"'+this.parameterCustomId+'", '+
                                    '"appIds":"'+this.appIds+'" '+
                              '}'


            // Form the DATA /FORM CONTROL ROWS
            this.readinessQuestionService.getReadinessQuestionTrackingList(jsonParam).subscribe((readinessAnswers:any[]) => {

                     console.log("Fetching data - Counter = "+p);

                      this.formRowList = [];
                      //this.questions = this.readinessQuestionTrackingForm.get('questions') as FormArray;



                      for(var x=0; x<readinessAnswers.length;x++){                                    
                                //this.displayedColumns = [];

                                var formRowControlData = this.getFormControlsRowData(readinessAnswers[x], this.headerKeyValue);
                                
                                this.questions.push(this.fb.group({                                                
                                      questionId:readinessAnswers[x].READINESS_QUESTION_TRACKER_ID,   
                                      fieldType:"TEXTFIELD",    
                                      dataType:"TEXT",              
                                      answer:"", 
                                      markForChange:false         
                                })); 

                                                                
                                for(var q=0; q<readinessQuestions.length; q++) {                                        
                                          this.questions.push(this.fb.group({                                                
                                                  questionId:readinessQuestions[q].READINESS_QUESTION_CUSTOM_ID,                      
                                                  fieldType:readinessQuestions[q].READINESS_QUESTION_ANSWER_FIELD_TYPE,
                                                  dataType:readinessQuestions[q].READINESS_QUESTION_ANSWER_DATA_TYPE, 
                                                  answer:formRowControlData[readinessQuestions[q].READINESS_QUESTION_CUSTOM_ID]==null?"":formRowControlData[readinessQuestions[q].READINESS_QUESTION_CUSTOM_ID],  
                                                  markForChange:false        
                                          }));                                          
                                }

                                //RAG
                                this.questions.push(this.fb.group({                                                
                                  rag:readinessAnswers[x].READINESS_QUESTION_TRACKER_ID,                      
                                  fieldType:"DROPDOWN",
                                  dataType:"TEXT", 
                                  answer:formRowControlData['RAG'], 
                                  markForChange:false         
                                })); 


                                //var obj = {};                                                           
                                this.readinessAnswers.push(formRowControlData );                              
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
                              
                              this.formRowList.push(readinessQuestionTracker);
                      }
                      

                      //alert("FormControl.length "+this.questions.length);
                      //this.dataSource = new MatTableDataSource(this.readinessAnswers);
                      this.dataSource.data = this.readinessAnswers
                      this.dataSource.paginator = this.paginator;
                      //alert("this.displayedColumns.length "+this.displayedColumns.length);
                      this.dataLength =  this.dataSource.data.length;

                      //var coontrolCount = this.readinessQuestionTrackingForm.get('questions').controls.length;
                      //alert("coontrolCount "+coontrolCount);
                      //alert("row count "+this.dataLength);
                      //this.setControlsValue(this.readinessAnswers,this.readinessQuestionTrackingForm.get('questions').controls )

                      //alert("set value = "+this.readinessQuestionTrackingForm.get('questions').controls[1].value.answer);


                      this.dataLoaded = this.loadData().pipe(share());
                      //alert("this.readinessAnswers "+this.readinessAnswers.length);

                      // at this p


                      if (this.userAccessProfileService.getViewFlag() =='Yes'){
                            this.readinessQuestionTrackingForm.disable();
                      }

            });
          });    
    }


    getFormControlsRowData(readinessQuestionsTracker, headerKeyValue){

          var obj = {};          
          obj['RESOURCE_TYPE'] = readinessQuestionsTracker.RESOURCE_NAME;
          //alert("readinessQuestionsTracker.APP_NAME "+readinessQuestionsTracker.APP_NAME);
          //obj['HEADER_KEY_VALUE'] = headerKeyValue;
          //Parse MULTIPLE COLUMNS
          var multipleLogicalColumn = readinessQuestionsTracker.MULTIPLE_LOGICAL_COLS;


          //alert("multipleLogicalColumn "+multipleLogicalColumn);
          if (multipleLogicalColumn!=''){

                //alert("readinessQuestionsTracker.APP_NAME "+readinessQuestionsTracker.APP_NAME);
                var multipleLogicalColumnForAnswers = JSON.parse(multipleLogicalColumn);
                              
                for(var i=0; i<multipleLogicalColumnForAnswers.length; i++) {

                        //alert("readinessQuestionAnswerFieldType "+this.headerKeyValue[''+multipleLogicalColumnForAnswers[i].Q_ID].readinessQuestionAnswerFieldType);

                        if ( this.headerKeyValue[''+multipleLogicalColumnForAnswers[i].Q_ID] !== undefined)
                        if (headerKeyValue[''+multipleLogicalColumnForAnswers[i].Q_ID].readinessQuestionAnswerFieldType == 'DATEFIELD'){
                              obj[''+multipleLogicalColumnForAnswers[i].Q_ID]= this.utilityService.getMoment(multipleLogicalColumnForAnswers[i].ANSWER);
                              //alert("date value = "+obj[''+multipleLogicalColumnForAnswers[i].Q_ID])        ;
                        }
                        else{
                              obj[''+multipleLogicalColumnForAnswers[i].Q_ID]=multipleLogicalColumnForAnswers[i].ANSWER;              
                        }
                        
                }
          }

          obj['RAG'] = readinessQuestionsTracker.RAG;

          return obj;
    }


    /*
    setControlsValue(dataRows, controlsData ){

            //alert(" inside ");
            var controlsCount = controlsData.length;
            //alert("controlsCount inside "+controlsCount);
            var rowsCount = dataRows.length;
            var colCount = controlsCount/rowsCount;

            
            //alert("controlCount "+colCount);

            for(var i=0;i<controlsCount;i++  ){

                  var row = Math.floor(i/colCount); // get the quotient
                  //alert("row"+row);
                  var col = i % colCount;   // get the remainder

                  // interested col>0 as 0th column is label
                  if (col>0){
                        //alert("controlsData[i].value.questionId = "+controlsData[i].value.questionId);
                        //alert("field type "+controlsData[i].value.fieldType);


                         alert("data "+dataRows[row][controlsData[i].value.questionId]);
                        if (controlsData[i].value.fieldType == 'DATEFIELD'){

                             
                              controlsData[i].value.answer=( this.utilityService.getMoment("08-08-2019"));
                        }else{
                              controlsData[i].value.answer=( dataRows[row][controlsData[i].value.questionId]);
                        }
                        

                  }
                    
            }
    }

    */

  onUpdate(readinessQuestion) {
    console.log("Update Clicked "+readinessQuestion.readinessQuestionId);    

    //var controllerPath = '/controller-tnt'
    var sourceComponentPath = "/admin-home/readiness-question-list";
    var destinationComponentPath = "/admin-home/readiness-question-edit";
    var destinationComponentParameterArray = [{ id: 'readinessQuestionId', param: readinessQuestion.readinessQuestionId } ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }



  createNew(readinessQuestionTrackerId) {
    
    var sourceComponentPath = "/admin-home/readiness-question-design-list";
    var destinationComponentPath = "/admin-home/readiness-question-design-add";
    var destinationComponentParameterArray = [{ id: 'readinessQuestionTrackerId', param: this.readinessQuestionTrackerId },
                                              { id: 'existingReadinessQuestionJsonString', param: this.existingReadinessQuestionJsonString } ] 
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }


   save(){

    //alert("Inside save");
    var overallRowChangeCounter = 0;
    var overallJSON = "";
    for(var j=0; j<this.formRowList.length; j++) {

            if (this.formRowList[j].markForChange){
                    var response = "";
                    var count = 0;                  
                    var numberOfColumns = this.formControlsColumnList.length;
                    // because of RAG column one less number of columns to be considered
                    for(var i=0; i<numberOfColumns; i++) {
                            if (count>0){
                                response = response +",";
                            }

                            //const inputData = (<FormArray>this.readinessQuestionTrackingForm.get('questions')).controls[j*(numberOfColumns)+(j*2)+(i+1)].value.answer;
                            const fieldType = (<FormArray>this.readinessQuestionTrackingForm.get('questions'))['controls'][j*(numberOfColumns)+(j*2)+(i+1)].value.fieldType;
                            //const dataType =  (<FormArray>this.readinessQuestionTrackingForm.get('questions')).controls[j*(numberOfColumns)+(j*2)+(i+1)].value.dataType;
                            //Check for 
                            //alert("Field type "+fieldType);


                            if (fieldType =='DATEFIELD' ){
                                  //inputData = this.datePipe.transform((<FormArray>this.readinessQuestionTrackingForm.get('questions')).controls[j*(numberOfColumns)+(j*2)+(i+1)].value.answer, 'MM-dd-yyyy');
                                  //alert("inputData"+inputData);
                                  

                                  //alert(isNaN((<FormArray>this.readinessQuestionTrackingForm.get('questions'))['controls'][j*(numberOfColumns)+(j*2)+(i+1)].value.answer));
                                  var dateInput = "";
                                  if (isNaN((<FormArray>this.readinessQuestionTrackingForm.get('questions'))['controls'][j*(numberOfColumns)+(j*2)+(i+1)].value.answer)==false ){
                                      dateInput = this.datePipe.transform((<FormArray>this.readinessQuestionTrackingForm.get('questions'))['controls'][j*(numberOfColumns)+(j*2)+(i+1)].value.answer, 'MM-dd-yyyy');
                                  }
                                 
                                  response = response + '{' +
                                  '"Q_ID":"'+this.formControlsColumnList[i].READINESS_QUESTION_CUSTOM_ID+'",'+          
                                  '"ANSWER":"'+dateInput+
                                    '"}';
                            }
                            else{
                                    response = response + '{' +
                                    '"Q_ID":"'+this.formControlsColumnList[i].READINESS_QUESTION_CUSTOM_ID+'",'+          
                                    '"ANSWER":"'+(<FormArray>this.readinessQuestionTrackingForm.get('questions'))['controls'][j*(numberOfColumns)+(j*2)+(i+1)].value.answer+
                                    '"}';
                            }

                            (<FormArray>this.readinessQuestionTrackingForm.get('questions')).enable;                            
                            

                            count = count + 1;      
                    }
                    var multipleColumnsValue = '[' + response + ']'

                    var rag = (this.readinessQuestionTrackingForm.get('questions'))['controls'][(j+1)*(numberOfColumns)+j*2+1].value.answer;
                    

                    if (overallRowChangeCounter>0){
                            overallJSON = overallJSON +",";
                    }

                    overallJSON = overallJSON + '{' +
                                                    '"READINESS_QUESTION_TRACKER_ID":"'+this.formRowList[j].readinessQuestionTrackerId+'",'+          
                                                    '"PARAMETER_CUSTOM_ID":"'+this.parameterCustomId+'",'+   
                                                    '"TRANSITION_ID":"'+this.transition_id+'",'+   
                                                    '"READINESS_QUESTION_MEASURED_AGAINST_PARAMETER_VALUE":"'+this.formRowList[j].applicationId+'",'+   
                                                    '"MULTIPLE_LOGICAL_COLS":'+multipleColumnsValue+', '+   
                                                    '"RAG":"'+rag+'" '+   
                    '}';

                    overallRowChangeCounter = overallRowChangeCounter + 1;
            }               
  }

  overallJSON = '[' + overallJSON + ']';


  if (overallRowChangeCounter>0){ // Then only submit

    
    //alert("overallJSON "+overallJSON);
    var parameterJSON ='{' +
                        '"PARAMETER":'+overallJSON +''+                  
                       '}'
                       console.log("overall Json "+parameterJSON);
    
      console.log("##################################################################################################");

        // mark the row change for false 
        for(var k=0; k<this.formRowList.length; k++) {
            if (this.formRowList[k].markForChange){
                  this.formRowList[k].markForChange = false;
            }
        } 
    
      
      var sourceComponentPath = '/transition-Main/readiness-question-tracking-list';
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

  onChange(rowIndex){


        this.formRowList[rowIndex].markForChange = true;        
        
  }


  onDelete(headerElement){



    var applicationParameter = '{'+  
          '"readinessQuestionId":"'+headerElement.readinessQuestionId+'", '+
          '"parameterCustomId":"'+this.parameterCustomId+'" '+         
    '}'

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
                                                              { id: 'returnPath', param: sourceComponentPath },
                                                              { id: 'appIds', param: this.appIds }                                                       
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
                                                            { id: 'returnPath', param: sourceComponentPath2 },
                                                            { id: 'appIds', param: this.appIds }                                                     
                                                        ]     
              this.navigation.goToComponent(sourceComponentPath2,destinationComponentPath2,destinationComponentParameterArray2)                  
            }

          }
    });

   

 }


addOrUpdateReadinessQuestionTracking(){ 
}

readinessQuestionTrackingLandscapeList(parameterId,parameterName, resourceTypeMeasured){

  var sourceComponentPath = '/transition-Main/readiness-question-tracking-list';
  var destinationComponentPath = '/transition-Main/readiness-question-tracking-landscape-list';
  var destinationComponentParameterArray:any =  [{ id: 'parameterId', param: parameterId },
  { id: 'parameterName', param: parameterName },
  { id: 'resourceTypeMeasured', param: resourceTypeMeasured },
  { id: 'appIds', param: this.appIds }  ]     


  
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

HealthsingleexportAsXLSX() {  
   //this.appIds= '1184%2C898';
   //alert(encodeURIComponent(this.appIds));
   //alert(encodeURI(this.baseURL+'/getExcelHealthReadinessTracker/'+this.transition_id+'/'+this.parameterCustomId+'/'+this.appIds));

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
  [id :string]: ReadinessQuestion;
}