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


@Component({
  selector: 'app-readiness-question-adopt',
  templateUrl: './readiness-question-adopt.component.html',
  styleUrls: ['./readiness-question-adopt.component.css']
})
export class ReadinessQuestionAdoptComponent implements OnInit {

  transitionId:string="";
  dataLength = 0;
  readinessQuestionTrackerId:string='';
  customOrGlobal:string="C"; //default is custom
  globalCriteriaList='';
  parameterId = "";
  parameterIdGlobal = "";
  parameterName = "";
  checked_value:boolean;
  view_flag:boolean;

  readinessQuestionsToBeSubmitted:any[]=[];


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


/*
  readinessQuestionTracker: ReadinessQuestionsTracker = {

    readinessQuestionTrackerId:'',
    transitionId:'1',
    applicationId:'',
    headerRow:'',
    readinessQuestionCategory:'',
    multipleLogicalCols:'',
    criteriaMet:'',
    markForChange:false    
}
*/

  readinessQuestions: ReadinessQuestion[] = [];
  existingReadinessQuestionJsonString: string="";

  //readinessQuestionTrackers:ReadinessQuestionsTracker[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [  'readinessQuestion','readinessQuestionAnswerFieldType', 
                                 'readinessQuestionDataType', 'readinessQuestionAnswerSet','readinessQuestionId'];

  constructor(private route:ActivatedRoute,private navigation: NavtntService, private userAccessProfileService: UserAccessProfileService, private readinessQuestionService: ReadinessQuestionService, private dataandparamService: DataandparamService, private router: Router) { }

  ngOnInit() {

   
    this.transitionId = this.userAccessProfileService.getCurrentTransitionID();
    if (this.userAccessProfileService.getViewFlag()=='No'){
      this.view_flag = false;
    }else{
      this.view_flag = true;
    }

    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.parameterId = this.navigation.getParameterValue(p.filter, 'parameterId')   
          this.parameterIdGlobal = this.navigation.getParameterValue(p.filter, 'parameterIdGlobal') 
          //alert(" this.parameterGlobalId .....  "+this.parameterIdGlobal);
          this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName')   

          this.getReadinessQuestionCustomList( );
      }
    });    
  }




 onCheck(event) {
        if(event.checked) {
                this.readinessQuestionsToBeSubmitted[event.source.value].READINESS_QUESTION_ADOPTED='Y';
        } else {       
                this.readinessQuestionsToBeSubmitted[event.source.value].READINESS_QUESTION_ADOPTED='N';         
        }
}






  getReadinessQuestionCustomList(){

    console.log(  "getReadinessQuestionDesginList()"); 


   /*
    var applicationParameter = '{'+  
          '"transitionId":"'+this.transitionId+'", '+
          '"parameterId":"'+this.parameterIdGlobal+'" '+         
    '}'
    */

    //applicationParameter = JSON.stringify(applicationParameter);

    //alert("this.parameterGlobalId "+this.parameterIdGlobal);
    this.readinessQuestionService.getReadinessQuestionListForAdoption(this.parameterIdGlobal).subscribe((readinessQuestions:any[]) => {
                     
      //this.globalCriteriaList = JSON.stringify(readinessQuestions);
      this.readinessQuestionsToBeSubmitted = readinessQuestions;

      // set the parameter category
      for(var j=0; j<readinessQuestions.length; j++) {
            this.readinessQuestionsToBeSubmitted[j].READINESS_QUESTION_CATEGORY  = this.parameterId;
      }  


      if (readinessQuestions.length>0){
        // Clears old data
        this.readinessQuestions = [];
      }
                    
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
           
          this.customOrGlobal = readinessQuestions[i].CUSTOM_OR_GLOBAL_QUESTION;
          readinessQuestion.readinessQuestionId = readinessQuestions[i].READINESS_QUESTION_ID ; 
          readinessQuestion.adopted = readinessQuestions[i].READINESS_QUESTION_ADOPTED ;                     
          readinessQuestion.readinessQuestionCategory = readinessQuestions[i].READINESS_QUESTION_CATEGORY  ;
          readinessQuestion.readinessQuestion = readinessQuestions[i].READINESS_QUESTION ;
          readinessQuestion.readinessQuestionAnswerFieldType = readinessQuestions[i].READINESS_QUESTION_ANSWER_FIELD_TYPE ;
          readinessQuestion.readinessQuestionDataType = readinessQuestions[i].READINESS_QUESTION_ANSWER_DATA_TYPE ;
          readinessQuestion.readinessQuestionAnswerSet = readinessQuestions[i].READINESS_QUESTION_ANSWER_SET ;
         
          this.readinessQuestions.push(readinessQuestion);
      }


      this.dataSource = new MatTableDataSource(this.readinessQuestions);
      this.dataLength =  this.dataSource.data.length;
  });    
}



  deleteReadinessQuestion(readinessQuestion_id:string){

    this.readinessQuestionService.deleteReadinessQuestion(readinessQuestion_id ).subscribe((readinessQuestions:any[]) => {
                     
      console.log(" To JSON "+JSON.stringify(readinessQuestions));
      this.getReadinessQuestionCustomList();
    });
  }

  onDelete(readinessQuestion) {
    console.log("Delete Clicked "+readinessQuestion.readinessQuestionId);    
    this.deleteReadinessQuestion(readinessQuestion.readinessQuestionId);
  }


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



  createNew() {
    //console.log("copyAndCreateNew Clicked "+readinessQuestionId);   
    //this.router.navigate(["/admin-home/readinessQuestion-add"],{queryParams:{readinessQuestionId:readinessQuestionId}}) 
    //this.router.navigate(['controller-tnt', 'readinessQuestion-add/'+readinessQuestionId]);
    
    var sourceComponentPath = '/transition-Main/readiness-question-design-list';
    var destinationComponentPath = '/transition-Main/readiness-question-design-add';
    var destinationComponentParameterArray = [{ id: 'parameterId', param: this.parameterId },
                                              { id: 'parameterName', param: this.parameterName } ] 

  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }


   save(){


      this.globalCriteriaList = JSON.stringify(this.readinessQuestionsToBeSubmitted);
      //alert("this.globalCriteriaList"+this.globalCriteriaList);
      console.log("this.globalCriteriaList "+this.globalCriteriaList);

      var applicationParameter = '{'+  
            '"transitionId":"'+this.transitionId+'", '+
            '"parameterId":"'+this.parameterId+'",  '+  
            '"globalCriteriaList":'+this.globalCriteriaList+'  '+                     
      '}'

      
      this.readinessQuestionService.adoptReadinessQuestionCustom(applicationParameter, this.transitionId ).subscribe((applications:any[]) => {                     
        console.log("##################################################################################################");

        var sourceComponentPath = '/transition-Main/readiness-question-adopt';
        var destinationComponentPath = '/transition-Main/readiness-question-design-list';
        var destinationComponentParameterArray:any = [
          { id: 'parameterId', param: this.parameterId },
          { id: 'parameterName', param: this.parameterName }  ]    

      
        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                  
      });       
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


   back(){

    var sourceComponentPath = '/transition-Main/readiness-question-adopt';
    const destinationComponentPath = '/transition-Main/parameter-custom-list';
    const destinationComponentParameterArray:any = []    
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }



}

