import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-service-backlog-exit-criteria-list',
  templateUrl: './service-backlog-exit-criteria-list.component.html',
  styleUrls: ['./service-backlog-exit-criteria-list.component.css']
})

export class ServiceBacklogExitCriteriaListComponent implements OnInit {



  constructor(private navigation: NavtntService) { }


  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/exit-criteria-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'SERVICE_BACKLOG' }, 
                                                { id: 'phaseTitle', param: 'Service Backlog'}]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }


}
