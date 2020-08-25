import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { StandardActivityService } from 'Services/standard-activity.service';
import { NavtntService } from 'src/app/navtnt.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ExcelService } from 'Services/excel.service';
import * as FileSaver from 'file-saver';
import { Response } from '@angular/http';
import { UtilityService } from 'Services/utility.service';
import { FunctionalityService } from 'Services/functionality.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApptraineemapService } from 'Services/apptraineemap.service';
import { getMatIconNoHttpProviderError } from '@angular/material';
import { UserAccessProfileService } from 'Services/user-access-profile.service';

@Component({
          selector: 'app-app-trainee-map-upload',
          templateUrl: './app-trainee-map-upload.component.html',
          styleUrls: ['./app-trainee-map-upload.component.css']
})
export class AppTraineeMapUploadComponent implements OnInit {

    file:any;
    arrayBuffer:any;
    phase:string;
    phaseName:string;
    validateResult = false;
    appTraineeMapUploadForm: FormGroup;
    appTraineeMaps:any[];
    appIds:string='';
    traineeIds:string='';
    errorList:string[]=[];
    validationResult:string='';



    baseURL = environment.baseUrl

    data: any = [{
            FUNC_NAME: 'functionality 1...',
            FUNC_ROUTERLINK: '/x/y/z',
            FUNC_DEFAULT: 'Y',
            FUNC_UOI: 'UOI-SHORT-FORM-OF-FUNCTIONALITY-NAME',
            FUNC_OPERATION_TYPE: 'READ',
            FUNC_DESCRIPTION: 'optional',
            FUNC_MODULE: 'Example-Admin',
            FUNC_TRANSITION_DEPENDENCY: 'Y'
      },
      {
            FUNC_NAME: 'functionality 2...',
            FUNC_ROUTERLINK: '/x/y/z',
            FUNC_DEFAULT: 'N',
            FUNC_UOI: 'UOI-SHORT-FORM-OF-FUNCTIONALITY-NAME',
            FUNC_OPERATION_TYPE: 'WRITE',
            FUNC_DESCRIPTION: '',
            FUNC_MODULE: 'Manage Sprint',
            FUNC_TRANSITION_DEPENDENCY: 'N'
      },
      {
            FUNC_NAME: 'functionality 3...',
            FUNC_ROUTERLINK: '/x/y/z',
            FUNC_DEFAULT: 'N',
            FUNC_UOI: 'UOI-SHORT-FORM-OF-FUNCTIONALITY-NAME',
            FUNC_OPERATION_TYPE: 'WRITE',
            FUNC_DESCRIPTION: 'functionality 3 is used for ...',
            FUNC_MODULE: 'Health & Readiness',
            FUNC_TRANSITION_DEPENDENCY: 'Y'
      }            
      ];


    constructor(private apptraineeService: ApptraineemapService, 
                private navigation : NavtntService, 
                private fb: FormBuilder, 
                private route: ActivatedRoute,
                private excelService:ExcelService,
                private userAccessProfileService: UserAccessProfileService
                ) {
    }

    ngOnInit() {

      this.appTraineeMapUploadForm = this.fb.group({
            validateButton:[''],                     
          });   

       if (this.userAccessProfileService.getViewFlag()=='Yes')   {             
           this.appTraineeMapUploadForm.controls['validateButton'].disable ;  
       }
    }

  
    fileChanged(e) {
           this.file = e.target.files[0];
    }

    uploadDocument(file) {
          let fileReader = new FileReader();
          fileReader.onload = (e) => {
                                        console.log(fileReader.result);
          }
          fileReader.readAsText(this.file);
    }  

    onSubmit(){      
               this.upload();
    }
    
