import { Component, OnInit, ViewChild } from '@angular/core';

import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from 'src/app/navtnt.service';
import { ReadinessQuestion } from 'Vo/readinessquestion';
import { ReadinessQuestionService } from 'Services/readinessquestion.service';


@Component({
  selector: 'app-readiness-question-list',
  templateUrl: './readiness-question-list.component.html',
  styleUrls: ['./readiness-question-list.component.css']
})
export class ReadinessQuestionListComponent implements OnInit {


  @ViewChild(MatSort) sort: MatSort;
  tran_id:string="-1";
  dataLength = 0;
  parameterId ="";
  parameterName = "";

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

  readinessQuestions: ReadinessQuestion[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [  'readinessQuestion','readinessQuestionAnswerFieldType', 
                                 'readinessQuestionDataType', 'readinessQuestionAnswerSet','readinessQuestionId'];

  constructor(private route:ActivatedRoute,private navigation: NavtntService, private readinessQuestionService: ReadinessQuestionService) { }

  ngOnInit() {

    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.parameterId = this.navigation.getParameterValue(p.filter, 'parameterId')   
          this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName')   

          this.getReadinessQuestionList(this.parameterId );
      }
    });

    
  
  }

  getReadinessQuestionList(parameterId){

    console.log(  "getReadinessQuestionList()"); 

    this.readinessQuestionService.getReadinessQuestionList(parameterId).subscribe((readinessQuestions:any[]) => {
                     
      console.log("###########################################");

      console.log("clients.length "+readinessQuestions.length); 

      var readinessQuestions_tmp: ReadinessQuestion[];

      //if (readinessQuestions.length>0){
        // Clears old data
        this.readinessQuestions = [];
      //}
                    
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

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.readinessQuestions);
      this.dataSource.sort = this.sort;

      this.dataLength =  this.dataSource.data.length;
      
           //this.clients = clients1;
    });    
  }

  deleteReadinessQuestionAdmin(readinessQuestion_id:string){

    this.readinessQuestionService.deleteReadinessQuestionAdmin(readinessQuestion_id ).subscribe((readinessQuestions:any[]) => {
                     
      console.log("#####################################");
      this.getReadinessQuestionList(this.parameterId );
    });
  }

  onDelete(readinessQuestion) {
    console.log("Delete Clicked "+readinessQuestion.readinessQuestionId);   
    if(confirm(" Are you sure to delete "+readinessQuestion.readinessQuestion+" ?")) { 
         this.deleteReadinessQuestionAdmin(readinessQuestion.readinessQuestionId);
    }
  }


  onUpdate(readinessQuestion) {
    console.log("Update Clicked "+readinessQuestion.readinessQuestionId);    

    var sourceComponentPath = '/admin-home/readiness-question-list';
    var destinationComponentPath = '/admin-home/readiness-question-edit';
    var destinationComponentParameterArray = [{ id: 'readinessQuestionId', param: readinessQuestion.readinessQuestionId },
                                              { id: 'parameterName', param: this.parameterName },
                                              { id: 'parameterId', param: this.parameterId } ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }



  createNew() {

    
    var sourceComponentPath = '/admin-home/readiness-question-list';
    var destinationComponentPath = '/admin-home/readiness-question-add';
    var destinationComponentParameterArray = [{ id: 'parameterId', param: this.parameterId },
    { id: 'parameterName', param: this.parameterName } ] 

  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }


}
