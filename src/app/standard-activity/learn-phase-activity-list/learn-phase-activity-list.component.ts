import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';


@Component({
  selector: 'app-learn-phase-activity-list',
  templateUrl: './learn-phase-activity-list.component.html',
  styleUrls: ['./learn-phase-activity-list.component.css']
})
export class LearnPhaseActivityListComponent implements OnInit {

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/phase-activity-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'AT-LEARN' }, 
                                                { id: 'phaseTitle', param: 'AT Learn'}]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
