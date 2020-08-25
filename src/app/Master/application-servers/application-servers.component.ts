import { NavtntService } from './../../navtnt.service';
// import { ActiveTransitionsService } from 'src/app//manage-active-transitions/active-transitions.service';
import { ApplicationServersService } from './application-servers/application-servers.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Component, inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { ToastrService } from 'ngx-toastr';




@Component({
  selector: 'app-application-servers',
  templateUrl: './application-servers.component.html',
  styleUrls: ['./application-servers.component.css']
})
export class ApplicationServersComponent implements OnInit, OnDestroy {

  editFlag: number; // check whether user is going for edit or new row add
  deleteFlag: number; // check the delete subscription used or not
  displayedColumns: string[] = ['AppName', 'Environment', 'serverType', 'serverName' ,'remarks', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  applServersUpdateeForm: FormGroup;
  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private deleteSubscription: Subscription;
  private savedFlag = false;
  private vendorDatasource: any;
  private appCategoryDatasource: any;
  private IntegrationID: string;
  private createdBy: string;
  private modifiedBy: string;
  private ApplnNameDatasource: any;
  private EnvironmentDatasource: any;
  private serverTypeDatasource: any;
  private serverNameDatasource: any;
  FlagHide: any;
  username: any;
  constructor(private service: ApplicationServersService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
               private toastr: ToastrService,
               private navigation: NavtntService
             ) {
    this.dataLength = 0;
    this.selectedRow = 0;
    this.editFlag = 0;
    this.deleteFlag = 0;

    this.applServersUpdateeForm = this.fb.group({
      appServerUNID : [''],
      AppName : ['', Validators.required],
      Environment : [''] ,
      serverType : [''] ,
      serverName : [''],
      IntegrationID : [''],
      createdBy : [''],
      modifiedBy : [''],
      AppServer_Remarks : ['']
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
          // this.IntegrationID = this.activatedRoute.snapshot.queryParams['Id']
          this.loadData();
          this.applServersUpdateeForm.controls['IntegrationID'].setValue(this.IntegrationID);
          this.applServersUpdateeForm.controls['createdBy'].setValue(this.createdBy);
          this.applServersUpdateeForm.controls['modifiedBy'].setValue(this.modifiedBy);
      }
    });

    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
    // this.IntegrationID = this.activateRoute.snapshot.queryParams['Id']
    // this.loadData();
    // this.createdBy= "Ram"
    // this.modifiedBy= "Ram"
    // this.applServersUpdateeForm.controls['IntegrationID'].setValue(this.IntegrationID)
    // this.applServersUpdateeForm.controls['createdBy'].setValue(this.createdBy)
    // this.applServersUpdateeForm.controls['modifiedBy'].setValue(this.modifiedBy)
  }

  loadData() {

    this.loadparamsSubscription = forkJoin([
      this.service.getAppServer(this.IntegrationID),
      this.service.getAppName(this.IntegrationID),
      this.service.getEnvironment(),
      this.service.getServerType(),
      this.service.getServerName()

    ]).subscribe(res => {
        this.dataSource.data = res[0];
        this.dataLength = this.dataSource.data.length;
        this.ApplnNameDatasource = res[1];
         this.EnvironmentDatasource = res[2];
         this.serverTypeDatasource = res[3];
         this.serverNameDatasource = res [4];
    }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error ) {
              console.log('Client Sider Error.');
            } else {
              console.log('Server Sider Error.');
          }
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
    this.applServersUpdateeForm.controls['appServerUNID'].setValue(rowdata.appServerUNID);
    this.applServersUpdateeForm.controls['AppName'].setValue(rowdata.AppName);
    this.applServersUpdateeForm.controls['Environment'].setValue(rowdata.Environment);
    this.applServersUpdateeForm.controls['serverType'].setValue(rowdata.serverType);
    this.applServersUpdateeForm.controls['serverName'].setValue(rowdata.serverName);
    this.applServersUpdateeForm.controls['AppServer_Remarks'].setValue(rowdata.AppServer_Remarks);  
    // this.applServersUpdateeForm.controls['AppName'].setValue(rowdata.AppName);  
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
  this.applServersUpdateeForm.controls['AppName'].setValue('');
  this.applServersUpdateeForm.controls['Environment'].setValue('');
  this.applServersUpdateeForm.controls['serverType'].setValue('');
  this.applServersUpdateeForm.controls['serverName'].setValue('');
  this.applServersUpdateeForm.controls['AppServer_Remarks'].setValue('');
}


onSubmit() {

  //    this.saveFunctionality();
}


Add() {
  this.applServersUpdateeForm.controls['createdBy'].setValue(this.username);
  this.applServersUpdateeForm.controls['modifiedBy'].setValue(this.username);
  // if (confirm('Are you sure want to delete ?' ) ) {
  this.saveSubscription =  this.service.appServerSave(this.applServersUpdateeForm.value).subscribe(res => {
   if (res.save === 'success') {
    this.toastr.success('Inserted Succcessfully', 'Application Server');
    this.loadData();
  } else {
    this.toastr.error('Insert Fail', 'Application Server');
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
// } else {
//   this.deleteFlag = 0;
//  this.toastr.info('Deleted Canclled.', 'Application Server');
// }
}

Update() {
  this.applServersUpdateeForm.controls['modifiedBy'].setValue(this.username);
  console.log('update');
  console.log(this.applServersUpdateeForm.value);
     this.saveSubscription =  this.service.appServerUpdate(this.applServersUpdateeForm.value ).subscribe(res => {
       if (res.insert === 'success') {
        this.toastr.success('Updated Succcessfully', 'Application Server');
        this.loadData();
       } else {
        this.toastr.error('Update Fail', 'Application Server');
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
        console.log('delete' + obj.appServerUNID);
      this.deleteSubscription =  this.service.appServerDelete(obj.appServerUNID).subscribe(res => {
        if (res.Delete === 'success') {
          this.toastr.success('Deleted Succcessfully', 'Application Server');
          this.loadData();
         } else {
          this.toastr.error('Delete Fail', 'Application Server');
         }
      }, (errappServerDelete: HttpErrorResponse) => {
        if (errappServerDelete.error instanceof Error ) {
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
    this.deleteFlag = 0;
    //this.toastr.info('Deleted Canclled.', 'Application Server'); 
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
