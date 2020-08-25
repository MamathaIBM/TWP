

import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

import { NavtntService } from 'src/app/navtnt.service';
import { ActivatedRoute } from '@angular/router';
import { ExitCrieriaService } from 'Services/exit-criteria.service';
import { ExcelService } from 'Services/excel.service';
import { UtilityService } from 'Services/utility.service';

@Component({
          selector: 'app-exit-criteria-add',
          templateUrl: './exit-criteria-add.component.html',
          styleUrls: ['./exit-criteria-add.component.css']
})
export class ExitCriteriaAddComponent implements OnInit {

    file:any;
    arrayBuffer:any;
    phase:string;
    phaseName:string;
    data: any = [{
                        EXIT_CRITERIA: 'Example exit criteria 1...'      
                  },
                  {
                        EXIT_CRITERIA: 'Example exit criteria 2...'      
                  },
                  {
                        EXIT_CRITERIA: 'Example exit criteria 3...'      
                  },            
                ];



    constructor(private exitCriteriaService: ExitCrieriaService, 
                private navigation : NavtntService, 
                private route: ActivatedRoute,
                private excelService: ExcelService,
                private utilityService: UtilityService ) {
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
                    var exitCriterion = JSON.stringify(XLSX.utils.sheet_to_json(ws,{raw:true})) ;


                    var exitCriterion_array = JSON.parse(exitCriterion);
                    
                    var query="";
                    for( var i=0; i< exitCriterion_array.length; i++){

                        var exitCriteria = exitCriterion_array[i]["EXIT_CRITERIA"];
                        

                        var AND_CONDITION = "(EXIT_CRITERIA='" +exitCriteria+"' AND PHASE_NAME='"+this.phase+"') ";
                        
                        if (i==0){
                               query = query + AND_CONDITION;
                        }else{
                               query = query + " OR "+AND_CONDITION;
                        }
                    }    

                    if (exitCriterion_array.length == 0){
                          alert("Empty data excel");
                    }else{
                          //form the final query
                          query = "select CONCAT(EXIT_CRITERIA) AS DATA_COL "+
                                  " from EXIT_CRITERIA "+
                                  " where "+query;
                    }
                    
                    //alert(query);

                    this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

                        if (tmp_records.length == 0){
                             this.uploadExitCriteria(exitCriterion);        
                        }else{
                              alert((tmp_records[0].DATA_COL) +" is already existing for "+this.phaseName);
                        } 
          
                    });                       

                                    

                    
        }
        fileReader.readAsBinaryString(this.file);
    }    

    uploadExitCriteria(exitCriterion){
      this.exitCriteriaService.uploadExitCriteria(exitCriterion,this.phase).subscribe((applications:any[]) => {                     
                          
            console.log("################### createExitCriteria ########################");                              
            //var controllerPath = '/controller-tnt'
            //alert("this.phase  "+this.phase);
            var sourceComponentPath = '/admin-home';
            var destinationComponentPath = '/admin-home/exit-criteria-list';                          
            var destinationComponentParameterArray = [
                                                       { id: 'phase', param: this.phase }, 
                                                       { id: 'phaseTitle', param: this.phaseName }
                                                      ] 
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                                
      });
    }

    
    cancel() {    
        
      var sourceComponentPath = '/admin-home/exit-criteria-add';
      var destinationComponentPath = '/admin-home/exit-criteria-list';
      var destinationComponentParameterArray = [    
        { id: 'phase', param: this.phase }, 
        { id: 'phaseTitle', param: this.phaseName }                        
     ]
     this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)           
    }
    
    exportAsXLSX() {
      this.excelService.exportAsExcelFile(this.data, 'sample');
    }


}
