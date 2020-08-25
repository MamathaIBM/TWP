import { Component, OnInit } from '@angular/core';
import { CustomReport } from 'Vo/customReport';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from 'src/app/navtnt.service';
import { CustomReportService } from 'Services/customreport.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-custom-report-list-adopt',
  templateUrl: './custom-report-list-adopt.component.html',
  styleUrls: ['./custom-report-list-adopt.component.css']
})
export class CustomReportListAdoptComponent implements OnInit {


  dataLength = 0;
  baseURL = environment.AdminbaseUrl;
  customOrAdmin='custom';
  reportType = 'template';

  customReport: CustomReport = {
    customReportId:'',
    customReportName:'',    
    reportType:'',    
    transitionId: '',
    lastModified:'' ,
    version:'',
    path:'',
    reportGenerationTime:''
  }

  customReports: CustomReport[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'customReportName',  'version', 'lastModified', 'customReportId'];

  constructor(private navigation: NavtntService, private userAccessProfileService: UserAccessProfileService, 
              private customReportService: CustomReportService, private  route: ActivatedRoute) { 

             }

  ngOnInit() {
       

       this.route.queryParams.subscribe((p: any) => {    
        if (p.filter){          
              this.customOrAdmin = this.navigation.getParameterValue(p.filter, 'custom_or_admin');               
              this.getCustomReportList(this.customOrAdmin);     
        }
      });
  }



  getCustomReportList(customOrAdmin){

    console.log(  "getCustomReportList()"); 
    this.customReportService.getCustomReportList(this.userAccessProfileService.getCurrentTransitionID(),'admin', this.reportType ).subscribe((customReports:any[]) => {

      if (customReports != undefined)
          if (customReports.length>0){
                // Clears old data
                this.customReports = [];
          }
             
      if (customReports != undefined)
          for(var i=0; i<customReports.length; i++) {

              let customReport: CustomReport = {
                    customReportId:'',
                    customReportName:'',
                    reportType:'',                
                    transitionId: '',
                    lastModified:'' ,
                    version:'',
                    path:'',
                    reportGenerationTime:''
              }
              
              customReport.customReportId = customReports[i].CUSTOM_REPORT_ID;          
              customReport.customReportName = customReports[i].CUSTOM_REPORT_NAME;     
              customReport.reportType = customReports[i].REPORT_TYPE;            
              customReport.lastModified = customReports[i].LAST_MODIFIED;  
              customReport.version = customReports[i].VERSION;  
              customReport.reportGenerationTime = customReports[i].REPORT_GENERATED_AT;  
              
              this.customReports.push(customReport);
          }

      //this.customReports = customReports;
      this.dataSource = new MatTableDataSource(this.customReports);
      this.dataLength =  this.dataSource.data.length;            
    });    
  }

  deleteCustomReport(customReport_id:string){
        this.customReportService.deleteCustomReport(customReport_id, this.customOrAdmin ).subscribe((customReports:any[]) => {
            this.getCustomReportList(this.customOrAdmin);
        });
  }

  onDelete(customReport) {      
         this.deleteCustomReport(customReport.customReportId);
  }


  onUpdate(customReport) {
          var sourceComponentPath = "/transition-Main/custom-report-list";
          var destinationComponentPath ='';
          var destinationComponentParameterArray:any=[];
          
          destinationComponentPath = '/transition-Main/custom-report-add-adopt'; 
          destinationComponentParameterArray = [
               { id: 'customReportId', param: customReport.customReportId }, 
               { id: 'custom_or_admin', param: 'custom' },   
               { id: 'report_type', param: this.reportType }                                                                                                                      
          ]                   
                      
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  createNewReport() {  
    
        if (this.customOrAdmin =='custom'){

            const sourceComponentPath = "/transition-Main/custom-report-list";
            const destinationComponentPath = '/transition-Main/custom-report-add'; 
            const destinationComponentParameterArray:any= [];
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
        }else{
            const sourceComponentPath = "/admin-home/custom-report-list";
            const destinationComponentPath = '/admin-home/custom-report-add-admin'; 
            const destinationComponentParameterArray:any= [];
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)              
        }

  }

  view(customReportId){
        window.open(this.baseURL+'/getCustomReportPPT/'+this.userAccessProfileService.getCurrentTransitionID()+'/'+customReportId);
  }


  goCustomReportListAdopt(){
      const sourceComponentPath = "/transition-Main/custom-report-list";
      const destinationComponentPath = '/transition-Main/custom-report-list-adopt'; 
      const destinationComponentParameterArray:any= [];
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  back(){
  
    const sourceComponentPath = '/transition-Main';
    const destinationComponentPath = '/transition-Main/custom-report-list';    
    var destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'custom' }]        
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)   

  }
}
