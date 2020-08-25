import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';


@Component({
  selector: 'app-sprint-backlog-activity-list',
  templateUrl: './sprint-backlog-activity-list.component.html',
  styleUrls: ['./sprint-backlog-activity-list.component.css']
})
export class SprintBacklogActivityListComponent implements OnInit {

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/phase-activity-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'SPRINT_BACKLOG' }, 
                                                { id: 'phaseTitle', param: 'Sprint Backlog'}]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
