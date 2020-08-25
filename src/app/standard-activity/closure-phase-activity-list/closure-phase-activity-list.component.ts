import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';



@Component({
  selector: 'app-closure-phase-activity-list',
  templateUrl: './closure-phase-activity-list.component.html',
  styleUrls: ['./closure-phase-activity-list.component.css']
})
export class ClosurePhaseActivityListComponent implements OnInit {

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/phase-activity-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'CLOSURE' }, 
                                                { id: 'phaseTitle', param: 'Closure'}]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
