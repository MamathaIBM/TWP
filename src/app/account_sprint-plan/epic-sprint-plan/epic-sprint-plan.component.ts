import { NavtntService } from './../../navtnt.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Component, inject, ViewChild, OnInit, OnDestroy,ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { EpicSprintPlanService } from './epic-sprint-plan/epic-sprint-plan.service';
import { EpicSprintPlanAddUpdateComponent } from './epic-sprint-plan-add-update/epic-sprint-plan-add-update.component';

export interface epicsprintplan {
  // MatPaginator Output
  pageEvent: PageEvent;

}
@Component({
  selector: 'app-epic-sprint-plan',
  templateUrl: './epic-sprint-plan.component.html',
  styleUrls: ['./epic-sprint-plan.component.css']
})
export class EpicSprintPlanComponent implements OnInit,OnDestroy {

  editFlag: number; // check whether user is going for edit or new row add
  deleteFlag: number; // check the delete subscription used or not
  BaselineFlag: number; // check the baseline subscription used or not
  displayedColumns: string[] = ['epicName','sprintName','scopelevel','startDate', 'endDate','replanStartDate','replanEndDate','actualStartDate' , 'actualEndDate', 'rag', 'owner', 'remarks','reasonfornotgreen', 'gotogreenplan', 'icon'];
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('Owner') nameField: ElementRef;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  private sprinnerFlag : number ;
  epicUpdateForm: FormGroup;
  private progress = 0;
  private loadparamsSubscription: Subscription;
  // private saveSubscription: Subscription;
  private deleteSubscription: Subscription;
  private baselineSubscription : Subscription;
  // private epicNameSubscription : Subscription;
  // private profileStartandEndDateSubscription : Subscription;
  // private profileStartandEndDateSubscriptionFlag : number;
  // private getSingleEpicsNameSubscription : Subscription;
  
  private baselineFlagValue:number;
  private baselinePageFlag:number;
  private savedFlag = false;
  // private vendorDatasource: any;
  // private appCategoryDatasource: any;
  private IntegrationID: string;
  // private ApplnNameDatasource: any;
  // private EnvironmentDatasource: any;
  // private serverTypeDatasource: any;
  // private serverNameDatasource: any;
  // private TransStartDt : any ;
  // private TransEndDt : any;
  // private TransStartDt1 : any ;
  // private TransEndDt1 : any;
  private epicNameList : any;
  private errMessage : string;
  FlagHide: any;
  username: any;
  // epicNameListval: any;
  private colorcode: any;
  // myJSON: '';
  // Employee_Name: any[];
  // count: number;
  // emailcheck: any;
  // Empnamecheck: any;
  private acsDateFlag : number;
  private aceDateFlag : number;
  // private ownerIDValidation :number;
  constructor(private service: EpicSprintPlanService,
              public dialog : MatDialog,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
               private toastr: ToastrService,
               private navigation: NavtntService,
               public datepipe: DatePipe,
             ) {
              this.sprinnerFlag = 1;
    this.dataLength = 0;
    this.selectedRow = 0;
    this.editFlag = 0;
    this.deleteFlag = 0;
    this.BaselineFlag =0; 
    this.aceDateFlag = 0;
    this.acsDateFlag = 0;
    this.baselineFlagValue = 0;
    this.baselinePageFlag =0;
    // this.ownerIDValidation = 0;
    
    
    this.epicUpdateForm = this.fb.group({
      epicUNID : [''],
      epicName : [''],
      sprintUNID : [''],
      sprintName  : ['', Validators.required],
      startDate : [''] ,
      endDate : [''] ,
      replanStartDate : [''],
      replanEndDate : [''],
      actualStartDate : [''],
      actualEndDate : [''],
      IntegrationID : [''],
      createdBy : [''],
      modifiedBy : [''],
      rag: [''],
      Owner: [''],
      reason_for_not_green: [''],
      go_to_green_plan: [''],
      remarks: [''],
      operation : [''],
      baselineFlagValue   : [''],
      baselinePageFlag    : [''],
      scopelevel: ['', Validators.required]      
      
    });
  }

