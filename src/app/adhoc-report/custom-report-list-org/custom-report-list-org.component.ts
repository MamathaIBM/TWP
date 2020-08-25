import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';


@Component({
      selector: 'app-custom-report-list-org',
      templateUrl: './custom-report-list-org.component.html',
      styleUrls: ['./custom-report-list-org.component.css']
})


export class CustomReportListOrgComponent implements OnInit {

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/custom-report-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'admin' },
                                                { id: 'report_type', param: 'org' }]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
