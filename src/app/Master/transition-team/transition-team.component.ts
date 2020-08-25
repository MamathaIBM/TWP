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
import { TransitionTeamService } from './transition-team/transition-team.service';
import { NgNoValidate } from '@angular/forms/src/directives/ng_no_validate_directive';
import { variable } from '@angular/compiler/src/output/output_ast';
import { UserAccessProfileService } from 'Services/user-access-profile.service';

export interface Executionteam {
  // MatPaginator Output
  pageEvent: PageEvent;

}

@Component({
  selector: 'app-transition-team',
  templateUrl: './transition-team.component.html',
  styleUrls: ['./transition-team.component.css']
})
export class TransitionTeamComponent implements OnInit {

  TransitionTeamForm: FormGroup;
  username: any;
  FlagHide: string;
  EmailResult: any;
  TeamRole: any;
  RoleIDval: any = [];

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
  ADDFlag: number;
  private deleteSubscription: Subscription;
  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private DuplicateSubscription: Subscription;
  private savedFlag = false;
    OwningTTSOrg: string;
   useremail: any;
   constructor(private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private navigation: NavtntService,
    private toaster: ToastrService,
    private _TrSer: TransitionTeamService,
    private userAccessProfileService: UserAccessProfileService) {
      this.TransitionTeamForm = this.fb.group({
      IntegrationID: [''],
      CreatedBy: [''],
      ModifiedBy: [''],
      TransitionTeamName: [null, Validators.required] ,
     TransitionTeamRole: [null, Validators.required],
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
this.ADDFlag = 0; }

  ngOnInit() {
         this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);
    
     this.useremail = this.userAccessProfileService.getUserEmail();

    this.OwningTTSOrg = this.userAccessProfileService.getCurrentTransitionOrg();

    this.activatedRoute.queryParams.subscribe((respar: any) => {
        if (respar.filter) {
            if (this.navigation.getParameterValue(respar.filter, 'ViewFlag') === 'Yes') {
                this.TransitionTeamForm.disable();
                this.FlagHide = 'Yes';
            } else {
                this.FlagHide = 'No';
            }
        // this.OwningTTSOrg = this.navigation.getParameterValue(respar.filter, 'OwningTTS')
        }
    });
    this.loadData();
    this.TransitionTeamForm.controls['TransitionTeamName'].setValidators(Validators.required);

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.RoleIDval = [];
    return forkJoin([this._TrSer.TransitionTeamKeywordResult(this.OwningTTSOrg),
            this._TrSer.TransitionRoleKeywordResult(),
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
onSubmit(){
    
}

getEmail(USER_EMAIL: string, USER_ID: string, USER_ORG:string){
    this.TransitionTeamForm.controls['USER_FULLNAME'].setValue(USER_EMAIL)
    this.TransitionTeamForm.controls['USER_ID'].setValue(USER_ID)
    this.TransitionTeamForm.controls['USER_ORG'].setValue(USER_ORG)
}
// && (e.source.selected)
getRoleID(e, ROLE_ID: string){  
    if((e.isUserInput) && (e.source.selected)) {
        this.RoleIDval.push(ROLE_ID)
     }else {        
       var index = this.RoleIDval.indexOf(ROLE_ID);
       if (index >= 0) {      
         this.RoleIDval.splice( index, 1 );
       }
     }   
    this.TransitionTeamForm.controls['USER_ROLE_ID'].setValue(this.RoleIDval);
}

loadData() {
                 this.activatedRoute.queryParams.subscribe((res: any) => {
        if (res.filter) {
            //  this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id');
            this.TransitionTeamForm.controls['IntegrationID'].setValue(this.navigation.getParameterValue(res.filter, 'Id'));
            let obj: any;
            obj = {
                'IntegrationID': this.TransitionTeamForm.controls['IntegrationID'].value
            };

            // tslint:disable-next-line:no-shadowed-variable
            this._TrSer.getUserTransdataResult(obj.IntegrationID).subscribe(res => {

                this.dataSource.data = res;

                this.dataLength = this.dataSource.data.length;
            }, (errgetUserTransdataResult: HttpErrorResponse) => {
                if (errgetUserTransdataResult.error instanceof Error) {
                    console.log('Client Sider Error.');
                } else {
                    console.log('Server Sider Error.');
                }
            });
        }
    });
}

applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

setClickedRow(index: number, rowdata: any): void {
  if(index === 0){
        this.selectedRow = 0;
        this.editFlag = 0;
        this.RestFields();
  }else {
    if (index === this.selectedRow) {
        this.selectedRow = 0;
        // this.CreateFalg = 'No';
        this.editFlag = 0;
        this.RestFields();
    } else {
        this.RoleIDval = [];
        this.selectedRow = index;
        this.editFlag = 1;
        this.Tablerowdata = rowdata;
        this.TransitionTeamForm.controls['TransitionTeamName'].setValue(rowdata.USER_NAME);
        this.TransitionTeamForm.controls['TransitionTeamRole'].setValue((rowdata.USER_ROLE).split(','));
        this.RoleIDval = JSON.parse("[" + rowdata.USER_ROLE_ID + "]");
        // this.RoleIDval = rowdata.USER_ROLE_ID.split(',')
        this.TransitionTeamForm.controls['USER_ROLE_ID'].setValue((rowdata.USER_ROLE_ID).split(','));
        this.TransitionTeamForm.controls['USER_TRANSITION_ID'].setValue(rowdata.USER_TRANSITION_ID);
        
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
     this.TransitionTeamForm.controls['TransitionTeamName'].setValue(null);
   this.TransitionTeamForm.controls['TransitionTeamRole'].setValue(null);
    this.loadData();
   // this.TransitionTeamForm.get('TransitionTeamName').reset();
    // this.TransitionTeamForm.controls['TransitionTeamRole'].validator(null);
    // this.TransitionTeamForm.controls['TransitionTeamName'].validator(null);
    // console.log( this.TransitionTeamForm.setErrors(null));
}
           onBlurMethod(event, field) {
        // if (event.isUserInput) {
        //     console.log(event.source.value, event.source.selected);
        //     this.TransitionTeamForm.controls[field].clearValidators();
        // this.TransitionTeamForm.get(field).updateValueAndValidity();
        //       } else {
        //     console.log(event.source.value, event.source.selected);
        //       this.TransitionTeamForm.controls[field].setValidators([Validators.required]);
        //     this.TransitionTeamForm.get(field).updateValueAndValidity();
        //   }
      }
  Add(obj: any) {
     this.TransitionTeamForm.controls['CreatedBy'].setValue(this.username);
    this.TransitionTeamForm.controls['ModifiedBy'].setValue(this.username);
    this._TrSer.getDuplicateTransTeamResult(this.TransitionTeamForm.value).subscribe(res => {
        if (res.length === 0) {
            // tslint:disable-next-line:no-shadowed-variable
            this.saveSubscription = this._TrSer.postAddTransitionteam(this.TransitionTeamForm.value).subscribe(res => {
                // this.LocalappInfo =res;
               this.loadData();
                   this.toaster.success('Transition Team Details have added successfully.');
                         this.savedFlag = true;
            });
            this.ADDFlag = 1;
            this.RestFields();
        } else {
            this.toaster.info('Duplicate Transition Team Details.');
        }
        }, (errpostAddTransitionteam: HttpErrorResponse) => {
        if (errpostAddTransitionteam.error instanceof Error) {
            console.log('Client Sider Error.');
        } else {
            console.log('Server Sider Error.');
        }
    });

}


Update() {
    console.log('enter update');
    this.TransitionTeamForm.controls['ModifiedBy'].setValue(this.username);
    // tslint:disable-next-line:no-shadowed-variable
    this.saveSubscription = this._TrSer.putUpdateTransitionteam(this.TransitionTeamForm.value).subscribe(res => {
        this.loadData();
        this.toaster.success('Transition Team Details have updated successfully');
        this.editFlag = 0;
        this.savedFlag = true;
    }, (errputUpdateTransitionteam: HttpErrorResponse) => {
        if (errputUpdateTransitionteam.error instanceof Error) {
            console.log('Client Sider Error.');
        } else {
            console.log('Server Sider Error.');
        }
    });
    this.RestFields();
}

onDelete(obj: any) {
     if (confirm('Are you sure want to delete ' + obj.USER_NAME + ' ? If so, Access will be removed to the user for this account.')) {
        this.deleteSubscription = this._TrSer.DeleteTransTeam(obj.USER_TRANSITION_ID).subscribe(res => {
            this.loadData();
            console.log(obj.USER_TRANSITION_ID);
            if (res.Delete === 'success') {
               this.toaster.success('Deleted Succcessfully', 'Transition Team');
            }else {
            this.toaster.error('Delete Fail', 'Transition Team');
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
        // this.editFlag = 0;
        // this.RestFields();
        //this.toaster.info('Deleted Cancalled.', 'Transition Team');
         }
        //  this.RestFields();
        //  this.editFlag = 0;
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




