import { Component, OnInit,Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ServiceTransitionInfoService } from '.././service/service-transition-info.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Router } from '@angular/router';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-service-transition-info-add-edit',
  templateUrl: './service-transition-info-add-edit.component.html',
  styleUrls: ['./service-transition-info-add-edit.component.css']
})

export class ServiceTransitionInfoAddEditComponent implements OnInit {
  username: any;
  private IntegrationID: string;
  stInfoForm : FormGroup;
  private savedFlag = false;
  editFlag: number; // check whether user is going for edit or new row add
  private saveSubscription : Subscription;
  public  STScopeLevel :any ='';
  public stScope : any ='';
  public stScopeActivity : any ='';
  public stToolsUsage :any ='';  
  private setvisibleProperty : boolean = true;
  
  constructor(
    private service: ServiceTransitionInfoService,
    private fb: FormBuilder,    
    private toastr: ToastrService,    
    public datepipe: DatePipe,
    public dialogRef: MatDialogRef<ServiceTransitionInfoAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any )
     {
       this.service.serviceTransitionInfoParameters_get();
      this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
      this.username = decodeURIComponent(this.username._value);  
      this.IntegrationID = this.data.IntegrationID;
      this.stInfoForm = this.fb.group(
        {
          MasterSTInfoid  : [''],
          IntegrationID   : [''],
          STScopeLevel    : ['',Validators.required],
          STScope         : ['',Validators.required],
          STDetailedScope : ['',Validators.required],
          STScopeActivity : ['',Validators.required],          
          STToolUsage     : [''],
          Others          : [''],          
          CREATED_BY      : [''],
          MODIFIED_BY     : [''],
          operation       : ['']
        }
      )
     }
  ngOnInit() {    
    this.stInfoForm.controls['IntegrationID'].setValue(this.data.IntegrationID)      
    this.stInfoForm.controls['MODIFIED_BY'].setValue(this.data.username);
      if(this.data.operation === 'Add'){
        this.editFlag = 0;
        this.stInfoForm.controls['CREATED_BY'].setValue(this.data.username);
        this.stInfoForm.controls['operation'].setValue('Add');          
      }else if(this.data.operation === 'update' ){
        this.editFlag = 1;
        this.loadData();
      }else if (this.data.operation === 'View'){
        this.loadData();
        this.stInfoForm.disable();
      }
      this.STScopeLevel = this.service.STScopeLevel;
      this.stScopeActivity=this.service.stScopeActivity;
      this.stToolsUsage = this.service.stToolsUsage;
  }
  setScope(stScopeFilter : string){    

    this.stScope= '';
    this.stScope = this.service.stScopeFilter(stScopeFilter)    
    this.stInfoForm.controls['Others'].setValue('');
  }
  
  loadData() {  
    this.setScope(this.data.STScopeLevel);
    this.stInfoForm.controls['IntegrationID'].setValue(this.data.IntegrationID);          
    this.stInfoForm.controls['MasterSTInfoid'].setValue(this.data.MasterSTInfoid);
    this.stInfoForm.controls['STScopeLevel'].setValue(this.data.STScopeLevel);
    this.stInfoForm.controls['STScope'].setValue(this.data.STScope);
    this.stInfoForm.controls['STDetailedScope'].setValue(this.data.STDetailedScope);
    this.stInfoForm.controls['STScopeActivity'].setValue(this.data.STScopeActivity.split(','));    
    this.stInfoForm.controls['STToolUsage'].setValue(this.data.STToolUsage.split(','));
    this.stInfoForm.controls['Others'].setValue(this.data.Others);
                                                          
    if(this.stInfoForm.controls['STScope'].value === 'Others'){
      this.setvisibleProperty = false;
    }
  }
  setOthers(keyword : string){
    if(keyword === 'Others'){
      this.setvisibleProperty = false;
    }else{
      this.stInfoForm.controls['Others'].setValue('');
      this.setvisibleProperty = true;
    }
  }
  onSubmit() {
  }
  
  Add(key : number) {
      console.log(this.stInfoForm.value)
      this.saveSubscription = this.service.ServiceTransitionInfo_post(this.stInfoForm.value).subscribe(res => {
        if (res.duplicate === 'success') {
            this.toastr.error('Service Trainsition Info already exists', 'Service Trainsition Info');            
        } else if (res.save === 'success') {
              this.toastr.success('Inserted Succcessfully', 'Service Trainsition Info');
              this.dialogRef.close({operation : this.stInfoForm.value.operation});
          }else if (res.save === 'Duplicate record exist') {
            this.toastr.error(res.save, 'Service Trainsition Info');            
        } else {
              this.toastr.error('Insert Fail', 'Service Trainsition Info');
          }
          this.savedFlag = true;
      }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
              this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com');
          } else {
              this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com');
          }
      });     
  }

  close():void {
    this.dialogRef.close({operation : "close"});
  }

  Update(key : number) {
      console.log(this.stInfoForm.value);
      this.saveSubscription = this.service.ServiceTransitionInfo_put(this.stInfoForm.value).subscribe(res => {
          console.log(res)
          if (res.insert === 'success') {    
                  this.savedFlag = true;
                this.editFlag = 0;        
              this.toastr.success('Updated Succcessfully', 'Service Trainsition Info');
              this.dialogRef.close({operation : this.stInfoForm.value.operation});              
          } else {
              this.toastr.error(res.insert, 'Service Trainsition Info');
          }
          
      }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
              console.log('Client Side Error.');
              this.toastr.error('Client side update Error', 'ttstoolssupport@in.ibm.com');
          } else {
              this.toastr.error('Server side update Error', 'ttstoolssupport@in.ibm.com');
              console.log('Server Sider Error.');
          }
      });
      
  }

  ngOnDestroy() {
      this.resetFields();      
      if (this.savedFlag === true) {
          this.saveSubscription.unsubscribe();
      }
  }
  resetFields() {
    this.stInfoForm.controls['Others'].setValue('');
    this.stInfoForm.controls['MasterSTInfoid'].setValue('');
    this.stInfoForm.controls['STScopeLevel'].setValue('');
    this.stInfoForm.controls['STScope'].setValue('');
    this.stInfoForm.controls['STDetailedScope'].setValue('');
    this.stInfoForm.controls['STScopeActivity'].setValue('');
    this.stInfoForm.controls['STToolUsage'].setValue('');

}



}