    upload() {

        this.appTraineeMaps = [];
        let fileReader = new FileReader();

        fileReader.onload = (e:any) => {

                    /* read workbook */
                    const bstr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
                    /* grab first sheet */
                    const wsname: string = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];     
                    var jsonObj = {};

                    console.log(XLSX.utils.sheet_to_json(ws,{raw:true}));
                    var json = JSON.stringify(XLSX.utils.sheet_to_json(ws,{raw:true})) ;

                    
                    var maps = JSON.parse(json);

                    //alert("maps length "+maps.length);

                    /*
                    for( var i=0; i< maps.length; i++){
                          alert(maps[i]["test1"]);
                          alert(maps[i]["test2"]);
                          alert(maps[i]["test3"]);
                          alert(maps[i]["test4"]);
                          alert(maps[i]["test5"]);
                    }   
                    
                    */




                    for( var i=2; i< maps.length; i++){

                        //alert("i "+i);
                        var j=5;
                        //alert("beginning "+ws[this.getColumnName(j)+'1'].v);
                        while( ws[this.getColumnName(j)+'1']  !=undefined){ // 1st row contains email address
                              
                              var email = ws[this.getColumnName(j)+'1'].v;

                              if (maps[i][email] !=''){
                                         
                                         //create a new object and push to appTraineeMaps array

                                         //get the app name
                                         var appName = maps[i][ws['A1'].v];  
                                         var fte = maps[i][email];   
                                         
                                         //alert("appname "+appName);
                                         //alert("fte "+fte);
                                         var appId = this.getAppId(appName);
                                         if (this.appIds !=''){
                                             this.appIds = this.appIds +","+appId;
                                         }else{
                                             this.appIds = appId;
                                         }


                                         var traineeId = this.getTraineeId(email);
                                         if (this.traineeIds !=''){
                                              this.traineeIds = this.traineeIds +","+traineeId;
                                         }else{
                                              this.traineeIds = traineeId;
                                         }

                                         jsonObj = {"APP_ID":appId, "TRAINEE_ID":traineeId, "FTE":fte };
                                         this.appTraineeMaps.push(jsonObj);

                              }
                              j = j + 1;
                              //alert("J "+j);

                              //alert("inside "+ws[this.getColumnName(j)+'1'].v);
                         }
                    }  

                    this.uploadAppTraineeMap();                                       
        }
        fileReader.readAsBinaryString(this.file);
        
    }    

    
    uploadAppTraineeMap(){

      var appTraineeMapList = JSON.stringify(this.appTraineeMaps);
      
      var parameter = '{'+  
            '"transitionId":"'+this.userAccessProfileService.getCurrentTransitionID()+'", '+            
            '"appTraineeMapList":'+appTraineeMapList+'  '+                     
      '}'

      //alert(parameter);
      
      this.apptraineeService.uploadAppTraineeMap(parameter).subscribe((appTraineeMap:any[]) => {                     
                          
            console.log("################### upload map ########################");                              

            /*
            var sourceComponentPath = '/transition-Main/app-trainee-map-upload';
            var destinationComponentPath = '/transition-Main/app-trainee-mapping';
            var destinationComponentParameterArray = []
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                                
            */

      
                  var sourceComponentPath = '/transition-Main/app-trainee-upload';
                  var destinationComponentPath = '/transition-Main/app-trainee-map-edit';
                  var destinationComponentParameterArray:any = []    
                  

          
                        
                  destinationComponentParameterArray = [{ id: 'appIds', param: this.appIds },
                        { id: 'traineeIds', param: this.traineeIds } ] 
                  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray) ;   
                    
      });      
      
      
    }


    cancel() {    
            var sourceComponentPath = '/admin-home/app-trainee-map-upload';
            var destinationComponentPath = '/admin-home/functionality-list';
            var destinationComponentParameterArray = []
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)           
   }
    

    

    exportAsXLSX() {
            this.excelService.exportAsExcelFile(this.data, 'sample');
    }



     validate(){

           this.appTraineeMapUploadForm.controls['validateButton'].disable;    
           this.errorList = [];
           this.validateResult = true;
           this.validationResult = "Validation is successful";
           //this.appTraineeMapUploadForm.controls['validateButton'].enable;           
           this.validateDetail();
     }

     validateDetail() {

      console.log("entered 1");
      this.appTraineeMaps = [];
      let fileReader = new FileReader();

      fileReader.onload = (e:any) => {

                  /* read workbook */
                  const bstr: string = e.target.result;
                  const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
                  /* grab first sheet */
                  const wsname: string = wb.SheetNames[0];
                  const ws = wb.Sheets[wsname];     
                  var jsonObj = {};

                  console.log(XLSX.utils.sheet_to_json(ws,{raw:true}));
                  var json = JSON.stringify(XLSX.utils.sheet_to_json(ws,{raw:true})) ;

                  
                  var maps = JSON.parse(json);
                  

                  console.log("enetered 2");

                  for( var i=2; i< maps.length; i++){
                  }      

                  //####################### Determine the end column index ####################################
                  var j=5;
                  while( ws[this.getColumnName(j)+'1']  !=undefined){
                        j=j+1;
                  }   

                  var endDataColumnIndex = j-2;
            


                  //###################### Validate Email ####################################################
                  var j=5;
                  while( j<=endDataColumnIndex){
                        var email = ws[this.getColumnName(j)+'1'].v;
                        this.validateEmail(email, this.getColumnName(j)+'1' );
                        j=j+1;
                  }      

                  //###################### Validate APP NAME ####################################################
                  for( var i=2; i< maps.length-1; i++){
                        console.log("enetered 2.1");
                        var appName = maps[i][ws['A1'].v];  
                        //alert("appName "+appName);
                        console.log("enetered 2.2");
                        this.validateApp(appName, 'A'+(i+2) );
                        console.log("enetered 2.3");
                  }  
                  
                  //###################### Validate Numeric ####################################################
                  
                  for( var i=2; i< maps.length-1; i++){

                        
                        var j=5;
                        while( j<=endDataColumnIndex){ //1st row contains email address
                                                      
                              var email = ws[this.getColumnName(j)+'1'].v;                                 
                              if (maps[i][email] !=''){                        
                                          var appName = maps[i][ws['A1'].v];  
                                          var fte = maps[i][email];                                                                                       
                                          this.validateNumeric(fte, this.getColumnName(j)+(i+2) );
                              }
                              j= j+1;
                        }                          
                  }     

                  //###################### Validate Negative ####################################################
                  for( var i=2; i< maps.length-1; i++){

                        var j=5;
                        while( j<=endDataColumnIndex){ // 1st row contains email address
                                                      
                              var email = ws[this.getColumnName(j)+'1'].v;                              
                              if (maps[i][email] !=''){                        
                                          var appName = maps[i][ws['A1'].v];  
                                          var fte = maps[i][email];     
                                          //alert("fte "+fte);                                              
                                          this.validateNegative(fte, this.getColumnName(j)+(i+2) );
                              }
                              j= j+1;
                        }                  
                        
                  }                       
                  

                  //###################### Validate TOTAL FTE value ####################################################
            

                  var j=5;
                  while( j<=endDataColumnIndex){ // 
                                                
                  
                        var email = ws[this.getColumnName(j)+'1'].v;   
                        var traineeName = ws[this.getColumnName(j)+'2'].v;                               
                        if (maps[maps.length-1][email] !=''){                                                                  
                                    var totalFte = maps[maps.length-1][email];                                                   
                                    this.validateTotalFte(totalFte, traineeName );
                        }

                        j= j+1;
                  }                  
                        
                  

                  //######################## END OF VALIDATION ################################################
 
                  for( var i=2; i< maps.length-1; i++){

                      
                      var j=5;
                      console.log("enetered 3");

                      while( j<=endDataColumnIndex){ // 1st row contains email address

                            
                            console.log("enetered 4");
                            var email = ws[this.getColumnName(j)+'1'].v;

                            //this.validateEmail(email, this.getColumnName(j)+'1' );

                            if (maps[i][email] !=''){
                                       
                                       //create a new object and push to appTraineeMaps array

                                       console.log("enetered 6");
                                       //get the app name
                                       var appName = maps[i][ws['A1'].v];  
                                       var fte = maps[i][email];   
                                       
                                       console.log("enetered 7");
                                       var appId = this.getAppId(appName);
                                       if (this.appIds !=''){
                                           this.appIds = this.appIds +","+appId;
                                       }else{
                                           this.appIds = appId;
                                       }

                                       console.log("enetered 8");
                                       var traineeId = this.getTraineeId(email);
                                       if (this.traineeIds !=''){
                                            this.traineeIds = this.traineeIds +","+traineeId;
                                       }else{
                                            this.traineeIds = traineeId;
                                       }

                                       console.log("enetered 9");

                                       if (fte !=''){
                                                jsonObj = {"APP_ID":appId, "TRAINEE_ID":traineeId, "FTE":fte };
                                                this.appTraineeMaps.push(jsonObj);
                                       }

                            }
                            j = j + 1;
                       }
                  }  

                  if (this.validateResult == true){
                        this.appTraineeMapUploadForm.controls['validateButton'].enable;   
                  }
                  //this.uploadAppTraineeMap();                                       
      }
      fileReader.readAsBinaryString(this.file);
      
  }        

     getColumnName(columnNumber){       
           return this.excelService.getExcelColumnName(columnNumber);            
     }
  

     getAppId(appName){
           return this.userAccessProfileService.getAppId(appName);
     }

     getTraineeId(email){
           return this.userAccessProfileService.getTraineeId(email);    
     }

     validateEmail(email,cellPosition ){
           // Blank email address not possible
           console.log("enetered 10");

           console.log("enetered 11");
           if  (email == undefined || email == ''){
            console.log("enetered 12");
                       this.errorList.push("Empty cell or undefined Email address, at position:"+cellPosition);
           }

           //alert("this.getTraineeId(email) "+this.getTraineeId(email));
           //alert("this.getTraineeId(email).length "+this.getTraineeId(email).length);

           if  (this.getTraineeId(email) == null || this.getTraineeId(email) == undefined){
                       this.errorList.push("Error: Invalid email found, at position:"+cellPosition);
                       this.validationResult ="Validation not successful";
                       this.validateResult = false;
           }

           //alert("Invalid email found, at position:"+cellPosition);
     }

     validateApp(appName,cellPosition ){

                  if  (appName == undefined || appName == ''){
                  console.log("enetered 12");
                        this.errorList.push("Empty App name or undefined appName, at position:"+cellPosition);
                  }

                  if  (this.getAppId(appName) == null || this.getAppId(appName) == undefined){
                              this.errorList.push("Error: Invalid app name found, at position:"+cellPosition);
                              this.validationResult ="Validation not successful";
                              this.validateResult = false;
                  }      
      }  
      
      validateNumeric(fte,cellPosition ){

            //alert("Non numeric 1");
            if (fte !==undefined){   
                  
                  if (typeof fte === "string" && Number.isNaN(Number(fte))) {

                              this.errorList.push("Error: Non numeric fte value, at position:"+cellPosition);
                              this.validationResult ="Validation not successful";
                              this.validateResult = false;      
                  }
            }

      }        
     
      validateNegative(fte,cellPosition ){

            //alert("fte value inside "+fte);
           /*
           if  (fte == undefined || fte == ''){            
                 this.errorList.push("Error: Empty fte value, at position:"+cellPosition);
                 this.validationResult ="Validation not successful";
                 this.validateResult = false;
           }    
           */        
    
           if  (fte <0){            
                 this.errorList.push("Error: Negative fte value, at position:"+cellPosition);
                 this.validationResult ="Validation not successful";
                 this.validateResult = false;
           }   
           
           if  (+fte >1){            
                 //alert("Getting more than 1 FTE");
                 this.errorList.push("Warning: fte value greater than 1, at position:"+cellPosition);
                 //this.validationResult ="Validation is successful";
                 //For warning validateResult
           }   

     }         

      validateTotalFte(totalFte, traineeName){
            if  (totalFte >1){            
                  this.errorList.push("Warning: fte value greater than 1, for "+traineeName);
            } 
      }
      
     
}
