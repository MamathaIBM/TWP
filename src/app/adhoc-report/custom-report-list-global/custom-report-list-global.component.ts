import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';


@Component({
      selector: 'app-custom-report-list-global',
      templateUrl: './custom-report-list-global.component.html',
      styleUrls: ['./custom-report-list-global.component.css']
})


export class CustomReportListGlobalComponent implements OnInit {

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/custom-report-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'admin' },
                                                { id: 'report_type', param: 'global' }]   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
