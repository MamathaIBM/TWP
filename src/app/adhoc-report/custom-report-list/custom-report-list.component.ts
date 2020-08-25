import { Component, OnInit, Inject } from '@angular/core';
import { CustomReport } from 'Vo/customReport';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource,MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from 'src/app/navtnt.service';
import { CustomReportService } from 'Services/customreport.service';
import { environment } from 'src/environments/environment';
import { Keyvalue } from 'Vo/keyvalue';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UtilityService } from 'Services/utility.service';
import { ReportMediumSelectDialogData } from '../custom-report-add/custom-report-add.component';


@Component({
  selector: 'app-custom-report-list',
  templateUrl: './custom-report-list.component.html',
  styleUrls: ['./custom-report-list.component.css']
})
export class CustomReportListComponent implements OnInit {


  dataLength = 0;
  baseURL = environment.AdminbaseUrl;
  customOrAdmin='custom';
  reportType = '';

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
  displayedColumns: string[] = [ 'customReportName',  'version', 'lastModified','reportGenerationTime', 'customReportId'];

  constructor(private navigation: NavtntService, private userAccessProfileService: UserAccessProfileService, 
              private customReportService: CustomReportService, private  route: ActivatedRoute,public dialog: MatDialog) { 
             }

  ngOnInit() {
       

       this.route.queryParams.subscribe((p: any) => {    
        if (p.filter){          
              this.customOrAdmin = this.navigation.getParameterValue(p.filter, 'custom_or_admin');   
              this.reportType = this.navigation.getParameterValue(p.filter, 'report_type');  
              //alert(this.navigation.getParameterValue(p.filter, 'custom_or_admin'));  
              //alert("this.reportType "+this.reportType);           
              this.getCustomReportList(this.customOrAdmin);     
        }
      });
  }



  getCustomReportList(customOrAdmin){

    console.log(  "getCustomReportList()"); 
    this.customReportService.getCustomReportList(this.userAccessProfileService.getCurrentTransitionID(),customOrAdmin,this.reportType ).subscribe((customReports:any[]) => {

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
              customReport.lastModified = customReports[i].LAST_MODIFIED;  
              customReport.transitionId = customReports[i].TRANSITION_ID;  
              customReport.version = customReports[i].VERSION;  
              customReport.reportGenerationTime = customReports[i].REPORT_GENERATED_AT;  
              
              this.customReports.push(customReport);
          }

      //this.customReports = customReports;
      this.dataSource = new MatTableDataSource(this.customReports);
      this.dataLength =  this.dataSource.data.length;            
    });    
  }

  deleteCustomReport(customReport){

      if (confirm("Are you sure to delete "+customReport.customReportName+" ?")){
            this.customReportService.deleteCustomReport(customReport.customReportId,this.customOrAdmin ).subscribe((customReports:any[]) => {
                this.getCustomReportList(this.customOrAdmin);
            });
      }  
  }

  onDelete(customReport) {      
         this.deleteCustomReport(customReport);
  }


  onUpdate(customReport) {
          var sourceComponentPath = "/transition-Main/custom-report-list";
          var destinationComponentPath ='';
          var destinationComponentParameterArray:any=[];
          if (this.customOrAdmin =='custom'){
                 destinationComponentPath = '/transition-Main/custom-report-add'; 
                 destinationComponentParameterArray = [
                  { id: 'customReportId', param: customReport.customReportId }, 
                  { id: 'custom_or_admin', param: 'custom' },  
                  { id: 'report_type', param: 'transition' }                                                                                                       
                 ]                   
          }else{
                 destinationComponentPath = '/admin-home/custom-report-add-admin'; 
                 destinationComponentParameterArray = [
                  { id: 'customReportId', param: customReport.customReportId },    
                  { id: 'custom_or_admin', param: 'admin' },
                  { id: 'report_type', param: this.reportType }                                                       
                 ]      
                 
                 //alert("B4 forwadring "+this.reportType);
          }
              
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  createNewReport() {  
    
        if (this.customOrAdmin =='custom'){

            const sourceComponentPath = "/transition-Main/custom-report-list";
            const destinationComponentPath = '/transition-Main/custom-report-add'; 
            const destinationComponentParameterArray= [    { id: 'custom_or_admin', param: 'custom' },
                                                           { id: 'report_type', param: 'transition' }  ];
            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
        }else{


             var sourceComponentPath = "/admin-home/custom-report-list";
             var destinationComponentPath = ''; 

              if (this.reportType == 'template'){                    
                    destinationComponentPath = '/admin-home/custom-report-add-admin'; 
              }

              if (this.reportType == 'global'){                    
                    destinationComponentPath = '/admin-home/custom-report-add-global'; 
              }


              if (this.reportType == 'org'){                
                     destinationComponentPath = '/admin-home/custom-report-add-org'; 
              }      
              
              
              const destinationComponentParameterArray= [    
                { id: 'custom_or_admin', param: 'admin' },
                { id: 'report_type', param: this.reportType }];

              this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)              


        }

  }

  view(report){
      var account = this.userAccessProfileService.getClientName();
      //window.open(this.baseURL+'/getCustomReportPPT/'+report.transitionId+'/'+report.customReportId+'/'+encodeURIComponent(report.customReportName)+'/'+encodeURIComponent(report.version)+'/'+encodeURIComponent(account));
      //window.open(this.baseURL+'/getCustomReportExcel/'+report.transitionId+'/'+report.customReportId+'/'+encodeURIComponent(report.customReportName)+'/'+encodeURIComponent(report.version)+'/'+encodeURIComponent(account));

      this.selectReportMedium(report);


  }


  selectReportMedium(report) : void {
    const dialogRef = this.dialog.open(ReportMediumSelectDialog, {
      width: '500px',  
      height:'200px',
      maxHeight:'400px',
      autoFocus: false,    
      data: {
             transitionId: report.transitionId, 
             customReportId: report.customReportId,
             customReportName: report.customReportName,
             customReportVersion: report.version,
             reportType: this.reportType,
             customOrAdmin : this.customOrAdmin 
             }          
    });

    dialogRef.componentInstance.parentReference = this;

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');      
    });
  }


  goCustomReportListAdopt(){
      const sourceComponentPath = "/transition-Main/custom-report-list";
      const destinationComponentPath = '/transition-Main/custom-report-list-adopt'; 
      const destinationComponentParameterArray:any= [];
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}




