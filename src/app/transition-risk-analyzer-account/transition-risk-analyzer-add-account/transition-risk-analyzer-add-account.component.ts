import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Component, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
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
import { tap, startWith, debounceTime, switchMap, map } from 'rxjs/operators';
import { RiskAnalyzer_AccountAdd } from './class/transition-risk-analyzer-Account-Add.model';
import { NavtntService } from 'src/app/navtnt.service';
import { TransitionRiskAnalyzerAccountService } from '../transition-risk-analyzer-account/transition-risk-analyzer-account.service';


@Component({
  selector: 'app-transition-risk-analyzer-add-account',
  templateUrl: './transition-risk-analyzer-add-account.component.html',
  styleUrls: ['./transition-risk-analyzer-add-account.component.css']
})
export class TransitionRiskAnalyzerAddAccountComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  RAUpdateeForm: FormGroup;
  private IntegrationID: string;
  private loadparamsSubscription: Subscription;  
  private saveSubscription: Subscription;
  private savedFlag = false; 
  private toasterMessageHeader : string; 
  username: any;    
  getTRA_AdminListresult: any;  
  myControl = new FormControl();
  options : RiskAnalyzer_AccountAdd[] = [];
  filteredOptions: Observable<RiskAnalyzer_AccountAdd[]>;
  getRisk_Categoryresult: any;
  
  private _filterStates(value: string): RiskAnalyzer_AccountAdd[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(state => state.Risk_Category.toLowerCase().indexOf(filterValue) === 0);
  }
  
  constructor(private service: TransitionRiskAnalyzerAccountService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
               private toastr: ToastrService,
               private navigation: NavtntService,
               public dialogRef: MatDialogRef<TransitionRiskAnalyzerAddAccountComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any
             ) {
    this.dataLength = 0;   
    this.toasterMessageHeader = "Transition Risk Analyzer"
    this.RAUpdateeForm = this.fb.group({
      TRA_UNID : [''],
      Risk_ID : [''],
      Risk_Category : [''] ,
      Risk_Attribute : ['',Validators.required] ,
      Planned_Mitigation_Action : ['',Validators.required],            
      CREATED_AT :  [''],
      LAST_UPDATED_AT :  [''],
      CREATED_BY :  [''],
      LAST_UPDATED_BY :  ['']  ,
      Integration_ID : [''] 
    });


  }


  ngOnInit() {
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);
    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res.filter) {          
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;   
          this.IntegrationID =  this.data.IntegrationID; 
          // console.log(this.IntegrationID)            
           this.loadData();    
      }
    });
  }

  loadData() {            
      this.loadparamsSubscription = 
       forkJoin([
         this.service.getTRA_AccountList(this.IntegrationID),
         this.service.getRisk_Account_Category(this.IntegrationID)
        ])
        
     .subscribe(res=>{
          this.getTRA_AdminListresult = res[0] ;                    
          this.getRisk_Categoryresult = res[1] ;  
          this.RAUpdateeForm.controls["Integration_ID"].setValue(this.IntegrationID);          
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
        
        
        
        this.filteredOptions = this.myControl.valueChanges.pipe( 
        startWith(''),map(state => state ? this._filterStates(state) : this.options.slice())
      )  
        });
    
  }
 

applyFilter(filterValue: string) {
  this.dataSource.filter   = filterValue.trim().toLowerCase();
}

onNoClick(): void {
  this.dialogRef.close();
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
  this.RAUpdateeForm.controls['Risk_Category'].setValue(this.myControl.value);  
  console.log(this.RAUpdateeForm.value)
  if ( this.RAUpdateeForm.controls['Risk_Category'].value.trim().length === 0 ||
       this.RAUpdateeForm.controls['Risk_Attribute'].value.trim().length === 0 || 
       this.RAUpdateeForm.controls['Planned_Mitigation_Action'].value.trim().length === 0 ){
        this.toastr.warning(' Risk Category / Risk Attribute/ Planned Mitigation Action cannot be blank.','Add Transition Risk')
    return false;
  }
  // return false;
  this.RAUpdateeForm.controls['CREATED_BY'].setValue(this.username);
  this.RAUpdateeForm.controls['LAST_UPDATED_BY'].setValue(this.username);  
  var Id;
  if (this.dataLength <10){
    Id = "R0"+(this.dataLength+1)
  }else{
    Id = "R"+(this.dataLength+1)
  }
  this.RAUpdateeForm.controls['Risk_ID'].setValue(Id);     
  this.saveSubscription =  this.service.getTRA_AccountListAdd(this.RAUpdateeForm.value).subscribe(res => {
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

ngOnDestroy() {
  this.loadparamsSubscription.unsubscribe();
  if (this.savedFlag === true ) {
    this.saveSubscription.unsubscribe();
  }
}



}


