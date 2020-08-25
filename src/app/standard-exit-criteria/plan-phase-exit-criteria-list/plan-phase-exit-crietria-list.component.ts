import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-plan-phase-exit-criteria-list',
  templateUrl: './plan-phase-exit-criteria-list.component.html',
  styleUrls: ['./plan-phase-exit-criteria-list.component.css']
})

export class PlanPhaseExitCriteriaListComponent implements OnInit {



  constructor(private navigation: NavtntService) { }


  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'AT-PLAN' }, 
                                                { id: 'phaseTitle', param: 'AT Plan'}]   

      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }


}