@Component({
  selector: 'report-medium-select-dialog',
  templateUrl: 'report-medium-select-dialog.html',
  styleUrls: ['report-medium-select-dialog.component.css']
})
export class ReportMediumSelectDialog {

  report_medium: FormGroup;
  transitionId = '';
  customReportId  = '';
  customReportName = '';
  customReportVersion = '';
  reportType  = '';
  customOrAdmin = '';
  reportMediumTypes:Keyvalue[] = [];
  baseURL = environment.AdminbaseUrl;

  reportMedium ='';

  parentReference: CustomReportListComponent;

  constructor(
    fb: FormBuilder,
    public utility: UtilityService,
    public userAccessProfileService: UserAccessProfileService,
    public dialogRef: MatDialogRef<ReportMediumSelectDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ReportMediumSelectDialogData) {

      this.report_medium = fb.group({
            reportMedium: this.reportMedium,                 
      });



      
      this.transitionId = data.transitionId;
      this.customReportId  = data.customReportId;
      this.customReportName = data.customReportName;
      this.customReportVersion = data.customReportVersion;
      this.reportType  = data.reportType;
      this.customOrAdmin = data.customOrAdmin;
      
  
      this.reportMediumTypes = this.utility.getReportMediumTypes();

    }  

    onNoClick(): void {
         this.dialogRef.close();

    }

    view() {

         var account = this.userAccessProfileService.getClientName();
         if (this.report_medium.value.reportMedium =='excel'){
              alert("Only tabular section data will be generated");
              this.dialogRef.close();
              window.open(this.baseURL+'/getCustomReportExcel/'+this.transitionId+'/'+this.customReportId+'/'+encodeURIComponent(this.customReportName)+'/'+encodeURIComponent(this.customReportVersion)+'/'+encodeURIComponent(account)+'/'+this.reportType+'/'+this.customOrAdmin);
         }else if (this.report_medium.value.reportMedium =='pptx'){
              this.dialogRef.close();
              window.open(this.baseURL+'/getCustomReportPPT/'+this.transitionId+'/'+this.customReportId+'/'+encodeURIComponent(this.customReportName)+'/'+encodeURIComponent(this.customReportVersion)+'/'+encodeURIComponent(account)+'/'+this.reportType+'/'+this.customOrAdmin);
         }else{
              alert("Select a report type please");
         }  
         
    }

}