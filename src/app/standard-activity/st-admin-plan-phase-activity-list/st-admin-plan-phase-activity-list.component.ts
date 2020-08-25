import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-st-admin-plan-phase-activity-list',
  templateUrl: './st-admin-plan-phase-activity-list.component.html',
  styleUrls: ['./st-admin-plan-phase-activity-list.component.css']
})
export class StAdminPlanPhaseActivityListComponent implements OnInit {


  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/phase-activity-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'ST-PLAN' }, 
                                                { id: 'phaseTitle', param: 'ST Plan'}]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
