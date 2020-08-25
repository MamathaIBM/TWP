import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-learn-plan-phase-exit-criteria-list',
  templateUrl: './learn-phase-exit-criteria-list.component.html',
  styleUrls: ['./learn-phase-exit-criteria-list.component.css']
})

export class LearnPhaseExitCriteriaListComponent implements OnInit {



  constructor(private navigation: NavtntService) { }


  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'AT-LEARN' }, 
                                                { id: 'phaseTitle', param: 'AT Learn'}]   

      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }


}
