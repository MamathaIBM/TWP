import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';


@Component({
  selector: 'app-plan-phase-activity-list',
  templateUrl: './plan-phase-activity-list.component.html',
  styleUrls: ['./plan-phase-activity-list.component.css']
})
export class PlanPhaseActivityListComponent implements OnInit {

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/phase-activity-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'AT-PLAN' }, 
                                                { id: 'phaseTitle', param: 'AT Plan'}]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
