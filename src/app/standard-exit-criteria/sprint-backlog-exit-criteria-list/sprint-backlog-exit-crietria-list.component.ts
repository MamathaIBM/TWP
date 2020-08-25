import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-sprint-backlog-exit-criteria-list',
  templateUrl: './sprint-backlog-exit-criteria-list.component.html',
  styleUrls: ['./sprint-backlog-exit-criteria-list.component.css']
})

export class SprintBacklogExitCriteriaListComponent implements OnInit {



  constructor(private navigation: NavtntService) { }


  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'SPRINT_BACKLOG' }, 
                                                { id: 'phaseTitle', param: 'Sprint Backlog'}]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }


}
