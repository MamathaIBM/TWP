import { Component, OnInit } from '@angular/core';
import { NavtntService } from 'src/app/navtnt.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-custom-report-add-admin',
  templateUrl: './custom-report-add-admin.component.html',
  styleUrls: ['./custom-report-add-admin.component.css']
})


export class CustomReportAddAdminComponent implements OnInit {


  reportType='';

  constructor(private navigation: NavtntService,private route: ActivatedRoute) { }

  ngOnInit() {
            //var controllerPath = '/controller-tnt'
      var sourceComponentPath = '/admin-home';
      var destinationComponentPath = '/admin-home/custom-report-add';


      this.route.queryParams.subscribe((p: any) => {    
        if (p.filter){ 
         
              var customReportId = this.navigation.getParameterValue(p.filter, 'customReportId');   
              this.reportType = this.navigation.getParameterValue(p.filter, 'report_type');      
              
              //alert("this.reportType "+this.reportType);

              var destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'admin' },
                                                        { id: 'customReportId', param: customReportId },
                                                        { id: 'report_type', param: this.reportType }
                                                       ]   
              this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

       }
   });

  }
}


