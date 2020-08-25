import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';

import { StandardActivityService } from 'Services/standard-activity.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import { Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NavtntService } from 'src/app/navtnt.service';
import { StandardActivity } from 'Vo/standardactivity';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-phase-activity-list',
  templateUrl: './phase-activity-list.component.html',
  styleUrls: ['./phase-activity-list.component.css']
})
export class PhaseActivityListComponent implements OnInit {


  @ViewChild(MatSort) sort: MatSort;
  @Output() messageFromChild = new EventEmitter();


  phase:string="-1";
  phaseName:string;
  standardActivityAddForm: FormGroup;
  activities: any[]=[];
  selected:any;
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

  constructor(private nav: NavtntService, fbuilder: FormBuilder, private standardActivityService: StandardActivityService,  private router: Router, private route: ActivatedRoute) { 


    //this.getStandardActivityList(this.phase); 

    this.standardActivityAddForm = fbuilder.group({
          activities: fbuilder.array([
                fbuilder.array([])
          ])
    })

  }

  @Output() screenNameOfChild = new EventEmitter();
  sendScreenNameToParent() {
       this.screenNameOfChild.emit(this.phaseName+' - Standard Activity - List');
  }
  ngOnInit() {
    
    this.sendScreenNameToParent()
    //alert("ngOnInit of phase activity list called");

    this.dataLoadComplete = false;
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){            
            this.phase = this.nav.getParameterValue(p.filter, 'phase')    
            this.phaseName = this.nav.getParameterValue(p.filter, 'phaseTitle')     
            this.getStandardActivityList(this.phase);      
      }
    });
    

  }


  
  getStandardActivityList(phase){

    //alert(  "Inside getPhaseActivityListList()");
    this.standardActivityService.getStandardActivityList(phase).subscribe((standardActivityAdds:any[]) => {
                     
      console.log("######################################");

      console.log("clients.length "+standardActivityAdds.length); 

        // Clears old data
        this.standardActivityAdds = [];
    
                    
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

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.standardActivityAdds);
      this.dataSource.sort = this.sort;

      this.dataLoadComplete = true;
    
      //this.clients = clients1;

    });    
  }


  /*

  dataLoadChecker(observer:any):any {
        while(!this.dataLoadComplete){
        }

        this.getStandardActivityList(this.phase);      
        observer.next(true);
        observer.complete();
        return {unsubscribe() {}};
  } 

  */
  

  deleteActivities() {


         if (this.activities.length == 0){
                 alert("You have not selected any record to delete!");
         }

         if (this.activities.length > 0){

                  if(confirm("You have selected "+this.activities.length+" record(s). Are you sure to delete?")) {

                          var X='';
                          for(var i=0; i<this.activities.length; i++) {
                                if (i>0){
                                  X = X +',';
                                }  
                                X = X + this.activities[i];
                          }

                          let activitiesParameter = '{"activities":"'+X+'"}'                                                        
                          this.standardActivityService.deleteActivities(activitiesParameter ).subscribe((applications:any[]) => {                     
                                this.getStandardActivityList(this.phase);  
                          });  
                  }        
        }                
  }





  gotoFileUpload() {
       
          //this.router.navigate(['controller-tnt', 'phase-functionality-add/'+phase_name]);

          //this.phase = phase_name;

          //alert("Before redirecting ..."+this.phase);
          var sourceComponentPath = '/admin-home/phase-activity-list';
          var destinationComponentPath = '/admin-home/phase-activity-add';
          var destinationComponentParameterArray = [
                                                      { id: 'phase', param: this.phase }, 
                                                      { id: 'phaseTitle', param: this.phaseName }
                                                   ] 
          this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }


  gotoCreateActivity() {
       
    //this.router.navigate(['controller-tnt', 'phase-functionality-add/'+phase_name]);

    //this.phase = phase_name;

    //alert("Before redirecting ..."+this.phase);
    var sourceComponentPath = '/admin-home/phase-activity-list';
    var destinationComponentPath = '/admin-home/phase-activity-create';
    var destinationComponentParameterArray = [
                                                { id: 'phase', param: this.phase }, 
                                                { id: 'phaseTitle', param: this.phaseName }
                                             ] 
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


  onChange(event) {

          const activities = this.standardActivityAddForm.get('activities') as FormArray;

          if(event.checked) {
                  activities.push(new FormControl(event.source.value))
                  this.activities.push(event.source.value)
          } else {
                  const i = activities.controls.findIndex(x => x.value === event.source.value);
                  activities.removeAt(i);
                  this.activities.splice(i-1,1);
          }
  }

  onUpdate(standardActivityId) {    
        var sourceComponentPath = '/admin-home/phase-activity-list';   
        var destinationComponentPath =   '/admin-home/phase-activity-edit';   
        var destinationComponentParameterArray = [
                                                    { id: 'standardActivityId', param: standardActivityId },
                                                    { id: 'phase', param: this.phase }, 
                                                    { id: 'phaseTitle', param: this.phaseName }                        
                                                 ]         
        this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray);                
  }

}
