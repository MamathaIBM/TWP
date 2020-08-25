import { Component, OnInit, ViewChild } from '@angular/core';

import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource, MatPaginator } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from 'src/app/navtnt.service';
import { ReadinessQuestionService } from 'Services/readinessquestion.service';
import { ReadinessQuestionsTracker } from 'Vo/readinessquestionstracker';
import { Observable, of } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { TraineeService } from 'Services/trainee.service';
import { Trainee } from 'Vo/trainee';
import { Application } from 'Vo/application';
import { ApplicationService } from 'Services/application.service ';
import { ApptraineemapService } from 'Services/apptraineemap.service';
import { AppTraineeMapTracker } from 'Vo/apptraineemaptracker';
import { AppTraineeMap } from 'Vo/apptraineemap';


@Component({
      selector: 'app-app-trainee-map-edit',
      templateUrl: './app-trainee-map-edit.component.html',
      styleUrls: ['./app-trainee-map-edit.component.css']
})
export class AppTraineeMapEditComponent implements OnInit {


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
  traineeKeyValue: KeyValue={};  // key --> TraineeId & value trainee object

  resourceTypeMeasured = "";
  baseURL = environment.AdminbaseUrl;
  username: any; 
  trainees:any[];
  apps:any[];

  trainee: Trainee = {

        traineeId:'',
        traineeName:'',  
        traineeEmail:'',
        traineeSkill:'',
        counter:-1,
        appCount:0,
        fte:0,
        apps:'',
        appIds:'' 
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


  //readinessQuestions: any[] = [];
  appTraineeMapAnswers: any[] = [];

  maps: FormArray;

  existingReadinessQuestionJsonString: string="";
  appTraineeMapEditForm: FormGroup;
  appIds = '';
  traineeIds = '';

  appTraineeMaps:any[] = [];

  changedCellIndexTracker:any[] = [];


  //readinessQuestionTrackers:ReadinessQuestionsTracker[] = [];
  dataSource = new MatTableDataSource;
  
  //displayedColumns: string[] = [ 'readinessQuestionCategory', 'readinessQuestion','readinessQuestionAnswerFieldType', 'readinessQuestionId'];
  displayedColumns:any[]=[];


  constructor( 
      private fb: FormBuilder, 
      private route:ActivatedRoute,
      private navigation: NavtntService, 
      private userAccessProfileService: UserAccessProfileService, 
      private readinessQuestionService: ReadinessQuestionService, 
      private traineeService: TraineeService, 
      private appService: ApplicationService, 
      private appTraineeMapService: ApptraineemapService, 
      private router: Router) { 
  }

  ngOnInit() {
    
          this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
          this.username = decodeURIComponent(this.username._value);
          
          this.transition_id = this.userAccessProfileService.getCurrentTransitionID();
          this.appTraineeMapEditForm = this.fb.group({
              maps:this.fb.array([])                      
          });


          //this.readinessQuestionTrackingForm.disable();
      
          this.maps = this.appTraineeMapEditForm.get('maps') as FormArray;

          this.route.queryParams.subscribe((p: any) => {    
            if (p.filter){

 
                this.appIds = this.navigation.getParameterValue(p.filter, 'appIds');
                this.traineeIds = this.navigation.getParameterValue(p.filter, 'traineeIds');      

            
                this.getAppTraineeMapEdit();
            
            
            }
          });                 
  }

  get questionsArray(){
         return this.appTraineeMapEditForm.get('maps') as FormArray;
  }

  loadData() {
        // Fake Slow Async Data
        return of({
          dataLoaded: true
        }).pipe(
                delay(0)
        );
  }





  getAppTraineeMapEdit(){

     // ###################################
     
     this.traineeService.getTraineeList(this.transition_id, this.traineeIds,'all','all','all').subscribe((trainees:any[]) => {

              this.trainees = [];

              //App Column Header
              let appColumnHeader: Trainee = {
                    traineeId:'',
                    traineeName:'APPLICATION',  //since it is application header 
                    traineeEmail:'',
                    traineeSkill:'',
                    counter:-1,   
                    appCount:0,
                    fte:0,
                    apps:'',
                    appIds:''                       
              }

              this.traineeKeyValue['APP_HEADER']=appColumnHeader;
              this.displayedColumns.push('APP_HEADER');

              //Populate the Trainee Vos and push it to array
              for(var i=0; i<trainees.length; i++ ){

                    let trainee: Trainee = {
                      traineeId:'',
                      traineeName:'',  
                      traineeEmail:'',
                      traineeSkill:'',
                      counter:-1,           
                      appCount:0,
                      fte:0,
                      apps:'',
                      appIds:''               
                    }

                    trainee.traineeId = trainees[i].TRAINEE_ID;
                    trainee.traineeName = trainees[i].TRAINEE_NAME;
                    trainee.traineeEmail = trainees[i].TRAINEE_EMAIL;
                    trainee.traineeSkill = trainees[i].TRAINEE_SKILL;
                    trainee.fte = trainees[i].FTE;

                    this.trainees.push(trainee);

                    console.log("traineeId     "+trainee.traineeId);
                    this.displayedColumns.push(''+trainee.traineeId);
                    this.traineeKeyValue[''+trainee.traineeId] = trainee;                    
              }  

              //Total trainee fte Column Header per App
              let appTotalFteColumnHeader: Trainee = {
                  traineeId:'',
                  traineeName:'TOTAL TRAINEE FTE',  //since it is TRAINEE FTE header 
                  traineeEmail:'',
                  traineeSkill:'',
                  counter:-1,   
                  appCount:0,
                  fte:0,
                  apps:'',
                  appIds:''                       
            }

            this.traineeKeyValue['TRAINEE_FTE_HEADER']=appTotalFteColumnHeader;
            this.displayedColumns.push('TRAINEE_FTE_HEADER');              

            
            // Form the DATA /FORM CONTROL ROWS
            this.appTraineeMapService.getAppTraineeMapTrackingList(this.transition_id, this.appIds, this.traineeIds ).subscribe((appTraineeMapAnswers:any[]) => {

               this.formRowList = [];               
               for(var x=0; x<appTraineeMapAnswers.length;x++){                                    
                         //this.displayedColumns = [];
                         
                         this.maps.push(this.fb.group({        
                               appId:  appTraineeMapAnswers[x].APP_ID,                                      
                               traineeId:appTraineeMapAnswers[x].APP_TRAINEE_MAP_ID,  
                               appTraineeMapId:appTraineeMapAnswers[x].APP_TRAINEE_MAP_ID,                      
                               answer:"", 
                               markForChange:false,  
                               lastRow: false                
                         })); 

                         let obj={};

                         obj = this.getFormControlsRowData(appTraineeMapAnswers[x]);
                         this.appTraineeMapAnswers.push(obj);
                                                         
                         for(var q=0; q<trainees.length; q++) {     
                           
                                   //console.log(" obj[trainees[q].TRAINEE_ID].appTraineeMapId "+obj[trainees[q].TRAINEE_ID].appTraineeMapId);

                                   let appTraineeMapId='';
                                   let answer ='';
                                   if ( obj[''+trainees[q].TRAINEE_ID] != undefined){
                                          appTraineeMapId = obj[''+trainees[q].TRAINEE_ID].appTraineeMapId;
                                          answer = obj[''+trainees[q].TRAINEE_ID].fte;
                                          //alert("appTraineeMapId "+appTraineeMapId);
                                   }       

                                   console.log("appTraineeMapId "+appTraineeMapId);     

                                   this.maps.push(this.fb.group({     
                                           appId:appTraineeMapAnswers[x].APP_ID,  
                                           appName:appTraineeMapAnswers[x].APP_NAME,                                           
                                           traineeId:trainees[q].TRAINEE_ID,  
                                           traineeName:trainees[q].TRAINEE_NAME,   
                                           appTraineeMapId:appTraineeMapId,                    
                                           answer:answer,  
                                           markForChange:false,  
                                           lastRow: false               
                                   }));                                          
                         }

                         

                         //Trainee FTE total
                         this.maps.push(this.fb.group({                                                
                              //traineeFte:"",                      
                              answer:obj['TRAINEE_FTE_HEADER'],                               
                              markForChange:false,  
                              lastRow: false           
                         })); 

                        


                         //var obj = {};                                                           
                         //this.appTraineeMapAnswers.push(this.getFormControlsRowData(appTraineeMapAnswers[x]) );                              

                         let appTraineeMapTracker: AppTraineeMapTracker = {
                               appTraineeMapId:'',
                               applicationId:'',
                               applicationName:'',
                               applicationTechnology:'',
                               applicationComplexity:'',
                               traineeFteMaps:'',
                          }

                          appTraineeMapTracker.appTraineeMapId = appTraineeMapAnswers[x].APP_TRAINEE_MAP_ID;                                                    
                          appTraineeMapTracker.applicationId = appTraineeMapAnswers[x].APP_ID;
                          appTraineeMapTracker.applicationName = appTraineeMapAnswers[x].APP_NAME;
                          appTraineeMapTracker.applicationTechnology = appTraineeMapAnswers[x].TECHNOLOGY;
                          appTraineeMapTracker.applicationComplexity = appTraineeMapAnswers[x].COMPLEXITY;
                          appTraineeMapTracker.traineeFteMaps = appTraineeMapAnswers[x].TRAINEE_FTE_INFO;
                        
                          this.formRowList.push(appTraineeMapTracker);
               }
               

               // Form array populateion for the last row
               this.maps.push(this.fb.group({        
                  appId:'',
                  traineeId:'',                      
                  answer:"",  
                  markForChange:false,  
                  lastRow: true  
               })); 

               for(var q=0; q<this.trainees.length; q++) { 
                  this.maps.push(this.fb.group({        
                        appId:  '',                                      
                        traineeId:trainees[q].APP_TRAINEE_ID,                          
                        answer:"", 
                        markForChange:false,  
                        lastRow: true             
                     })); 
               }      
               this.maps.push(this.fb.group({                                                
                  appId:'',
                  traineeId:'',                      
                  answer:'', 
                  markForChange:false,  
                  lastRow: true            
             })); 



               // Add the last row ...total app fte
               this.appTraineeMapAnswers.push(this.getFormControlsLastRowData(appTraineeMapAnswers));

               this.dataSource.data = this.appTraineeMapAnswers;
               this.dataSource.paginator = this.paginator;               
               this.dataLength =  this.dataSource.data.length;
               this.dataLoaded = this.loadData().pipe(share());              
               if (this.userAccessProfileService.getViewFlag() =='Yes'){
                     this.appTraineeMapEditForm.disable();
               }

               // disable the last column
               for(var i=0;i< this.appTraineeMapAnswers.length;i++ ){
                  (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[ this.displayedColumns.length*(i)+this.displayedColumns.length-1].disable();
               }


               // disable the last row
               for(var i=0;i< this.displayedColumns.length;i++ ){
                     (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[ this.displayedColumns.length*(this.appTraineeMapAnswers.length-1)+i].disable();
               }
            
        });
              
     });  

   

     // ###################################
  }

    

    getFormControlsRowData(appTraineeMapTracker){

          var obj = {};          
          obj['APP_HEADER'] = appTraineeMapTracker.APP_NAME;
          var traineeFteInfo = appTraineeMapTracker.TRAINEE_FTE_INFO;   
          var fte = 0;       
          if (traineeFteInfo!=''){                
                var traineeFteInfos = traineeFteInfo.split(",");
                for(var i=0; i<traineeFteInfos.length; i++) {
                      var traineeAndFte = traineeFteInfos[i].split("-");

                      let appTraineeMap: AppTraineeMap = {
                        appTraineeMapId:'',
                        applicationId:'',  
                        traineeId:'',
                        fte:0                   
                     }
                      
                      appTraineeMap.appTraineeMapId = traineeAndFte[2];
                      appTraineeMap.fte = traineeAndFte[1];    
                      //alert("appTraineeMap.fte "+appTraineeMap.fte);                     
                      fte = fte + (+appTraineeMap.fte);
                      //alert("fte "+fte);
                      obj[''+traineeAndFte[0]]=appTraineeMap;  
                      
                      //alert(traineeAndFte[0]);
                }                              
          }

          obj['TRAINEE_FTE_HEADER'] = fte;

          return obj;
    }

    getFormControlsLastRowData(appTraineeMapAnswers:any[]){ // Last row total app fte against a trainee


      //formation of an object key of which is [appId-traineeId] type
      let objAppTraineeMap = {}; 
      for(var j=0;j<appTraineeMapAnswers.length;j++){
            var appId = appTraineeMapAnswers[j].APP_ID;
            var traineeFteInfo = appTraineeMapAnswers[j].TRAINEE_FTE_INFO;


            //console.log("appId "+ appId);
            //console.log("traineeFteInfo "+ traineeFteInfo);

            var fte = 0;       
            if (traineeFteInfo!=''){                
                  var traineeFteInfos = traineeFteInfo.split(",");
                  for(var i=0; i<traineeFteInfos.length; i++) {
                        var traineeAndFte = traineeFteInfos[i].split("-");
                        objAppTraineeMap[appId+"-"+traineeAndFte[0]]=traineeAndFte[1];
                  }   
            }         
      }

      let obj = {};          
      obj['APP_HEADER'] = 'TOTAL APP FTE';
      for(var i=0; i<this.trainees.length; i++ ){

            let appTraineeMap: AppTraineeMap = {
                  appTraineeMapId:'',
                  applicationId:'',  
                  traineeId:'',
                  fte:0                   
            }

          var totalAppFte = 0;
          var traineeId = this.trainees[i].traineeId;
          for(var j=0;j<appTraineeMapAnswers.length;j++){
                   var appId = appTraineeMapAnswers[j].APP_ID;
                   //alert("B4 objAppTraineeMap[appId+-+traineeId] "+objAppTraineeMap[appId+"-"+traineeId]);
                   if (objAppTraineeMap[appId+"-"+traineeId] !== undefined ){
                           //alert("Inside objAppTraineeMap[appId+-+traineeId] "+objAppTraineeMap[appId+"-"+traineeId]);
                           totalAppFte = totalAppFte + (+objAppTraineeMap[appId+"-"+traineeId]);
                           //alert("Inside totalAppFte "+totalAppFte);
                   }        
          }


          //alert("totalAppFte "+totalAppFte);
          appTraineeMap.fte = +totalAppFte;
          obj[''+this.trainees[i].traineeId]=appTraineeMap;
          //alert("appTraineeMap.fte "+appTraineeMap.fte);

      }      
      obj['TRAINEE_FTE_HEADER'] = '';

      return obj;
}








  saveAppTraineeMapFinal(){

    var appTraineeMapList = JSON.stringify(this.appTraineeMaps);

    
    if (this.appTraineeMaps.length == 0){
          return ; 
    }
    
    var parameter = '{'+  
          '"transitionId":"'+this.userAccessProfileService.getCurrentTransitionID()+'", '+            
          '"appTraineeMapList":'+appTraineeMapList+'  '+                     
    '}'

    //alert(parameter);
    
    
    this.appTraineeMapService.saveAppTraineeMap(parameter).subscribe((appTraineeMap:any[]) => {                     
                        
          console.log("################### upload map ########################");    
          alert("Your changes saved successfully ");                          
          this.appTraineeMaps = [];
          var sourceComponentPath = '/transition-Main/app-trainee-map-edit';
          var destinationComponentPath = '/transition-Main/app-trainee-mapping';
          var destinationComponentParameterArray = []
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                                
    });
    
    
  }

  saveAppTraineeMap(){

      if (this.changedCellIndexTracker.length == 0){
            alert("There is no changes to save!");
            this.appTraineeMaps = [];
            var sourceComponentPath = '/transition-Main/app-trainee-map-edit';
            var destinationComponentPath = '/transition-Main/app-trainee-mapping';
            var destinationComponentParameterArray = []
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray) 

      }else{
            //Validation loop

            //alert("this.changedCellIndexTracker.length "+this.changedCellIndexTracker.length);
            for(var i=0; i<this.changedCellIndexTracker.length; i++) {
                  let fte = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[this.changedCellIndexTracker[i].formControlIndex].value.answer;
                  var appName = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[this.changedCellIndexTracker[i].formControlIndex].value.appName;
                  var traineeName = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[this.changedCellIndexTracker[i].formControlIndex].value.traineeName;

                  //alert("fte "+fte);
                  if (!this.validateField(fte,appName, traineeName)){
                        //alert("Exiting ...");
                        return;
                  }
            }     


            //Check resource total fte
            for(var i=0; i<this.changedCellIndexTracker.length; i++) {
                  let traineeId = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[this.changedCellIndexTracker[i].formControlIndex].value.traineeId;
                  var traineeName = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[this.changedCellIndexTracker[i].formControlIndex].value.traineeName;


                  
                  if (+(<FormArray>this.appTraineeMapEditForm.get('maps')).controls[(this.appTraineeMapAnswers.length-1) * this.displayedColumns.length + this.changedCellIndexTracker[i].colIndex  ].value.answer > 1 ){
                        if(confirm("You are deploying more than 1 FTE for "+traineeName+", are you sure?")) {
                        }else{                       
                              return ;
                        }
                  } 
            }  

            //Save prepare for loop
            for(var i=0; i<this.changedCellIndexTracker.length; i++) {
                  var fte = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[this.changedCellIndexTracker[i].formControlIndex].value.answer;
                  var appId = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[this.changedCellIndexTracker[i].formControlIndex].value.appId;
                  var traineeId = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[this.changedCellIndexTracker[i].formControlIndex].value.traineeId;
                  var appTraineeMapId = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[this.changedCellIndexTracker[i].formControlIndex].value.appTraineeMapId;
                  var jsonObj = {};
                  jsonObj = {"APP_TRAINEE_MAP_ID":appTraineeMapId, "APP_ID":appId, "TRAINEE_ID":traineeId, "FTE":fte.trim() };
                  this.appTraineeMaps.push(jsonObj);
            }   

            //Save
            this.saveAppTraineeMapFinal();
      }
  }      



  onChange(formControlIndex, rowIndex, colIndex,  previousValue){


      //alert("previousValue "+previousValue);
      var currentValue  = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[rowIndex*(this.displayedColumns.length) + colIndex].value.answer;

      //alert("currentValue "+currentValue);

      if (previousValue !=undefined)
      if (currentValue ==''){
            alert("You have cleared the content of the cell, this would not delete the mapping. To delete the mapping please click on the delete button");
            return;
      }




       let cellVo: CellVo={
            formControlIndex:formControlIndex,
            rowIndex:rowIndex,
            colIndex:colIndex
       }

        //alert(rowIndex+","+colIndex);
        this.changedCellIndexTracker.push(cellVo);
        //this.formRowList[rowIndex].markForChange = true;    

        var fteRowTotal = 0;
        var appName = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[formControlIndex].value.appId;
        var traineeName = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[formControlIndex].value.traineeId;

        // In case of Row sum calculation
        let startColIndex = rowIndex * this.displayedColumns.length;
        for(let i=startColIndex + 1; i<rowIndex * this.displayedColumns.length + this.displayedColumns.length-1; i++) {
            //alert("answer "+(<FormArray>this.appTraineeMapEditForm.get('maps')).controls[i].value.answer);  
            fteRowTotal = fteRowTotal + (+((<FormArray>this.appTraineeMapEditForm.get('maps')).controls[i].value.answer));            
        }  
        
        //alert("Total b4 update "+ (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[rowIndex * this.displayedColumns.length + (this.displayedColumns.length-1) ].value.answer);

        //alert("fteRowTotal "+fteRowTotal);
        (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[rowIndex * this.displayedColumns.length + (this.displayedColumns.length-1) ].setValue({answer:fteRowTotal,markForChange:false,lastRow: false});
        
       // In case of Col sum calculation
       var fteColTotal = 0;
       for(let j=0; j<this.appTraineeMapAnswers.length-1; j++) {
           //alert("answer "+(<FormArray>this.appTraineeMapEditForm.get('maps')).controls[j*(this.displayedColumns.length) + colIndex].value.answer);  
           fteColTotal = fteColTotal + (+((<FormArray>this.appTraineeMapEditForm.get('maps')).controls[j*(this.displayedColumns.length) + colIndex].value.answer));            
           //alert("fteColTotal "+fteColTotal);
       } 

       //alert("index "+(this.appTraineeMapAnswers.length-1)*(this.displayedColumns.length) + (+colIndex));
       //alert("b4 value "+(<FormArray>this.appTraineeMapEditForm.get('maps')).controls[(this.appTraineeMapAnswers.length-1)*(this.displayedColumns.length) + (+colIndex)].value.answer);
       ((<FormArray>this.appTraineeMapEditForm.get('maps')).controls[(this.appTraineeMapAnswers.length-1)*(this.displayedColumns.length) + colIndex]).setValue({ appId:'',traineeId:'',answer:fteColTotal, markForChange:false,lastRow:true});



        
  }

  deleteAppTraineeMap(formControlIndex){


      //alert(formControlIndex);
      //this.formRowList[rowIndex].markForChange = true;        
      var fte = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[formControlIndex].value.answer;
      var appId = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[formControlIndex].value.appId;
      var traineeId = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[formControlIndex].value.traineeId;
      var appTraineeMapId = (<FormArray>this.appTraineeMapEditForm.get('maps')).controls[formControlIndex].value.appTraineeMapId;


      this.appTraineeMaps = [];
      var sourceComponentPath = '/transition-Main/app-trainee-map-edit';
      var destinationComponentPath = '/transition-Main/app-trainee-map-delete';
      var destinationComponentParameterArray = []
     // this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                                


      destinationComponentParameterArray = [
            { id: 'appIds', param: this.appIds },
            { id: 'traineeIds', param: this.traineeIds },
            { id: 'appId', param: appId },
            { id: 'traineeId', param: traineeId },
            { id: 'appTraineeMapId', param: appTraineeMapId } ] 

      if(confirm("This will delete the mapping, after that no need to 'Save' again. Are you sure to delete?")) {

            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray) ;   
      }      
      
}










validateField(fte,appName, traineeName){


      var result = true;
      var appTraineeName = appName + " & " + traineeName;

      if ((fte.trim()) !=''){


            //alert(typeof fte.trim() === "string" && !Number.isNaN(Number(fte.trim())) );

            //if (Number.isNaN(fte.trim())==false){

            if (typeof fte.trim() === "string" && Number.isNaN(Number(fte.trim()))) {
            //if (typeof fte.trim() !== "number"){
                  alert("FTE must be number for "+appTraineeName+"!");
                  result = false;
                  return result;
            }
            

            if ((fte.trim()) < 0){
                  alert("You can't have -Ve FTE "+appTraineeName+"!");
                  result = false;
                  return result;
            }

            if ((fte.trim()) == 0){
                  alert("ZERO fte does not make sense "+appTraineeName+"!");
                  result = false;
                  return result;
            }

            if ((fte.trim()) > 1){
                  if(confirm("You are deploying more than 1 FTE for "+appTraineeName+", are you sure?")) {

                  }else{
                        result = false;
                        return result;
                  } 
            }

            return result;
              
       }else{
            return result;
       }       
}


      back(){
            const sourceComponentPath = '/transition-Main';
            const destinationComponentPath = '/transition-Main/app-trainee-mapping';
            const destinationComponentParameterArray:any = []    
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
      } 

}

export interface KeyValue {
    [id :string]: Trainee;
}

export class CellVo{
      formControlIndex:number;
      rowIndex:number;
      colIndex:number;      
}