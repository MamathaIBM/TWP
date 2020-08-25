import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ServiceTransitionInfoService } from './service/service-transition-info.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavtntService } from 'src/app/navtnt.service';
import { DatePipe } from '@angular/common';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Component, inject, ViewChild, OnInit, OnDestroy,ElementRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { ServiceTransitionInfoAddEditComponent } from './add-edit/service-transition-info-add-edit.component';
import { stInfoClass } from './class/stInfoClass.model';

@Component({
  selector: 'app-service-transition-info',
  templateUrl: './service-transition-info.component.html',
  styleUrls: ['./service-transition-info.component.css']
})
export class ServiceTransitionInfoComponent implements OnInit,OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator; // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource < any > ();
  displayedColumns: string[] = ['STScopeLevel', 'STScope', 'STDetailedScope', 'STScopeActivity', 'STToolUsage','icon'];
  editFlag: number; // check whether user is going for edit or new row add
  dataLength: number;
  username: any;
  FlagHide: string;
  private IntegrationID: string;
  stInfoForm : FormGroup;
  stInfoForm_get_subscription : Subscription;
  deleteSubscription : Subscription;
  deleteSubscription_flag :Number = 0;
  stInfoForm_get_flag : number;
  get_res_data: any;
  selectedRow: number;
  deleteFlag: number;


  constructor(private service: ServiceTransitionInfoService,
    public dialog : MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private navigation: NavtntService,    
    public datepipe: DatePipe) {
      this.stInfoForm_get_flag = 0;
      this.editFlag = 0;
      this.stInfoForm = this.fb.group(
        {
          MasterSTInfoid  : [''],
          IntegrationID   : [''],
          STScopeLevel    : [''],
          STScope         : [''],
          STDetailedScope : [''],
          STScopeActivity : [''],
          STToolUsage     : [''],
          Others          : [''],
          CREATED_BY      : [''],
          MODIFIED_BY     : [''],
          operation : ['']
        }
      )
    
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
            this.loadData();
            this.stInfoForm.controls['IntegrationID'].setValue(this.IntegrationID);
            this.stInfoForm.controls['CREATED_BY'].setValue(this.username);
            this.stInfoForm.controls['MODIFIED_BY'].setValue(this.username);
        }
    });  
    
  }
  viewOpenDialog(): void {
    let dialogRef = this.dialog.open(ServiceTransitionInfoAddEditComponent, {
       width: '1200px',   
       data: this.stInfoForm.value
    });  
    dialogRef.afterClosed().subscribe(result => {
        // this.resetFields()
        // this.loadData();                           
     });
  }
  
  editOpenDialog(): void {
    let dialogRef = this.dialog.open(ServiceTransitionInfoAddEditComponent, {
      width: '1200px',         
      data: this.stInfoForm.value
    });  
    dialogRef.afterClosed().subscribe(result => {
        this.resetFields()
        this.loadData();                           
    });
  }
  Add_openDialog(): void {
    console.log("test")
    let dialogRef = this.dialog.open( ServiceTransitionInfoAddEditComponent  , {
       width: '1200px',   
       data: {    IntegrationID       : this.IntegrationID,
                  operation           : 'Add'
              }
    });
    dialogRef.afterClosed().subscribe(result => {
        this.loadData();                           
     });
  }

  loadData(){    
    this.stInfoForm_get_subscription = this.service.ServiceTransitionInfo_get(this.IntegrationID).subscribe((get_res :any) =>{      
      this.get_res_data = get_res;
    },(st_get_err : HttpErrorResponse)=>{
      if (st_get_err.error instanceof Error) {
        console.log('Client Sider Error.');
    } else {
        console.log('Server Sider Error.');
    }
    },
    ()=>{    
      this.dataSource.data =  this.get_res_data;        
      this.dataLength = this.dataSource.data.length;
    } )
  }

applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

onDelete(obj: any) {  
  if (confirm('Are you sure want to delete ?' ) ) {        
      this.deleteSubscription =  this.service.ServiceTransitionInfo_delete(obj.MasterSTInfoid,obj.STScopeLevel).subscribe(res => {
        
        if (res.Delete === 'success') {
          this.toastr.success('Deleted Succcessfully', 'Service Transition Info');
          this.loadData();
        } else  if (res.Delete === 'Fail') {
          this.toastr.error('Delete Fail', 'Service Transition Info');
        }else{
           this.toastr.error(res.Delete, 'Service Transition Info');
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

setClickedRow(index: number, rowdata: any,buttonOperation :string ): void { 
  console.log(rowdata)       
      this.selectedRow = index;
      this.editFlag = 1;
      this.stInfoForm.controls['IntegrationID'].setValue(rowdata.IntegrationID);
   this.stInfoForm.controls['MasterSTInfoid'].setValue(rowdata.MasterSTInfoid);
   this.stInfoForm.controls['STScopeLevel'].setValue(rowdata.STScopeLevel);      
    this.stInfoForm.controls['STScope'].setValue(rowdata.STScope);
    this.stInfoForm.controls['STDetailedScope'].setValue(rowdata.STDetailedScope);
    this.stInfoForm.controls['STScopeActivity'].setValue(rowdata.STScopeActivity);
    this.stInfoForm.controls['STToolUsage'].setValue(rowdata.STToolUsage);
    this.stInfoForm.controls['Others'].setValue(rowdata.Others);
    if(buttonOperation === 'Edit') {
      this.stInfoForm.controls['operation'].setValue("update"); 
    }else{
      this.stInfoForm.controls['operation'].setValue("View"); 
    }
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
  console.log(this.stInfoForm.value)
}

resetFields() {
  this.editFlag = 0
  this.stInfoForm.controls['MasterSTInfoid'].setValue('');
  this.stInfoForm.controls['STScopeLevel'].setValue('');      
   this.stInfoForm.controls['STScope'].setValue('');
   this.stInfoForm.controls['STDetailedScope'].setValue('');
   this.stInfoForm.controls['STScopeActivity'].setValue('');
   this.stInfoForm.controls['STToolUsage'].setValue('');
   this.stInfoForm.controls['Others'].setValue('');
}

  ngOnDestroy(){
    if(this.stInfoForm_get_flag === 1){
      this.stInfoForm_get_subscription.unsubscribe();
    }
    if(this.deleteFlag === 1){
      this.deleteSubscription.unsubscribe();
    }
    this.service.Paramsubscription.unsubscribe();
  }

}
