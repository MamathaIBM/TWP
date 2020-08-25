
import { NavtntService } from './../../navtnt.service';
import { Stakeholder } from './class/stakeholder.model';
import { ActivatedRoute } from '@angular/router';
import {forkJoin} from 'rxjs';
import { Router } from '@angular/router';
import { TransitionStakeholderService } from './transition-stakeholder-module/transition-stakeholder.service';
import { Component, inject, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
// tslint:disable-next-line:class-name
export interface stakeholderpage {
  // MatPaginator Output
  pageEvent: PageEvent; }
    @Component({
  selector: 'app-transition-stakeholder',
  templateUrl: './transition-stakeholder.component.html',
  styleUrls: ['./transition-stakeholder.component.css']
})
export class TransitionStakeholderComponent implements OnInit, OnDestroy  {


  editFlag: number; // check whether user is going for edit or new row add
  deleteFlag: number; // check the delete subscription used or not
  displayedColumns: string[] = ['ResourceName', 'EmailId', 'Role', 'Delete'];
  @ViewChild('ResourceName') nameField: ElementRef;
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  stakeholderUpdateeForm: FormGroup;
  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private deleteSubscription: Subscription;
  private savedFlag = false;
  private IntegrationID: string;
  private createdBy: string;
  private modifiedBy: string;
  FlagHide: any;
  username: any;
  myJSON = '';
  ResourceName = [];
  Resource_Name_Email: any = [];
  count: number;
      emailcheck: any;
      Empnamecheck: any;
      TeamRole: any;
      RoleIDStake: any = [];
    
  constructor(private _service: TransitionStakeholderService ,
              private fb: FormBuilder ,
              private route: Router,
              private activatedRoute: ActivatedRoute,
              private toastr: ToastrService,
              private navigation: NavtntService
            ) {
                this.dataLength = 0;
                this.selectedRow = 0;
                this.editFlag = 0;
                this.deleteFlag = 0;
                this.stakeholderUpdateeForm =  this.fb.group ({
                  AppUNID : [''],
                  IntegrationID: [''],
                  ResourceName :  ['', Validators.required],
                  EmailId : [''] ,
                  Role : ['', Validators.required],
                  createdBy : [''],
                  modifiedBy : [''],
                  USER_ROLE_ID : ['']

                })   ;
                this.editFlag = 0;
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

          console.log(this.IntegrationID);

          this.dataSource.sort = this.sort;
          console.log(2);
          this.dataSource.paginator = this.paginator;
          // this.IntegrationID = this.activatedRoute.snapshot.queryParams['Id']
          this.loadData();
           this.stakeholderUpdateeForm.controls['IntegrationID'].setValue(this.IntegrationID);
          this.stakeholderUpdateeForm.controls['createdBy'].setValue(this.createdBy);
          this.stakeholderUpdateeForm.controls['modifiedBy'].setValue(this.modifiedBy);

      }

        });
        this.RoleIDStake = [];
        return forkJoin([this._service.TransitionRoleKeywordResult(),
        ])
        .subscribe(res => {
                   this.TeamRole = res[0];
        }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log('Client Sider Error.');
            } else {
                console.log('Server Sider Error.');
            }
        });
    }

loadData() {
      this.loadparamsSubscription = this._service.getStakeholder(this.IntegrationID).subscribe(res => {
        this.dataSource.data = res;
    //    this.dataLength = res.length;
        this.dataLength = this.dataSource.data.length;

  }, (errgetStakeholder: HttpErrorResponse) => {
         if (errgetStakeholder.error instanceof Error) {
           console.log('Client Sider Error.');
         } else {
           console.log('Server Sider Error.');
       }

       });
    }

applyFilter(filterValue: string) {
          this.dataSource.filter   = filterValue.trim().toLowerCase();
    }

    getRoleID(e, ROLE_ID: string){  
      if((e.isUserInput) && (e.source.selected)) {
          this.RoleIDStake.push(ROLE_ID)
       }else {        
         var index = this.RoleIDStake.indexOf(ROLE_ID);
         if (index >= 0) {      
           this.RoleIDStake.splice( index, 1 );
         }
       }   
      this.stakeholderUpdateeForm.controls['USER_ROLE_ID'].setValue(this.RoleIDStake);
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
                this.editFlag = 1;
                this.selectedRow = index;
                this.stakeholderUpdateeForm.controls['AppUNID'].setValue(rowdata.AppUNID);
                this.stakeholderUpdateeForm.controls['IntegrationID'].setValue(rowdata.IntegrationID);
                this.stakeholderUpdateeForm.controls['ResourceName'].setValue(rowdata.ResourceName);
                this.stakeholderUpdateeForm.controls['EmailId'].setValue(rowdata.EmailId);
                this.stakeholderUpdateeForm.controls['Role'].setValue((rowdata.Role).split(','));
                this.RoleIDStake = JSON.parse("[" + rowdata.USER_ROLE_ID + "]");
                // this.RoleIDval = rowdata.USER_ROLE_ID.split(',')
                this.stakeholderUpdateeForm.controls['USER_ROLE_ID'].setValue((rowdata.USER_ROLE_ID).split(','));
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
      this.stakeholderUpdateeForm.controls['AppUNID'].setValue('');
      // this.stakeholderUpdateeForm.controls['IntegrationID'].setValue('')
      this.stakeholderUpdateeForm.controls['ResourceName'].setValue('');
      this.stakeholderUpdateeForm.controls['EmailId'].setValue('');
      this.stakeholderUpdateeForm.controls['Role'].setValue('');
}

onSubmit( ) {
  // console.log(event)
   //   this.saveFunctionality();
}

