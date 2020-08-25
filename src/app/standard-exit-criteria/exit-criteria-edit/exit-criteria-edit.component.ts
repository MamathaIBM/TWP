import { Component, OnInit } from '@angular/core';


import { MatTableDataSource } from '@angular/material';
import { Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NavtntService } from 'src/app/navtnt.service';

import { Observable } from 'rxjs';
import { Keyvalue } from 'Vo/keyvalue';
import { UtilityService } from 'Services/utility.service';
import { ExitCriteria } from 'Vo/exitcriteria';
import { ExitCrieriaService } from 'Services/exit-criteria.service';


@Component({
  selector: 'app-exit-criteria-edit',
  templateUrl: './exit-criteria-edit.component.html',
  styleUrls: ['./exit-criteria-edit.component.css']
})
export class ExitCriteriaEditComponent implements OnInit {

  phase:string="-1";
  phaseName:string;
  exitCriteriaEditForm: FormGroup;

  milestoneOrTasks: Keyvalue[] = [];
  exitCriteriaId:string='';

  //$dataLoadComplete:boolean = false;

  //$dataLoadComplete: Observable<any>;
  dataLoadComplete:boolean;
  dataLoader: Observable<any>;

  //function dataLoadChecker(observer:any):any[]

  exitCriteria: ExitCriteria = {    
        exitCriteriaId:'',
        exitCriteria:'',        
        phaseName:''
  }




  exitCriteriaAdds: ExitCriteria[] = [];
  //exitCriteriaAdds: Observable<[]>;
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'exitCriteriaName', 'milestoneOrTask', 'exitCriteriaId'];

  constructor(private nav: NavtntService, 
              fbuilder: FormBuilder, 
              private utilityService: UtilityService,
              private exitCriteriaService: ExitCrieriaService, 
              private router: Router, 
              private route: ActivatedRoute) { 


    //this.getExitCriteriaedit(this.phase); 

    this.exitCriteriaEditForm = fbuilder.group({
      
      exitCriteriaId:[''],
      exitCriteria:[''],      
      phaseName:['']
    });
  }

  ngOnInit() {
    
    //alert("Exit Criteria Edit");

    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.exitCriteriaId = this.nav.getParameterValue(p.filter, 'exitCriteriaId')   
          this.phase = this.nav.getParameterValue(p.filter, 'phase')    
          this.phaseName = this.nav.getParameterValue(p.filter, 'phaseTitle')              
          this.getExitCriteriaData(this.exitCriteriaId);              
      }
    });
  }


  
  getExitCriteriaData(exitCriteriaId){

    //alert(  "Inside getExitCriteriaeditedit()");
    this.exitCriteriaService.getExitCriteriaData(exitCriteriaId).subscribe((exitCriteriaAdds:any[]) => {
                     
      if (exitCriteriaAdds.length>0){
             // Clears old data
             this.exitCriteriaAdds = [];
      }
                    
      for(var i=0; i<exitCriteriaAdds.length; i++) {

          console.log("Value of i"+i);
          let exitCriteria: ExitCriteria = {            
                exitCriteriaId:'',            
                exitCriteria:'',                          
                phaseName:''            
          }
                    
          exitCriteria.exitCriteriaId = exitCriteriaAdds[i].EXIT_CRITERIA_ID;          
          exitCriteria.exitCriteria = exitCriteriaAdds[i].EXIT_CRITERIA;          
          exitCriteria.phaseName = exitCriteriaAdds[i].PHASE_NAME;

          this.exitCriteriaAdds.push(exitCriteria);
           //this.functionalities.push(exitCriteria.exitCriteriaId);
      }


      this.exitCriteria = this.exitCriteriaAdds.pop();
      this.exitCriteriaEditForm.controls['exitCriteria'].setValue(this.exitCriteria.exitCriteria);
      this.dataSource = new MatTableDataSource(this.exitCriteriaAdds);

      this.dataLoadComplete = true;
  
    });    
  }


  update(){

    this.exitCriteria.exitCriteria = this.exitCriteriaEditForm.controls['exitCriteria'].value;


    if (this.exitCriteria.exitCriteria.trim() == '' ){
          alert("Mandatory fields must not be empty!");
    }else{
        

         var query = "select EXIT_CRITERIA from EXIT_CRITERIA where EXIT_CRITERIA ='"+
         this.exitCriteria.exitCriteria.trim()+"' AND  PHASE_NAME='"+this.phase+"' AND "+
         "EXIT_CRITERIA_ID <>'"+this.exitCriteriaId+"'";
         

         this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

               if (tmp_records.length == 0){
                     this.updateExitCriteria();          
               }else{
                     alert(this.exitCriteria.exitCriteria.trim() +"is already existing ");
               } 

         }); 
    }
} 


  updateExitCriteria(){    
    let standardParameter = '{ "EXIT_CRITERIA": "'+ this.exitCriteria.exitCriteria +'"}';

    //alert(standardParameter);
 
    this.exitCriteriaService.updateExitCriteria(this.exitCriteriaId, standardParameter ).subscribe((applications:any[]) => {
                     
          console.log("##################################################################################################");
          //this.router.navigate(['/admin-home/standard-edit']);

          var sourceComponentPath = '/admin-home/exit-criteria-edit';
          var destinationComponentPath = '/admin-home/exit-criteria-list';
          var destinationComponentParameterArray = [            
            { id: 'phase', param: this.phase }, 
            { id: 'phaseTitle', param: this.phaseName }                        
         ]
          this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)              
    });     
  }  

  cancel(exitCriteriaId) {    
    var sourceComponentPath = '/admin-home/exit-criteria-edit';
    var destinationComponentPath = '/admin-home/exit-criteria-list';
    var destinationComponentParameterArray = [    
      { id: 'phase', param: this.phase }, 
      { id: 'phaseTitle', param: this.phaseName }                        
   ]
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)           
}

}
