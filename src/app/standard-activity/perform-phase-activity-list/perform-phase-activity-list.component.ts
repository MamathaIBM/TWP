import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';


@Component({
  selector: 'app-perform-phase-activity-list',
  templateUrl: './perform-phase-activity-list.component.html',
  styleUrls: ['./perform-phase-activity-list.component.css']
})
export class PerformPhaseActivityListComponent implements OnInit {

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = "/admin-home";
      var destinationComponentPath = "/admin-home/phase-activity-list";
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'AT-PERFORM' }, 
                                                { id: 'phaseTitle', param: 'AT Perform'}]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
