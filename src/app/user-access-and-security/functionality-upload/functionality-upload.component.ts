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

@Component({
          selector: 'app-functionality-upload',
          templateUrl: './functionality-upload.component.html',
          styleUrls: ['./functionality-upload.component.css']
})
export class FunctionalityUploadComponent implements OnInit {

    file:any;
    arrayBuffer:any;
    phase:string;
    phaseName:string;


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


    constructor(private functionalityService: FunctionalityService, 
                private navigation : NavtntService, 
                private route: ActivatedRoute,
                private excelService:ExcelService,
                private utilityService: UtilityService 
                ) {
    }

    ngOnInit() {

     
      this.route.queryParams.subscribe((p: any) => {    

      });      
          
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
        let fileReader = new FileReader();
        fileReader.onload = (e:any) => {



                    /* read workbook */
                    const bstr: string = e.target.result;
                    const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
                    /* grab first sheet */
                    const wsname: string = wb.SheetNames[0];
                    const ws: XLSX.WorkSheet = wb.Sheets[wsname];  
                    


                    console.log(XLSX.utils.sheet_to_json(ws,{raw:true}));
                    var functionalities = JSON.stringify(XLSX.utils.sheet_to_json(ws,{raw:true})) ;
                    this.uploadFunctionalities(functionalities); 
                    


                    var functionality_array = JSON.parse(functionalities);
                    
                    var query="";
                    for( var i=0; i< functionality_array.length; i++){

                        var activityName = functionality_array[i]["FUNC_NAME"];

                        /*
                        var routerLink = functionality_array[i]["FUNC_ROUTERLINK"];
                        var funcDefault = functionality_array[i]["FUNC_DEFAULT"];
                        var funcUOI = functionality_array[i]["FUNC_UOI"];
                        var funcOpType = functionality_array[i]["FUNC_OPERATION_TYPE"];
                        var funcDescription = functionality_array[i]["FUNC_DESCRIPTION"];
                        var funcModule = functionality_array[i]["FUNC_MODULE"];
                        var funcDependency = functionality_array[i]["FUNC_TRANSITION_DEPENDENCY"];
                        */

                        var AND_CONDITION = "(FUNC_ROUTERLINK='" +activityName+"') ";
                        
                        if (i==0){
                               query = query + AND_CONDITION;
                        }else{
                               query = query + " OR "+AND_CONDITION;
                        }
                    }    


                    /*
                    if (standardactivity_array.length == 0){
                          alert("Empty data excel");
                    }else{
                          //form the final query
                          query = "select CONCAT(STANDARD_ACTIVITY_NAME, MILESTONE_OR_TASK) AS DATA_COL "+
                                  " from STANDARD_ACTIVITY "+
                                  " where "+query;
                    }
                    
                    //alert(query);

                    this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

                        if (tmp_records.length == 0){
                             // this.uploadStandardActivity(stndardactivityactivities);        
                        }else{
                              alert((tmp_records[0].DATA_COL) +" combination is already existing for "+this.phaseName);
                        } 
          
                    });   

                    */

                    
                    
        }
        fileReader.readAsBinaryString(this.file);
    }    

    
    uploadFunctionalities(functionalities){
      this.functionalityService.uploadFunctionalities(functionalities).subscribe((functionalities:any[]) => {                     
                          
            console.log("################### upload functionality ########################");                              

            var sourceComponentPath = '/admin-home/functionality-upload';
            var destinationComponentPath = '/admin-home/functionality-list';
            var destinationComponentParameterArray = []
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                                
      });          
    }


    cancel() {    
      var sourceComponentPath = '/admin-home/functionality-upload';
      var destinationComponentPath = '/admin-home/functionality-list';
      var destinationComponentParameterArray = []
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)           
   }
    
   //exportAsXLSX() {  
      //this.traineeForm.controls['LAST_UPDATED_BY'].setValue(this.username)
      //this._Ser.getexecelfile(this.traineeForm.controls['LAST_UPDATED_BY'].value);
      // window.open(this.baseURL+'/getexcelTrainee');
    
    //}  



    //exportAsXLSX() {
      //this.excelService.exportAsExcelFile(this.data, 'sample');
      //this.excelService.excel();

      
      //this.excelService.excel().toPromise()
      //.then(response => this.saveToFileSystem(response));
      
      

      //{ responseType: 'text' }

    //}


    /*
    private saveToFileSystem(response) {
      const blob = new Blob([JSON.stringify(response.body)], { type: 'application/vnd.ms-excel;charset=utf-8' });
      FileSaver.saveAs(blob, "Report.xls");
    }
    */
    

    exportAsXLSX() {
            this.excelService.exportAsExcelFile(this.data, 'sample');
    }


}
