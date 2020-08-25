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
  selector: 'app-exit-criteria-create',
  templateUrl: './exit-criteria-create.component.html',
  styleUrls: ['./exit-criteria-create.component.css']
})
export class ExitCriteriaCreateComponent implements OnInit {

  phase:string="-1";
  phaseName:string;
  exitCriteriaCreateForm: FormGroup;

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


    //this.getExitCriteriacreate(this.phase); 

    this.exitCriteriaCreateForm = fbuilder.group({
      
      exitCriteriaId:[''],
      exitCriteria:[''],      
      phaseName:['']
    });
  }

  ngOnInit() {
    
    this.exitCriteria = {            
                          exitCriteriaId:'',            
                          exitCriteria:'',                          
                          phaseName:''            
                        }

    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.exitCriteriaId = this.nav.getParameterValue(p.filter, 'exitCriteriaId')   
          this.phase = this.nav.getParameterValue(p.filter, 'phase')    
          this.phaseName = this.nav.getParameterValue(p.filter, 'phaseTitle')              
                  
      }
    });
  }


  create(){


       this.exitCriteria.exitCriteria = this.exitCriteriaCreateForm.controls['exitCriteria'].value;
    

       if (this.exitCriteria.exitCriteria.trim() == '' ){
             alert("Mandatory fields must not be empty!");
       }else{
           

            var query = "select EXIT_CRITERIA from EXIT_CRITERIA where EXIT_CRITERIA ='"+
            this.exitCriteria.exitCriteria.trim()+"' AND  PHASE_NAME='"+this.phase+"'  ";
            

            this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

                  if (tmp_records.length == 0){
                        this.createExitCriteria();          
                  }else{
                        alert(this.exitCriteria.exitCriteria.trim() +"is already existing ");
                  } 

            }); 
       }
  }




  createExitCriteria(){    
    let standardParameter = '{ "EXIT_CRITERIA": "'+ this.exitCriteria.exitCriteria +
                            '",  "PHASE":"'+ this.phase + '"}';

    //alert(standardParameter);
 
    this.exitCriteriaService.createExitCriteria( standardParameter ).subscribe((applications:any[]) => {
                     
          console.log("##################################################################################################");
          //this.router.navigate(['/admin-home/standard-create']);

          var sourceComponentPath = '/admin-home/exit-criteria-create';
          var destinationComponentPath = '/admin-home/exit-criteria-list';
          var destinationComponentParameterArray = [            
            { id: 'phase', param: this.phase }, 
            { id: 'phaseTitle', param: this.phaseName }                        
         ]
          this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)              
    });     
  }  

  cancel() {    
    var sourceComponentPath = '/admin-home/exit-criteria-create';
    var destinationComponentPath = '/admin-home/exit-criteria-list';
    var destinationComponentParameterArray = [    
      { id: 'phase', param: this.phase }, 
      { id: 'phaseTitle', param: this.phaseName }                        
   ]
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)           
   }

}
