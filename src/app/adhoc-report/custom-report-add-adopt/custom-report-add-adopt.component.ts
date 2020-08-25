import { Component, OnInit, ViewContainerRef, ViewChild, Type, ComponentFactoryResolver, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UtilityService } from 'Services/utility.service';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/filter';
import { NavtntService, KeyValue } from 'src/app/navtnt.service';
import { Keyvalue } from 'Vo/keyvalue';
import { of, Observable } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { CustomReport } from 'Vo/customreport';
import { CustomReportService } from 'Services/customreport.service';

import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { TestBed } from '@angular/core/testing';
import { SectionTableAddComponent } from '../section-table-add/section-table-add.component';
import { SectionImageAddComponent } from '../section-image-add/section-image-add.component';
import { environment } from 'src/environments/environment';
import { validateConfig } from '@angular/router/src/config';
import { SectionTextAddComponent } from '../section-text-add/section-text-add.component';



export interface DialogData {
  reportName: string;
  version: string;
}


@Component({
    selector: 'app-custom-report-add-adopt',
    templateUrl: './custom-report-add-adopt.component.html',
    styleUrls: ['./custom-report-add-adopt.component.css']
})



export class CustomReportAddAdoptComponent implements OnInit {
  
  @ViewChild('container', {read: ViewContainerRef}) container: ViewContainerRef;

  operationTypes: Keyvalue[] = [];
  defaults: Keyvalue[] = [];
  fileContent:any;
  reportMedium = 'excel';

  recordKeyValue: KeyValue={};  

  customReportId:any;
  transitionId:any;
  baseURL = environment.AdminbaseUrl;

  customOrAdmin='custom';
  reportType ='';

  records:any[]=[];
  customReportAddForm: FormGroup;

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

  dataSource = new MatTableDataSource;
  displayedColumns:any[]=[];
  dataLength = 0;
  dataLoaded: Observable<{}>;

  
  // Keep track of list of generated components for removal purposes
  components = [];

  // Expose class so that it can be used in the template

  sectionTextAddComponentClass = SectionTextAddComponent
  sectionTableAddComponentClass = SectionTableAddComponent
  sectionImageAddComponentClass = SectionImageAddComponent

  constructor(private navigation: NavtntService, 
              private utility: UtilityService,
              fb: FormBuilder, 
              private componentFactoryResolver: ComponentFactoryResolver,
              private customReportService: CustomReportService,
              private userAccessProfileService: UserAccessProfileService,
              private router: Router, 
              private route: ActivatedRoute,
              public dialog: MatDialog) {

    this.customReportAddForm = fb.group({
                                          customReportName:[''],
                                          version:[''],                
                                        });
  }

  ngOnInit() {


    
    this.transitionId = this.userAccessProfileService.getCurrentTransitionID();
    this.route.queryParams.subscribe((p: any) => {    
        if (p.filter){         

              this.customOrAdmin = this.navigation.getParameterValue(p.filter, 'custom_or_admin'); 
              this.reportType = this.navigation.getParameterValue(p.filter, 'report_type');  
              
              //alert("this.reportType "+this.reportType);
              this.customReportId = this.navigation.getParameterValue(p.filter, 'customReportId');   
              this.getReportData(this.transitionId, this.customReportId);            
        }
    });
  }


  
  adopt() {    
      this.saveCustomReport();        
  }

