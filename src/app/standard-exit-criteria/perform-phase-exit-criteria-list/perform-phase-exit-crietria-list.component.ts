import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-perform-plan-phase-exit-criteria-list',
  templateUrl: './perform-phase-exit-criteria-list.component.html',
  styleUrls: ['./perform-phase-exit-criteria-list.component.css']
})

export class PerformPhaseExitCriteriaListComponent implements OnInit {



  constructor(private navigation: NavtntService) { }


  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'AT-PERFORM' }, 
                                                { id: 'phaseTitle', param: 'AT Perform'}]   

      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }


}
