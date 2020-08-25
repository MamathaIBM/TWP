import { Component, OnInit } from '@angular/core';

import { StandardActivityService } from 'Services/standard-activity.service';
import { MatTableDataSource } from '@angular/material';
import { Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NavtntService } from 'src/app/navtnt.service';
import { StandardActivity } from 'Vo/standardactivity';
import { Observable } from 'rxjs';
import { Keyvalue } from 'Vo/keyvalue';
import { UtilityService } from 'Services/utility.service';


@Component({
  selector: 'app-phase-activity-create',
  templateUrl: './phase-activity-create.component.html',
  styleUrls: ['./phase-activity-create.component.css']
})
export class PhaseActivityCreateComponent implements OnInit {

  phase:string="-1";
  phaseName:string;
  phaseActivityCreateForm: FormGroup;

  milestoneOrTasks: Keyvalue[] = [];
  standardActivityId:string='';

  //$dataLoadComplete:boolean = false;

  //$dataLoadComplete: Observable<any>;
  dataLoadComplete:boolean;
  dataLoader: Observable<any>;

  //function dataLoadChecker(observer:any):any[]

  standardActivity: StandardActivity = {    
        standardActivityId:'',
        standardActivityName:'',
        milestoneOrTask:'',
        phaseName:''
  }

  standardActivityAdds: StandardActivity[] = [];
  //standardActivityAdds: Observable<[]>;
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'standardActivityName', 'milestoneOrTask', 'standardActivityId'];

  constructor(private nav: NavtntService, 
              fbuilder: FormBuilder, 
              private utilityService: UtilityService,
              private standardActivityService: StandardActivityService, 
              private router: Router, 
              private route: ActivatedRoute) { 


    //this.getStandardActivitycreate(this.phase); 

    this.phaseActivityCreateForm = fbuilder.group({
      
      standardActivityId:[''],
      standardActivityName:[''],
      milestoneOrTask:[''],
      phaseName:['']
    });
  }

  ngOnInit() {
    
    this.milestoneOrTasks = this.utilityService.getMilestoneOrTask();
    this.standardActivity= {            
      standardActivityId:'',            
      standardActivityName:'',  
      milestoneOrTask:'',          
      phaseName:''            
    }
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.standardActivityId = this.nav.getParameterValue(p.filter, 'standardActivityId')   
          this.phase = this.nav.getParameterValue(p.filter, 'phase')    
          this.phaseName = this.nav.getParameterValue(p.filter, 'phaseTitle')                          
      }
    });
  }


  create(){


      this.standardActivity.standardActivityName = this.phaseActivityCreateForm.controls['standardActivityName'].value;
      this.standardActivity.milestoneOrTask = this.phaseActivityCreateForm.controls['milestoneOrTask'].value;

      if (this.standardActivity.standardActivityName.trim() == '' || this.standardActivity.milestoneOrTask.trim() ==''){
            alert("Mandatory fields must not be empty!");
      }else{

        var query = "select STANDARD_ACTIVITY_NAME from STANDARD_ACTIVITY where STANDARD_ACTIVITY_NAME='"+
                    this.standardActivity.standardActivityName.trim()+"' AND  PHASE_NAME='"+this.phase+"' AND "+
                    "MILESTONE_OR_TASK='"+this.standardActivity.milestoneOrTask.trim()+"'";

        this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

              if (tmp_records.length == 0){
                    this.createStandardActivity();          
              }else{
                    alert(this.standardActivity.standardActivityName.trim() +"is already existing ");
              } 

        });     
      }
  }

  createStandardActivity(){    

    let standardParameter = '{ "STANDARD_ACTIVITY_NAME": "'+ this.standardActivity.standardActivityName + 
                            '","MILESTONE_OR_TASK":"'+ this.standardActivity.milestoneOrTask +
                            '","PHASE":"'+this.phase+'"}';
 
    this.standardActivityService.createStandardActivity(this.standardActivityId, standardParameter ).subscribe((applications:any[]) => {
                     
          console.log("##################################################################");
          //this.router.navigate(['/admin-home/standard-create']);

          var sourceComponentPath = '/admin-home/phase-activity-create';
          var destinationComponentPath = '/admin-home/phase-activity-list';
          var destinationComponentParameterArray = [            
            { id: 'phase', param: this.phase }, 
            { id: 'phaseTitle', param: this.phaseName }                        
         ]
          this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)              
    });     
  }  

  cancel(standardActivityId) {    
    var sourceComponentPath = '/admin-home/phase-activity-create';
    var destinationComponentPath = '/admin-home/phase-activity-list';
    var destinationComponentParameterArray = [    
      { id: 'phase', param: this.phase }, 
      { id: 'phaseTitle', param: this.phaseName }                        
   ]
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)           
}


  

}