  back() {
 
    const sourceComponentPath = '/transition-Main/custom-report-add';
    var destinationComponentPath = '';
    var destinationComponentParameterArray:any = []  

    if (this.customOrAdmin =='custom'){
           destinationComponentPath = '/transition-Main/custom-report-list-adopt';
           destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'custom' }] 
    }else{
           destinationComponentPath = '/admin-home/custom-report-list';
           destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'admin' }] 
    }
    
      
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)   
    
  }


  cancel() {
          var sourceComponentPath = '/admin-home/content-type-add';
          var destinationComponentPath = '/admin-home/contentType-list';
          var destinationComponentParameterArray = []     
        
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

  saveCustomReport(){       

          /*
          this.customReport.customReportName = this.customReportAddForm.controls['customReportName'].value;    
          this.customReport.version = this.customReportAddForm.controls['version'].value;
          var header = '{"report_name":"'+this.customReport.customReportName+'","version":"'+this.customReport.version+'" }';

          var data = this.getSectionContent();
          this.fileContent = '{"header":'+header+',"data":'+data+'}';

          let customReportParameter = 
          '{ "CUSTOM_REPORT_NAME":"'+ this.customReport.customReportName+ '", '+
          '  "VERSION":"'+ this.customReport.version+'", "FILE_CONTENT":'+this.fileContent+'}';

          */

          var customReportParameter = this.prepareData();


                this.customReportService.createCustomReport(customReportParameter, this.transitionId, 'custom', this.reportType ).subscribe((reports:any[]) => {                     
                    console.log("##################################################################################################");
                    this.customReportId = reports[0].PKEY;
                     alert("New report adopted. Please may go to report list screen to further customize this report");
                     this.gotoCustomReportListScreen();
                });  
         
  }

  prepareData(){
    this.customReport.customReportName = this.customReportAddForm.controls['customReportName'].value;    
    this.customReport.version = this.customReportAddForm.controls['version'].value;
    var header = '{"report_name":"'+this.customReport.customReportName+'","version":"'+this.customReport.version+'" }';

    var data = this.getSectionContent();
    this.fileContent = '{"header":'+header+',"data":'+data+'}';

    //alert(this.fileContent);
    console.log("file content "+this.fileContent);

    let customReportParameter = 
    '{ "CUSTOM_REPORT_NAME":"'+ this.customReport.customReportName+ '", '+
    '  "VERSION":"'+ this.customReport.version+'", "FILE_CONTENT":'+this.fileContent+'}';
    return customReportParameter;
  }

  getSectionContent(){    
          var contents = "";
          for ( var i=0; i<this.components.length;i++){
                      //alert(this.container.element);
                      if (i==0){
                            
                            contents = (this.components[i].instance).getSectionData();
                      }else{
                            contents = contents+","+ (this.components[i].instance).getSectionData() 
                      }                                  
          }
          return '['+contents+']';
  }


  
  validate(){    
        var validationResult = true;
        for ( var i=0; i<this.components.length;i++){                      
                      if  (!(this.components[i].instance).validate()){

                          alert("Section "+(i+1)+" : "+(this.components[i].instance).errorReason );
                          validationResult = false;
                          return validationResult;
                      }                                                 
        }
        return validationResult;
  }

  updateCustomReport(){    
  }

  addComponent(componentClass: Type<any>) {
          // Create component dynamically inside the ng-template


          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
          const component = this.container.createComponent(componentFactory);
          (component.instance).selfReference = component;
          (component.instance).components = this.components;
          (component.instance).container = this.container;

          // Push the component so that we can keep track of which components are created
          this.components.push(component);
          return component.instance;
  }

  removeComponent(componentClass: Type<any>) {
          // Find the component
          const component = this.components.find((component) => component.instance instanceof componentClass);
          const componentIndex = this.components.indexOf(component);

          if (componentIndex !== -1) {
            // Remove component from both view and array
            this.container.remove(this.container.indexOf(component));
            this.components.splice(componentIndex, 1);
          }
  }


  getReportData(transitionId, reportId){

      this.customReportService.getCustomReportData( transitionId,reportId, 'admin',this.reportType ).subscribe((reports:any[]) => {                     


             console.log("#############################################################################");
             //alert("Get data successfully"+reports[0].header.report_name);
             this.customReportAddForm.controls['customReportName'].setValue(reports[0].header.report_name);
             this.customReportAddForm.controls['version'].setValue(reports[0].header.version);
             for(var i=0; i<reports[0].data.length;i++) {
                 //alert(reports[0].data[i].section_data.section_name);

                
                 //based on the section type appropriate section to be intialized
                 if  (reports[0].data[i].section_data.section_type =='text'){

                      var sectionComponent:SectionTextAddComponent;
                      sectionComponent = this.addComponent(this.sectionTextAddComponentClass);   
                      sectionComponent.populateData(reports[0].data[i]);
                 }

                 if  (reports[0].data[i].section_data.section_type =='table'){
                     var sectionTabComponent:SectionTableAddComponent;
                     sectionTabComponent= this.addComponent(this.sectionTableAddComponentClass); 
                     sectionTabComponent.populateData(reports[0].data[i]);
                 }

                 if  (reports[0].data[i].section_data.section_type =='image'){
                      var sectionImgComponent:SectionImageAddComponent;
                      sectionImgComponent= this.addComponent(this.sectionImageAddComponentClass); 
                      sectionImgComponent.populateData(reports[0].data[i]);
                 }

                            
             }

      });  
  }

  save_generate(){
    
        var customReportParameter = this.prepareData();

        console.log("customReportParameter "+customReportParameter);
        //alert("customReportParameter "+customReportParameter);
        
        if (this.customReportId == undefined){
              this.customReportService.createCustomReport(customReportParameter, this.transitionId, this.customOrAdmin, this.reportType ).subscribe((reports:any[]) => {                     
                  console.log("##################################################################################################");
                  this.customReportId = reports[0].PKEY;
                     // Now go for generating the report

                      if (this.validate())
                      this.customReportService.generateAllMediaCustomReport(this.transitionId,this.customReportId, this.customOrAdmin, this.reportType, this.reportMedium ).subscribe((reports:any[]) => {                     
                        if(confirm("Report is generated. Do you want to view it?")) {
                              window.open(this.baseURL+'/getCustomReportPPT/'+this.transitionId+'/'+this.customReportId);
                        }  
                      }); 

              });  
        }else{
              this.customReportService.updateCustomReport(customReportParameter, this.transitionId, this.customReportId, this.customOrAdmin, this.reportType  ).subscribe((reports:any[]) => {                     
                  console.log("##################################################################################################");
                  // Now go for generating the report
                        if (this.validate())
                        this.customReportService.generateAllMediaCustomReport( this.transitionId,this.customReportId,this.customOrAdmin, this.reportType, this.reportMedium  ).subscribe((reports:any[]) => {                     
                          if(confirm("Report is generated. Do you want to view it?")) {
                              window.open(this.baseURL+'/getCustomReportPPT/'+this.transitionId+'/'+this.customReportId);
                          } 
                        }); 
              }); 
        }  
    
  }

  saveas(): void {
    const dialogRef = this.dialog.open(SaveAsDialog, {
      width: '500px',
      data: {reportName: '', version: ''}
    });

    dialogRef.componentInstance.parentReference = this;

    dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');      
    });
  }




  saveasCreateNewReport(reportName, version){
        this.customReportAddForm.controls['customReportName'].setValue(reportName);
        this.customReportAddForm.controls['version'].setValue(version);
        var customReportParameter = this.prepareData();
        this.customReportService.createCustomReport(customReportParameter, this.transitionId, this.customOrAdmin, this.reportType ).subscribe((reports:any[]) => {                     
          console.log("##################################################################################################");
          this.customReportId = reports[0].PKEY;
          alert("New report created successfully");

        });  
  }

  gotoCustomReportListScreen(){
  
    const sourceComponentPath = '/transition-Main';
    const destinationComponentPath = '/transition-Main/custom-report-list';      
    var destinationComponentParameterArray = [{ id: 'custom_or_admin', param: 'custom' }]  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)   

  }

}


@Component({
  selector: 'save-as-dialog',
  templateUrl: 'save-as-dialog.html',
})
export class SaveAsDialog {

  form: FormGroup;
  reportName:string;
  version:string;
  parentReference: CustomReportAddAdoptComponent;

  constructor(
    fb: FormBuilder,
    public dialogRef: MatDialogRef<SaveAsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {

      this.reportName = data.reportName;
      this.version  = data.version;
      
      this.form = fb.group({
          reportName: this.reportName,
          version: this.version,          
      });

    }  

    onNoClick(): void {
         this.dialogRef.close();

    }

    save() {
         this.dialogRef.close(this.form.value);
         this.parentReference.saveasCreateNewReport(this.form.value.reportName, this.form.value.version);
    }

}