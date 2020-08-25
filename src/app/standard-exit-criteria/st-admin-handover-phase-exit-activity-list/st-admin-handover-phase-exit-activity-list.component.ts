import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-st-admin-handover-phase-exit-activity-list',
  templateUrl: './st-admin-handover-phase-exit-activity-list.component.html',
  styleUrls: ['./st-admin-handover-phase-exit-activity-list.component.css']
})
export class StAdminHandoverPhaseExitActivityListComponent implements OnInit {

  constructor(private navigation: NavtntService) { }


  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'ST-HANDOVER' }, 
      { id: 'phaseTitle', param: 'ST Handover'}]   

      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
