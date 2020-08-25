import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';


@Component({
  selector: 'app-custom-report-list-admin',
  templateUrl: './custom-report-list-admin.component.html',
  styleUrls: ['./custom-report-list-admin.component.css']
})


export class CustomReportListAdminComponent implements OnInit {

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/custom-report-list';
      //var destinationComponentParameterArray:any = []   
      var destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'admin' }]   

      var destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'admin' },      
      { id: 'report_type', param: 'template' }] 
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
