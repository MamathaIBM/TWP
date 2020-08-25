import { Component, OnInit, ViewChild } from '@angular/core';


import { MatTableDataSource, MatSort } from '@angular/material';
import { Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder, FormControl, FormArray } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NavtntService } from 'src/app/navtnt.service';

import { Observable } from 'rxjs';
import { ExitCriteria } from 'Vo/exitcriteria';
import { ExitCrieriaService } from 'Services/exit-criteria.service';


@Component({
  selector: 'app-exit-criteria-list',
  templateUrl: './exit-criteria-list.component.html',
  styleUrls: ['./exit-criteria-list.component.css']
})

export class ExitCriteriaListComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  phase:string="-1";
  phaseName:string;
  exitCriteriaAddForm: FormGroup;
  exitCriteriaList: any[]=[];
  selected:any;
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
  displayedColumns: string[] = [ 'exitCriteria',  'exitCriteriaId'];

  constructor(private nav: NavtntService, fbuilder: FormBuilder, private exitCriteriaService: ExitCrieriaService,  private router: Router, private route: ActivatedRoute) { 


    //this.getExitCriteriaList(this.exit); 

    this.exitCriteriaAddForm = fbuilder.group({
           exitCriteriaList: fbuilder.array([
                fbuilder.array([])
          ])
    })
  }

  ngOnInit() {
    
    //alert("ngOnInit of exit activity list called");

    this.dataLoadComplete = false;
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){            
            this.phase = this.nav.getParameterValue(p.filter, 'phase')    
            this.phaseName = this.nav.getParameterValue(p.filter, 'phaseTitle')     
            this.getExitCriteriaList(this.phase);      
      }
    });
    
  }


  
  getExitCriteriaList(exit){

    //alert(  "Inside getExitCriteriaListList()");
    this.exitCriteriaService.getExitCriteriaList(exit).subscribe((exitCriteriaAdds:any[]) => {
                     
      console.log("######################################");

      console.log("clients.length "+exitCriteriaAdds.length); 


      this.exitCriteriaAdds = [];
                        
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

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.exitCriteriaAdds);
      this.dataSource.sort = this.sort;

      this.dataLoadComplete = true;
    
      //this.clients = clients1;

    });    
  }


  /*

  dataLoadChecker(observer:any):any {

        while(!this.dataLoadComplete){
        }

        this.getExitCriteriaList(this.phase);      
        observer.next(true);
        observer.complete();
        return {unsubscribe() {}};
  } 

  */
  

  deleteExitCriteria() {

    if (this.exitCriteriaList.length == 0){
         alert("You have not selected any record to delete! ");
    }  

                
    if (this.exitCriteriaList.length > 0){

          if(confirm("You have selected "+this.exitCriteriaList.length+" record(s). Are you sure to delete?")) {

                    var X='';
                    for(var i=0; i<this.exitCriteriaList.length; i++) {
                        if (i>0){
                          X = X +',';
                        }  
                        X = X + this.exitCriteriaList[i];
                    }

                    let exitCriteriaParameter = '{"exitCriteriaList":"'+X+'"}'
                                      
                        this.exitCriteriaService.deleteExitCriteria(exitCriteriaParameter ).subscribe((exitCriteriaList:any[]) => {                     
                          console.log("###########################################################################");
                          this.getExitCriteriaList(this.phase); 
                        });     
           }                                
    }          
  }





  gotoFileUpload() {
       
          //this.router.navigate(['controller-tnt', 'exit-functionality-add/'+exit_name]);

          //this.exit = exit_name;

          //alert("Before redirecting ..."+this.exit);
          var sourceComponentPath = "/admin-home/exit-criteria-list";
          var destinationComponentPath = "/admin-home/exit-criteria-add";
          var destinationComponentParameterArray = [
                                                      { id: 'phase', param: this.phase }, 
                                                      { id: 'phaseTitle', param: this.phaseName }
                                                   ] 
          this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }

  gotoAddExitCriteria() {
       
    //this.router.navigate(['controller-tnt', 'exit-functionality-add/'+exit_name]);

    //this.exit = exit_name;

    //alert("Before redirecting ..."+this.exit);
    var sourceComponentPath = "/admin-home/exit-criteria-list";
    var destinationComponentPath = "/admin-home/exit-criteria-create";
    var destinationComponentParameterArray = [
                                                { id: 'phase', param: this.phase }, 
                                                { id: 'phaseTitle', param: this.phaseName }
                                             ] 
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


  onChange(event) {

    const exitCriteriaList = this.exitCriteriaAddForm.get('exitCriteriaList') as FormArray;

    if(event.checked) {
            exitCriteriaList.push(new FormControl(event.source.value))
            this.exitCriteriaList.push(event.source.value)
    } else {
            const i = exitCriteriaList.controls.findIndex(x => x.value === event.source.value);
            exitCriteriaList.removeAt(i);
            this.exitCriteriaList.splice(i-1,1);
    }
}

  onUpdate(exitCriteriaId) {    

    //alert("exitCriteriaId "+exitCriteriaId);
    var sourceComponentPath = '/admin-home/exit-criteria-list';   
    var destinationComponentPath =   '/admin-home/exit-criteria-edit';   
    var destinationComponentParameterArray = [
                                                { id: 'exitCriteriaId', param: exitCriteriaId },
                                                { id: 'phase', param: this.phase }, 
                                                { id: 'phaseTitle', param: this.phaseName }                        
                                             ]         
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray);                
}

}
