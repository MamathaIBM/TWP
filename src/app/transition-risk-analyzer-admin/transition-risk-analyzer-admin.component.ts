import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription,of, Observable } from 'rxjs';
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TransitionRiskAnalyzerAdminService } from './transition-risk-analyzer-admin/transition-risk-analyzer-admin.service';
import { NavtntService } from '../navtnt.service';
import { RiskAnalyzer_Admin } from './class/transition-risk-analyzer-admin.model';

import { tap, startWith, debounceTime, switchMap, map } from 'rxjs/operators';


@Component({
  selector: 'app-transition-risk-analyzer-admin',
  templateUrl: './transition-risk-analyzer-admin.component.html',
  styleUrls: ['./transition-risk-analyzer-admin.component.css']
})
export class TransitionRiskAnalyzerAdminComponent implements OnInit {

  editFlag: number; // check whether user is going for edit or new row add
  deleteFlag: number; // check the delete subscription used or not
  displayedColumns: string[] = ['Risk_ID', 'Risk_Category', 'Risk_Attribute', 'Planned_Mitigation_Action','Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  RAUpdateeForm: FormGroup;
  private loadparamsSubscription: Subscription;  
  private saveSubscription: Subscription;
  private deleteSubscription: Subscription;
  private savedFlag = false;
  private toasterMessageHeader : string;  
  private RCategory :any;
  username: any;    
  getTRA_AdminListresult: any;  
  myControl = new FormControl();
  options : RiskAnalyzer_Admin[] = [];
  filteredOptions: Observable<RiskAnalyzer_Admin[]>;
  getRisk_Categoryresult: any;

  private _filterStates(value: string): RiskAnalyzer_Admin[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(state => state.Risk_Category.toLowerCase().indexOf(filterValue) === 0);
  }
  
  constructor(private service: TransitionRiskAnalyzerAdminService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
               private toastr: ToastrService,
               private navigation: NavtntService
             ) {
    this.dataLength = 0;
    this.selectedRow = 0;
    this.editFlag = 0;
    this.deleteFlag = 0;
    this.toasterMessageHeader = "Transition Risk Analyzer"
    this.RAUpdateeForm = this.fb.group({
      TRA_UNID : [''],
      Risk_ID : [''],
      Risk_Category : ['',Validators.required] ,
      Risk_Attribute : ['',Validators.required] ,
      Planned_Mitigation_Action : ['',Validators.required],            
      CREATED_AT :  [''],
      LAST_UPDATED_AT :  [''],
      CREATED_BY :  [''],
      LAST_UPDATED_BY :  ['']   
    });
  }

  ngOnInit() {
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);
       
    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res.filter) {          
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;          
          this.loadData();          
          // this.loadgetRisk_Category();
      }
    });
  }

  loadData() {            
      this.loadparamsSubscription =  forkJoin([
        this.service.getTRA_AdminList(),
        this.service.getRisk_Category()
         
        ])
     .subscribe(res=>{
          this.getTRA_AdminListresult = res[0] ;                    
          this.getRisk_Categoryresult = res[1] ;  

      }, (err: HttpErrorResponse) => {
              if (err.error instanceof Error ) {
                console.log('Client Sider Error.');
              } else {
                console.log('Server Sider Error.');
            }
      },
      ()=>{
              
        this.dataSource.data =  this.getTRA_AdminListresult ;
        this.dataLength = this.dataSource.data.length;
        this.options =   this.getRisk_Categoryresult;
      this.filteredOptions = this.RAUpdateeForm.get('Risk_Category').valueChanges.pipe( 
        startWith(''),map(state => state ? this._filterStates(state) : this.options.slice())
      )  
        });
    
  }
 

applyFilter(filterValue: string) {
  this.dataSource.filter   = filterValue.trim().toLowerCase();
}


setClickedRow(index: number, rowdata: any): void {
  if(index === 0){
    this.selectedRow = 0;
    this.editFlag = 0;
    this.resetFields();
  }else {
  if (index === this.selectedRow) {
    this.selectedRow = 0;
    this.editFlag = 0;
    this.resetFields();
   } else {
    this.selectedRow = index;
    this.RAUpdateeForm.controls['TRA_UNID'].setValue(rowdata.TRA_UNID);
    this.RAUpdateeForm.controls['Risk_ID'].setValue(rowdata.Risk_ID);
    this.RAUpdateeForm.controls['Risk_Category'].setValue(rowdata.Risk_Category);
    this.RAUpdateeForm.controls['Risk_Attribute'].setValue(rowdata.Risk_Attribute);
    this.RAUpdateeForm.controls['Planned_Mitigation_Action'].setValue(rowdata.Planned_Mitigation_Action);      
    this.editFlag = 1;
    if ((this.deleteFlag === 1) || (this.deleteFlag === 0) ) {
      this.deleteFlag = null;
      this.editFlag = 0;
      this.selectedRow = 0;
      this.resetFields();
    }
   }
  } 
}