valuechange(ResourceName: string) {

  this.stakeholderUpdateeForm.controls['EmailId'].setValue('');
  this.myJSON = null;

}
getEmail(ResourceName: string) {
    this.stakeholderUpdateeForm.controls['EmailId'].setValue(ResourceName);
}

getEmployeeName(Name: string) {

  this.ResourceName = [];
  this._service.getEmployeeDirectory(Name).subscribe(res => {

 // tslint:disable-next-line:max-line-length
 // this.photo = 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/' + res.body.split('\n')[i * 69 + 0].split(':')[1];
  this.count = res.body.split('\n').length - 2;
  this.count = res.body.split('\n')[this.count].split(',')[1].split('=')[1];
    for ( let i = 0; i < this.count ; i++) {
      this.emailcheck = res.body.split('\n')[i * 69 + 22].split(':')[1];
   // tslint:disable-next-line:max-line-length
   // this.photo = 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/' + res.body.split('\n')[i * 69 + 0].split(':')[1];
      if ((this.emailcheck === '') || (this.emailcheck === undefined) || (this.emailcheck === null)) {
        this.emailcheck = 'No email ID in Bluepages';
      }
      this.Empnamecheck = res.body.split('\n')[i * 69 + 57].split(': ')[1] + res.body.split('\n')[i * 69 + 59].split(':')[1];
      if ((this.Empnamecheck === '') || (this.Empnamecheck === undefined) || (this.Empnamecheck === null)) {
        this.Empnamecheck = res.body.split('\n')[ i * 69 + 12].split(': ')[1];
      }
      const item = {
        'name': res.body.split('\n')[ i * 69 + 12].split(': ')[1],
        'email': this.emailcheck,
        'Emp_Name' : this.Empnamecheck,
        'cnum' : res.body.split('\n')[i * 69 + 0].split(': ')[1],
        // tslint:disable-next-line:max-line-length
        'photo' : 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/' + res.body.split('\n')[i * 69 + 0].split(': ')[1]
      };
           this.ResourceName.push(item);
    }
     this.myJSON = JSON.parse(JSON.stringify(this.ResourceName));
  this.nameField.nativeElement.focus();
});
}
Update(obj: any) {
  if (this.stakeholderUpdateeForm.controls['EmailId'].value === '') {
    this.toastr.warning('Please select the valid Stakeholder Name.');
    return false;
   }
  this.stakeholderUpdateeForm.controls['modifiedBy'].setValue(this.username);
     this.saveSubscription =  this._service.putStakeholder(this.stakeholderUpdateeForm.value ).subscribe(res => {
    if (res.insert === 'success') {
      this.myJSON = null;
      this.toastr.success('Updated Succcessfully', 'Stakeholders');
      this.loadData();
     } else {
      this.toastr.error('Update Fail', 'Stakeholders');
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

Add(obj: any) {
  if (this.stakeholderUpdateeForm.controls['EmailId'].value === '') {
    this.toastr.warning('Please select the valid Stakeholder Name.');
    return false;
   }
  this.stakeholderUpdateeForm.controls['createdBy'].setValue(this.username);
  this.stakeholderUpdateeForm.controls['modifiedBy'].setValue(this.username);
  this.saveSubscription =  this._service.postStakeholder(this.stakeholderUpdateeForm.value ).subscribe(res => {
    console.log('add' +  this.stakeholderUpdateeForm.value);
    if (res.save === 'Success') {
      this.myJSON = null;
      this.toastr.success('Inserted Succcessfully', 'Stakeholders');
      this.loadData();
    } else {
      this.toastr.error('Insert Fail', 'Stakeholders');
    }
  this.savedFlag = true;
}, (errpostStakeholder: HttpErrorResponse) => {
  if (errpostStakeholder.error instanceof Error ) {
    console.log('Client Side Error.');
    this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com');
  } else {
    this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com');
    console.log('Server Side Error.');
}
});
  this.resetFields();
}

// saveFunctionality(){
//   console.log(this.stakeholderUpdateeForm.value)
//  if( this.editFlag === 0) {
//           console.log("save")
//          this.saveSubscription=  this._service.postStakeholder(this.stakeholderUpdateeForm.value ).subscribe(res=>{
//          console.log(res);
//          this.loadData();
//          this.savedFlag = true;
//       })
//   }else{
//     console.log("update")
//        this.saveSubscription=  this._service.putStakeholder(this.stakeholderUpdateeForm.value ).subscribe(res=>{
//        console.log(res);
//        this.loadData();
//        this.savedFlag = true;
//        this.editFlag = 0;
//       })
//   }
//  this.resetFields();
// }

onDelete(obj: any) {
  console.log('delete');
  if (confirm('Are you sure want to delete ?' ) ) {
        console.log('delete' + obj.AppUNID);
      this.deleteSubscription =  this._service.deleteStakeholder(obj.AppUNID).subscribe(res => {
        if (res.Delete === 'success') {
          this.toastr.success('Deleted Succcessfully', 'Stakeholders');
          this.loadData();
         } else {
          this.toastr.error('Delete Fail', 'Stakeholders');
         }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error ) {
          // console.log("Client Side Error.");
          this.toastr.error('Client side delete Error', 'ttstoolssupport@in.ibm.com');
        } else {
          this.toastr.error('Server side delete Error', 'ttstoolssupport@in.ibm.com');
        //  console.log("Server Side delete Error.");
      }
    });
      this.deleteFlag = 1;
  } else {
    this.deleteFlag = 0;
     //this.toastr.info('Deleted Canclled.', 'Transition Stakeholder');
  }
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

