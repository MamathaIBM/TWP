import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-st-admin-define-phase-exit-activity-list',
  templateUrl: './st-admin-define-phase-exit-activity-list.component.html',
  styleUrls: ['./st-admin-define-phase-exit-activity-list.component.css']
})
export class StAdminDefinePhaseExitActivityListComponent implements OnInit {


  constructor(private navigation: NavtntService) { }


  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'ST-DEFINE' }, 
                { id: 'phaseTitle', param: 'ST Define'}]    

      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
