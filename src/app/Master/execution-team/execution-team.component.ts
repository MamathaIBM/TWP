import { Component, OnInit, Input , ViewChild, ViewEncapsulation, OnDestroy} from '@angular/core';
import { Validators, FormGroup, FormBuilder, RequiredValidator } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import {forkJoin, Subscription} from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavtntService } from './../../navtnt.service';
import { ExecutionTeamService } from './execution-team/execution-team.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';

export interface Executionteam {
  // MatPaginator Output
  pageEvent: PageEvent;

}

@
Component({
  selector: 'app-execution-team',
  templateUrl: './execution-team.component.html',
  styleUrls: ['./execution-team.component.css']
})
export class ExecutionTeamComponent implements OnInit {
  ExecutionTeamForm: FormGroup;
  username: any;
  FlagHide: string;
  EmailResult: any;
  TeamRole: any;
  RoleIDvalE = [];

  // tslint:disable-next-line:max-line-length
  displayedColumns: string[] = [ 'USER_NAME', 'USER_ROLE', 'USER_ORG', 'Delete']; 
  @ViewChild(MatPaginator) paginator: MatPaginator; // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource < any > ();
  dataLength: number;
  selectedRow: number;
  editFlag: number;
  Tablerowdata: any;
  deleteFlag: number;
  cancledeleteFlag:  number;
  private deleteSubscription: Subscription;
  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private DuplicateSubscription: Subscription;
  private savedFlag = false;
    OwningTTSOrg: string;

  // private savedFlag : boolean = false;

  constructor(private fb: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private navigation: NavtntService,
      private toaster: ToastrService,
      private _ExeSer: ExecutionTeamService,
      private userAccessProfileService: UserAccessProfileService) {
      this.ExecutionTeamForm = this.fb.group({
          IntegrationID: [''],
          CreatedBy: [''],
          ModifiedBy: [''],
          ExecutionTeamName: ['', [Validators.required]],
          ExecutionTeamRole: ['', [Validators.required]],
          USER_FULLNAME: [''],
          USER_ID: [''],
          USER_ROLE_ID: [''],
          USER_TRANSITION_ID: [''],
          USER_ORG:['']
      });
      this.dataLength = 0;
      this.selectedRow = 0;
      this.editFlag = 0;
      this.dataLength = 0;
      this.cancledeleteFlag = 0;
  }

  ngOnInit() {
      this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
      this.username = decodeURIComponent(this.username._value);
      this.OwningTTSOrg = this.userAccessProfileService.getCurrentTransitionOrg();
      this.activatedRoute.queryParams.subscribe((respar: any) => {
          if (respar.filter) {
              if (this.navigation.getParameterValue(respar.filter, 'ViewFlag') === 'Yes') {
                  this.ExecutionTeamForm.disable();
                  this.FlagHide = 'Yes';
              } else {
                  this.FlagHide = 'No';
              }
            //   this.OwningTTSOrg = this.navigation.getParameterValue(respar.filter, 'OwningTTS')
          }
      });
      this.loadData();
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      return forkJoin([this._ExeSer.ExecutionTeamKeywordResult(this.OwningTTSOrg),
              this._ExeSer.ExecutionRoleKeywordResult(),
          ])
          .subscribe(res => {
              this.EmailResult = res[0];
              this.TeamRole = res[1];
          }, (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
                  console.log('Client Sider Error.');
              } else {
                  console.log('Server Sider Error.');
              }
          });

  }
  onSubmit() {

}

getEmail(USER_EMAIL: string, USER_ID: string, USER_ORG:string){
    this.ExecutionTeamForm.controls['USER_FULLNAME'].setValue(USER_EMAIL)
    this.ExecutionTeamForm.controls['USER_ID'].setValue(USER_ID)
    this.ExecutionTeamForm.controls['USER_ORG'].setValue(USER_ORG)
}

getRoleID(e, ROLE_ID: string){    
    if((e.isUserInput) && (e.source.selected)) {
        this.RoleIDvalE.push(ROLE_ID)
     }else {
       var index = this.RoleIDvalE.indexOf(ROLE_ID);
       if (index >= 0) {
         this.RoleIDvalE.splice( index, 1 );
       }
     }   
    this.ExecutionTeamForm.controls['USER_ROLE_ID'].setValue(this.RoleIDvalE);
}

applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
}
  loadData() {
      this.activatedRoute.queryParams.subscribe((res: any) => {
          if (res.filter) {
              //  this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id');
              this.ExecutionTeamForm.controls['IntegrationID'].setValue(this.navigation.getParameterValue(res.filter, 'Id'));
              let obj: any;
              obj = {
                  'IntegrationID': this.ExecutionTeamForm.controls['IntegrationID'].value
              };

              // tslint:disable-next-line:no-shadowed-variable
              this._ExeSer.getUserExecutiondataResult(obj.IntegrationID).subscribe(res => {

                  this.dataSource.data = res;

                  this.dataLength = this.dataSource.data.length;
              }, (errgetUserExecutiondataResult: HttpErrorResponse) => {
                  if (errgetUserExecutiondataResult.error instanceof Error) {
                      console.log('Client Sider Error.');
                  } else {
                      console.log('Server Sider Error.');
                  }
              });
          }
      });
  }


