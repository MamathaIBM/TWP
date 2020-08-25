import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-closure-phase-phase-exit-criteria-list',
  templateUrl: './closure-phase-exit-criteria-list.component.html',
  styleUrls: ['./closure-phase-exit-criteria-list.component.css']
})

export class ClosurePhaseExitCriteriaListComponent implements OnInit {



  constructor(private navigation: NavtntService) { }


  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'CLOSURE' }, 
                                                { id: 'phaseTitle', param: 'Closure'}]   

      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }


}
