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
  selector: 'app-phase-activity-edit',
  templateUrl: './phase-activity-edit.component.html',
  styleUrls: ['./phase-activity-edit.component.css']
})
export class PhaseActivityEditComponent implements OnInit {

  phase:string="-1";
  phaseName:string;
  phaseActivityEditForm: FormGroup;

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


    //this.getStandardActivityedit(this.phase); 

    this.phaseActivityEditForm = fbuilder.group({
      
      standardActivityId:[''],
      standardActivityName:[''],
      milestoneOrTask:[''],
      phaseName:['']
    });
  }

  ngOnInit() {
    
    this.milestoneOrTasks = this.utilityService.getMilestoneOrTask();

    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.standardActivityId = this.nav.getParameterValue(p.filter, 'standardActivityId')   
          this.phase = this.nav.getParameterValue(p.filter, 'phase')    
          this.phaseName = this.nav.getParameterValue(p.filter, 'phaseTitle')              
          this.getStandardActivityData(this.standardActivityId);              
      }
    });
  }


  
  getStandardActivityData(standardActivityId){

    //alert(  "Inside getPhaseActivityeditedit()");
    this.standardActivityService.getStandardActivityData(standardActivityId).subscribe((standardActivityAdds:any[]) => {
                     
      if (standardActivityAdds.length>0){
             // Clears old data
             this.standardActivityAdds = [];
      }
                    
      for(var i=0; i<standardActivityAdds.length; i++) {

          console.log("Value of i"+i);
          let standardActivity: StandardActivity = {            
                standardActivityId:'',            
                standardActivityName:'',  
                milestoneOrTask:'',          
                phaseName:''            
          }
                    
          standardActivity.standardActivityId = standardActivityAdds[i].STANDARD_ACTIVITY_ID;          
          standardActivity.standardActivityName = standardActivityAdds[i].STANDARD_ACTIVITY_NAME;
          standardActivity.milestoneOrTask = standardActivityAdds[i].MILESTONE_OR_TASK;
          standardActivity.phaseName = standardActivityAdds[i].PHASE_NAME;

          this.standardActivityAdds.push(standardActivity);
           //this.functionalities.push(standardActivity.standardActivityId);
      }


      this.standardActivity = this.standardActivityAdds.pop();
      
      this.phaseActivityEditForm.controls['standardActivityName'].setValue(this.standardActivity.standardActivityName);
      this.phaseActivityEditForm.controls['milestoneOrTask'].setValue(this.standardActivity.milestoneOrTask);

      this.dataSource = new MatTableDataSource(this.standardActivityAdds);

      this.dataLoadComplete = true;
    
      //this.clients = clients1;

    });    
  }


  update(){

    this.standardActivity.standardActivityName = this.phaseActivityEditForm.controls['standardActivityName'].value;
    this.standardActivity.milestoneOrTask = this.phaseActivityEditForm.controls['milestoneOrTask'].value;

    if (this.standardActivity.standardActivityName.trim() == '' || this.standardActivity.milestoneOrTask.trim() ==''){
          alert("Mandatory fields must not be empty!");
    }else{

      var query = "select STANDARD_ACTIVITY_NAME from STANDARD_ACTIVITY where STANDARD_ACTIVITY_NAME='"+
                  this.standardActivity.standardActivityName.trim()+"' AND  PHASE_NAME='"+this.phase+"' AND "+
                  "MILESTONE_OR_TASK='"+this.standardActivity.milestoneOrTask.trim()+"' AND "+
                  "STANDARD_ACTIVITY_ID <> '"+this.standardActivityId+"'";

      this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

            if (tmp_records.length == 0){
                  this.updateStandardActivity();          
            }else{
                  alert(this.standardActivity.standardActivityName.trim() +" is already existing ");
            } 

      });     
    }
}


  updateStandardActivity(){    
    let standardParameter = '{ "STANDARD_ACTIVITY_NAME": "'+ this.standardActivity.standardActivityName+ '","MILESTONE_OR_TASK":"'+ this.standardActivity.milestoneOrTask +'"}';

    //alert(standardParameter);
 
    this.standardActivityService.updateStandardActivity(this.standardActivityId, standardParameter ).subscribe((applications:any[]) => {
                     
          console.log("##################################################################################################");
          //this.router.navigate(['/admin-home/standard-edit']);

          var sourceComponentPath = '/admin-home/phase-activity-edit';
          var destinationComponentPath = '/admin-home/phase-activity-list';
          var destinationComponentParameterArray = [            
            { id: 'phase', param: this.phase }, 
            { id: 'phaseTitle', param: this.phaseName }                        
         ]
          this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)              
    });     
  }  

  cancel(standardActivityId) {    
    var sourceComponentPath = '/admin-home/phase-activity-edit';
    var destinationComponentPath = '/admin-home/phase-activity-list';
    var destinationComponentParameterArray = [    
      { id: 'phase', param: this.phase }, 
      { id: 'phaseTitle', param: this.phaseName }                        
   ]
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)           
}

}