  ngOnInit() {
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);    
    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res.filter) {
        if (this.navigation.getParameterValue(res.filter, 'ViewFlag') === 'Yes') {
          this.FlagHide = 'Yes';
          } else {
            this.FlagHide = 'No';
          }
          this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id');
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;            
          this.epicUpdateForm.controls['IntegrationID'].setValue(this.IntegrationID);
          this.epicUpdateForm.controls['createdBy'].setValue(this.username);
          this.epicUpdateForm.controls['modifiedBy'].setValue(this.username);
          this.loadData();
      }
    });

  }

  loadData() {
    this.loadparamsSubscription = this.service.getSprint(this.IntegrationID).subscribe(res => {      
        this.dataSource.data = res;       
      this.dataLength = this.dataSource.data.length;
      this.progress = 0;
       if (this.dataLength !== 0 ){        
          this.baselineFlagValue= res[0].Baselined      
          this.baselinePageFlag = res[0].Baselined     
          this.sprinnerFlag = 1;     
       }else{
        this.baselineFlagValue = 0
        this.baselinePageFlag = 0
      }   
      
      }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error ) {
              console.log('Client Sider Error.');
            } else {
              console.log('Server Sider Error.');
          }
        });
  }
   
  openDialog(): void {
    let dialogRef = this.dialog.open(EpicSprintPlanAddUpdateComponent, {
      width: '1800px',   
      data: {    IntegrationID       : this.IntegrationID,
                  baselineFlagValue   : this.baselineFlagValue,
                  baselinePageFlag    : this.baselinePageFlag,
                  operation           : 'Add'
              }
    });
    dialogRef.afterClosed().subscribe(result => {
        this.loadData();                           
    });
  }

  viewOpenDialog(): void {
    let dialogRef = this.dialog.open(EpicSprintPlanAddUpdateComponent, {
       width: '1800px',   
       data: this.epicUpdateForm.value
    });  
    dialogRef.afterClosed().subscribe(result => {
        // this.resetFields()
        // this.loadData();                           
     });
  }

  editOpenDialog(): void {
      let dialogRef = this.dialog.open(EpicSprintPlanAddUpdateComponent, {
        width: '1800px',   
        data: this.epicUpdateForm.value
      });
    
      dialogRef.afterClosed().subscribe(result => {
          this.resetFields()
          this.loadData();                           
      });
    }

  applyFilter(filterValue: string) {
    this.dataSource.filter   = filterValue.trim().toLowerCase();
  }

  setClickedRow(index: number, rowdata: any,buttonOperation :string): void {  
    // this.getSingleEpicsName(rowdata.epicUNID) 
    // if (index === this.selectedRow) {
    //   this.editFlag = 0;
    //   this.selectedRow = 0;
    //   this.resetFields();
    // } else {             
      this.selectedRow = index;
      this.epicUpdateForm.controls['sprintUNID'].setValue(rowdata.sprintUNID);
      this.epicUpdateForm.controls['epicUNID' ].setValue(rowdata.epicUNID);
      this.epicUpdateForm.controls['sprintName'].setValue(rowdata.sprintName);  
      this.epicUpdateForm.controls['scopelevel'].setValue(rowdata.scopelevel);    
      
        if(rowdata.startDate !== null ){
          this.epicUpdateForm.controls['startDate'].setValue(new Date(rowdata.startDate));
        }
        if(rowdata.endDate !== null ){
          this.epicUpdateForm.controls['endDate'].setValue(new Date(rowdata.endDate));
        }    
        if(rowdata.replanStartDate !== null ){
          this.epicUpdateForm.controls['replanStartDate'].setValue(new Date(rowdata.replanStartDate));
        }
        if(rowdata.replanEndDate !== null ){
            this.epicUpdateForm.controls['replanEndDate'].setValue(new Date(rowdata.replanEndDate));
        }
        if(rowdata.actualStartDate !== null ){
          // this.acsDateFlag = 1;
            this.epicUpdateForm.controls['actualStartDate'].setValue(new Date(rowdata.actualStartDate));
        }
        if(rowdata.actualEndDate !== null ){
            // this.aceDateFlag = 1;
            this.epicUpdateForm.controls['actualEndDate'].setValue(new Date(rowdata.actualEndDate));
        }
        this.colorcode = rowdata.rag;
        this.epicUpdateForm.controls['rag'].setValue(rowdata.rag);
        this.epicUpdateForm.controls['Owner'].setValue(rowdata.owner);
        this.epicUpdateForm.controls['remarks'].setValue(rowdata.remarks);        
        this.epicUpdateForm.controls['reason_for_not_green'].setValue(rowdata.reason_for_not_green);
        this.epicUpdateForm.controls['go_to_green_plan'].setValue(rowdata.green_plan);        
        if(buttonOperation === 'Edit') {
          this.epicUpdateForm.controls['operation'].setValue("update"); 
        }else{
          this.epicUpdateForm.controls['operation'].setValue("View"); 
        }
        this.epicUpdateForm.controls['baselineFlagValue'].setValue(this.baselineFlagValue); 
        this.epicUpdateForm.controls['baselinePageFlag'].setValue(this.baselinePageFlag); 
    
        this.editFlag = 1;
          
      //   if ((this.deleteFlag === 1) || (this.deleteFlag === 0) ) {
      //       this.deleteFlag = null;
      //       this.editFlag = 0;
      //       this.selectedRow = 0
      //       this.resetFields();
      // }

      if (this.deleteFlag === 1) {
        this.deleteFlag = null;
        this.editFlag = 0;
        this.selectedRow = 0;                    
      }
      setTimeout(() => {
        if(buttonOperation === 'Edit') {
            this.editOpenDialog();
        }else{
            this.viewOpenDialog();
        }
        
    }, 100);

    // }
  }
  onSubmit(){

  }

  onBaseline(){
    if (confirm('Do you want to Baseline the Epic-Sprint plan ?')) {
      this.sprinnerFlag = 0;
        this.baselineSubscription = this.service.sprintBaseline({'IntegrationID': this.IntegrationID}).subscribe(res=>{    
          this.baselinePageFlag = 1;
          this.BaselineFlag = 1; 
          this.dataSource.data = [];
          if(res.insert==='success'){                
            // this.incrementSpinner();
            this.progress = 1;
            // setTimeout(() => {
                if (this.progress > 0) {
                    this.toastr.success('Baselined Succcessfully', 'Sprint')
                    setTimeout(() => {
                      // this.progress = 0;
                      this.loadData()                
                    }, 100);
                    
                }
                //  else {
                //   this.baselinePageFlag = 0;
                //     this.toastr.error('Baselined Fail', 'Sprint')
                // }
            // }, 100)
          } else {
            this.baselinePageFlag = 0;
              this.toastr.error('Baselined Fail', 'Sprint')
          }
        })
    }
  }

  resetFields() {
    this.editFlag = 0
    this.aceDateFlag = 0;
    this.acsDateFlag = 0;
    this.epicUpdateForm.controls['sprintUNID'].setValue('');
    this.epicUpdateForm.controls['epicUNID'].setValue('');
    this.epicUpdateForm.controls['sprintName'].setValue('');
    this.epicUpdateForm.controls['startDate'].setValue('');
    this.epicUpdateForm.controls['scopelevel'].setValue('');
    this.epicUpdateForm.controls['endDate'].setValue('');
    this.epicUpdateForm.controls['replanStartDate'].setValue('');
    this.epicUpdateForm.controls['replanEndDate'].setValue('');
    this.epicUpdateForm.controls['actualStartDate'].setValue('');
    this.epicUpdateForm.controls['actualEndDate'].setValue('');
    this.colorcode = null;
    this.epicUpdateForm.controls['rag'].setValue('');
    this.epicUpdateForm.controls['Owner'].setValue('');
    this.epicUpdateForm.controls['remarks'].setValue('');
    this.epicUpdateForm.controls['reason_for_not_green'].setValue('');
    this.epicUpdateForm.controls['go_to_green_plan'].setValue('');
  }

  onDelete(obj: any) {
    
    if (confirm('Are you sure want to delete ?' ) ) { 
      this.sprinnerFlag = 0;       
        this.deleteSubscription =  this.service.sprintDelete(obj.sprintUNID,obj.scopelevel).subscribe(res => {
          if (res.Delete === 'success') {
            this.toastr.success('Deleted Succcessfully', 'Sprint');
            this.loadData();
          } else {
            this.sprinnerFlag = 1;    
            this.toastr.error(res.Delete, 'Sprint');
            window.alert(res.Delete.join('\n'));
          }
        }, (errsprintDelete: HttpErrorResponse) => {
          if (errsprintDelete.error instanceof Error ) {
            // console.log("Client Side Error.");
            this.toastr.error('Client side delete Error', 'ttstoolssupport@in.ibm.com');
          } else {
            this.toastr.error('Server side delete Error', 'ttstoolssupport@in.ibm.com');
          //  console.log("Server Side delete Error.");
        }
      });

        this.deleteFlag = 1;
    } else {
      console.log('not');
    }
    this.resetFields();

  }


  ngOnDestroy() {
    this.loadparamsSubscription.unsubscribe();
    if (this.deleteFlag === 1 ) {
      this.deleteSubscription.unsubscribe();
    }
    if(this.BaselineFlag === 1){
      this.baselineSubscription.unsubscribe();
    }
    
  }

}
