import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-service-backlog-activity-list',
  templateUrl: './service-backlog-activity-list.component.html',
  styleUrls: ['./service-backlog-activity-list.component.css']
})
export class ServiceBacklogActivityListComponent implements OnInit {

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/phase-activity-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'phase', param: 'SERVICE_BACKLOG' }, 
                                                { id: 'phaseTitle', param: 'Service Backlog'}]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