setClickedRow(index: number, rowdata: any): void {
  if(index === 0){
    this.selectedRow = 0;
    this.editFlag = 0;
    this.RestFields();
  }else {
    if (index === this.selectedRow) {
        this.selectedRow = 0;
        this.editFlag = 0;
        this.RestFields();
    } else {
        this.selectedRow = index;
        this.editFlag = 1;
        this.Tablerowdata = rowdata;
        this.ExecutionTeamForm.controls['ExecutionTeamName'].setValue(rowdata.USER_NAME);
        this.ExecutionTeamForm.controls['ExecutionTeamRole'].setValue((rowdata.USER_ROLE).split(','));
        this.RoleIDvalE = JSON.parse("[" + rowdata.USER_ROLE_ID + "]");
        this.ExecutionTeamForm.controls['USER_ROLE_ID'].setValue((rowdata.USER_ROLE_ID).split(','));
        this.ExecutionTeamForm.controls['USER_TRANSITION_ID'].setValue(rowdata.USER_TRANSITION_ID);
    if ((this.deleteFlag === 1) || (this.deleteFlag === 0) ) {
             this.deleteFlag = null;
      this.editFlag = 0;
      this.selectedRow = 0;
      this.RestFields();
    }
    }
  } 
}

  RestFields() {
      this.ExecutionTeamForm.controls['ExecutionTeamName'].setValue('');
      this.ExecutionTeamForm.controls['ExecutionTeamRole'].setValue('');
  }

  Add(obj: any) {
      this.ExecutionTeamForm.controls['CreatedBy'].setValue(this.username);
      this.ExecutionTeamForm.controls['ModifiedBy'].setValue(this.username);
      this._ExeSer.getDuplicateExeTeamResult(this.ExecutionTeamForm.value).subscribe(res => {
          if (res.length === 0) {
              // tslint:disable-next-line:no-shadowed-variable
              this.saveSubscription = this._ExeSer.postAddExecutionteam(this.ExecutionTeamForm.value).subscribe(res => {
                  // this.LocalappInfo =res;
                  this.toaster.success('Delivery Team Details have added successfully.');
                  this.loadData();
                  this.savedFlag = true;
              });
          } else {
              this.toaster.info('Duplicate Delivery Team Details.');
          }
          this.RestFields();
      }, (errpostAddExecutionteam: HttpErrorResponse) => {
          if (errpostAddExecutionteam.error instanceof Error) {
              console.log('Client Sider Error.');
          } else {
              console.log('Server Sider Error.');
          }
      });

  }


  Update() {
      console.log('enter update');
      this.ExecutionTeamForm.controls['ModifiedBy'].setValue(this.username);
      // tslint:disable-next-line:no-shadowed-variable
      this.saveSubscription = this._ExeSer.putUpdateExecutionteam(this.ExecutionTeamForm.value).subscribe(res => {
          this.loadData();
          this.toaster.success('Delivery Team Details have updated successfully');
          this.editFlag = 0;
          this.savedFlag = true;
      }, (errputUpdateExecutionteam: HttpErrorResponse) => {
          if (errputUpdateExecutionteam.error instanceof Error) {
              console.log('Client Sider Error.');
          } else {
              console.log('Server Sider Error.');
          }
      });
      this.RestFields();
  }

  onDelete(obj: any) {
      if (confirm('Are you sure want to delete ' + obj.USER_NAME + ' ?')) {
          this.deleteSubscription = this._ExeSer.DeleteExeTeam(obj.USER_TRANSITION_ID).subscribe(res => {
              this.loadData();
              if (res.Delete === 'success') {
                 this.toaster.success('Deleted Succcessfully', 'Delivery Team');

              } else {
                         this.toaster.error('Delete Fail', 'Delivery Team');
              }
          }, (err: HttpErrorResponse) => {
              if (err.error instanceof Error) {
                  this.toaster.error('Client side delete Error', 'ttstoolssupport@in.ibm.com');
              } else {
                  this.toaster.error('Server side delete Error', 'ttstoolssupport@in.ibm.com');
              }
          });
          this.deleteFlag = 1;

      } else {
        this.deleteFlag = 0;
        //this.toaster.info('Deleted Canclled.', 'Delivery Team');
       }
       }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy() {
      // this.loadparamsSubscription.unsubscribe();
      if (this.savedFlag === true) {
          this.saveSubscription.unsubscribe();
      }
      if (this.deleteFlag === 1) {
          this.deleteSubscription.unsubscribe();
      }
  }
}
