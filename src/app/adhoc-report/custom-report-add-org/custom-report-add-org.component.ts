import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-custom-report-add-org',
  templateUrl: './custom-report-add-org.component.html',
  styleUrls: ['./custom-report-add-org.component.css']
})


export class CustomReportAddOrgComponent implements OnInit {

  constructor(private navigation: NavtntService,private route: ActivatedRoute) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/custom-report-add';


      this.route.queryParams.subscribe((p: any) => {    
        if (p.filter){ 
         
              var customReportId = this.navigation.getParameterValue(p.filter, 'customReportId');                  
              var destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'admin' },
                                                        { id: 'customReportId', param: customReportId },
                                                        { id: 'report_type', param: 'org' }]   
              this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

       }
   });

  }
}


