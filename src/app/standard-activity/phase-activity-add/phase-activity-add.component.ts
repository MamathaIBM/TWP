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

@Component({
          selector: 'app-phase-activity-add',
          templateUrl: './phase-activity-add.component.html',
          styleUrls: ['./phase-activity-add.component.css']
})
export class PhaseActivityAddComponent implements OnInit {

    file:any;
    arrayBuffer:any;
    phase:string;
    phaseName:string;


    baseURL = environment.baseUrl


    data: any = [{
            STANDARD_ACTIVITY_NAME: 'Example activity 1...',
            MILESTONE_OR_TASK: 'M'
      },
      {
            STANDARD_ACTIVITY_NAME: 'Example activity 2...',
            MILESTONE_OR_TASK: 'T'
      },
      {
            STANDARD_ACTIVITY_NAME: 'Example activity 3...',
            MILESTONE_OR_TASK: 'T'
      }            
      ];


    constructor(private standardActivityService: StandardActivityService, 
                private navigation : NavtntService, 
                private route: ActivatedRoute,
                private excelService:ExcelService,
                private utilityService: UtilityService 
                ) {
    }

    ngOnInit() {

     
      this.route.queryParams.subscribe((p: any) => {    
            if (p.filter){
                  
                  this.phase = this.navigation.getParameterValue(p.filter, 'phase')    
                  this.phaseName = this.navigation.getParameterValue(p.filter, 'phaseTitle')       
                  
                  //alert("Parameter collection as well "+this.phase);
            }
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
                    var stndardactivityactivities = JSON.stringify(XLSX.utils.sheet_to_json(ws,{raw:true})) ;

                    //alert(stndardactivityactivities);


                    var standardactivity_array = JSON.parse(stndardactivityactivities);
                    
                    var query="";
                    for( var i=0; i< standardactivity_array.length; i++){

                        var activityName = standardactivity_array[i]["STANDARD_ACTIVITY_NAME"];
                        var milestoneOrTask = standardactivity_array[i]["MILESTONE_OR_TASK"];

                        var AND_CONDITION = "(STANDARD_ACTIVITY_NAME='" +activityName+"' AND MILESTONE_OR_TASK='"+milestoneOrTask+"' AND PHASE_NAME='"+this.phase+"') ";
                        
                        if (i==0){
                               query = query + AND_CONDITION;
                        }else{
                               query = query + " OR "+AND_CONDITION;
                        }
                    }    

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
                             this.uploadStandardActivity(stndardactivityactivities);        
                        }else{
                              alert((tmp_records[0].DATA_COL) +" combination is already existing for "+this.phaseName);
                        } 
          
                    });   

                    
                    
        }
        fileReader.readAsBinaryString(this.file);
    }    

    
    uploadStandardActivity(stndardactivityactivities){
      this.standardActivityService.uploadStandardActivity(stndardactivityactivities, this.phase ).subscribe((applications:any[]) => {                     
                          
            console.log("################### createStandardActivity ########################");                              
            //var controllerPath = '/controller-tnt'
            //alert("this.phase  "+this.phase);
            var sourceComponentPath = '/admin-home';
            var destinationComponentPath = '/admin-home/phase-activity-list';                          
            var destinationComponentParameterArray = [
                                                       { id: 'phase', param: this.phase }, 
                                                       { id: 'phaseTitle', param: this.phaseName }
                                                      ] 
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                                
      });          
    }


    cancel() {    
      var sourceComponentPath = '/admin-home/phase-activity-create';
      var destinationComponentPath = '/admin-home/phase-activity-list';
      var destinationComponentParameterArray = [    
        { id: 'phase', param: this.phase }, 
        { id: 'phaseTitle', param: this.phaseName }                        
     ]
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