resetFields() {
  this.RAUpdateeForm.controls['Risk_ID'].setValue('');
    this.RAUpdateeForm.controls['Risk_Category'].setValue('');
    this.RAUpdateeForm.controls['Risk_Attribute'].setValue('');
    this.RAUpdateeForm.controls['Planned_Mitigation_Action'].setValue('');      
    
}


onSubmit() {
}


Add() {

  if( this.RAUpdateeForm.controls['Risk_Category'].value.trim().length === 0 || 
      this.RAUpdateeForm.controls['Risk_Attribute'].value.trim().length === 0 ||
      this.RAUpdateeForm.controls['Planned_Mitigation_Action'].value.trim().length === 0){
        this.toastr.warning(' Risk Category / Risk Attribute/ Planned Mitigation Action cannot be blank.','Add Transition Risk')
        return false;
      }
  else{
    this.RAUpdateeForm.controls['CREATED_BY'].setValue(this.username);
    this.RAUpdateeForm.controls['LAST_UPDATED_BY'].setValue(this.username);  
    var Id;
    if (this.dataLength <10){
      Id = "R0"+(this.dataLength+1)
    }else{
      Id = "R"+(this.dataLength+1)
    }
    this.RAUpdateeForm.controls['Risk_ID'].setValue(Id);  
    this.RAUpdateeForm.controls['Risk_Category'].setValue(this.RAUpdateeForm.get('Risk_Category').value);  
    this.saveSubscription =  this.service.getTRA_AdminListAdd(this.RAUpdateeForm.value).subscribe(res => {
     if (res.save === 'success') {
      this.toastr.success('Inserted Succcessfully',  this.toasterMessageHeader);    
      this.loadData();
    } else {
      this.toastr.error('Insert Fail',  this.toasterMessageHeader);
    }
    this.savedFlag = true;
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error ) {
         this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com');
      } else {
        this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com');
    }
  });
  this.resetFields();
  }

  
}

Update() {
  this.RAUpdateeForm.controls['LAST_UPDATED_BY'].setValue(this.username);
  console.log('update');
  console.log(this.RAUpdateeForm.value);
  this.RAUpdateeForm.controls['Risk_Category'].setValue(this.RAUpdateeForm.get('Risk_Category').value);  
     this.saveSubscription =  this.service.getTRA_AdminListUpdate(this.RAUpdateeForm.value ).subscribe(res => {
       if (res.insert === 'success') {
        this.toastr.success('Updated Succcessfully',  this.toasterMessageHeader);
        this.loadData();
       } else {
        this.toastr.error('Update Fail',  this.toasterMessageHeader);
       }
     this.savedFlag = true;
     this.editFlag = 0;
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error ) {
        console.log('Client Side Error.');
        this.toastr.error('Client side update Error', 'ttstoolssupport@in.ibm.com');
      } else {
        this.toastr.error('Server side update Error', 'ttstoolssupport@in.ibm.com');
        console.log('Server Sider Error.');
    }
  });
    this.resetFields();
}



onDelete(obj: any) {
  console.log('delete');
  if (confirm('Are you sure want to delete ?' ) ) {
        console.log('delete' + obj.TRA_UNID);
      this.deleteSubscription =  this.service.getTRA_AdminListDelete(obj.TRA_UNID).subscribe(res => {
        if (res.Delete === 'success') {
          this.toastr.success('Deleted Succcessfully',  this.toasterMessageHeader);
          this.loadData();
         } else {
          this.toastr.error('Delete Fail',  this.toasterMessageHeader);
         }
      }, (errappServerDelete: HttpErrorResponse) => {
        if (errappServerDelete.error instanceof Error ) {          
          this.toastr.error('Client side delete Error', 'ttstoolssupport@in.ibm.com');
        } else {
          this.toastr.error('Server side delete Error', 'ttstoolssupport@in.ibm.com');        
      }
    });
      this.deleteFlag = 1;
  } else {    
    this.deleteFlag = 0;
    // this.toastr.info('Deleted Canclled.', this.toasterMessageHeader); 
  }
  this.resetFields();

}

ngOnDestroy() {
  this.loadparamsSubscription.unsubscribe();
  if (this.savedFlag === true ) {
    this.saveSubscription.unsubscribe();
  }
  if (this.deleteFlag === 1 ) {
    this.deleteSubscription.unsubscribe();
  }

}



}
