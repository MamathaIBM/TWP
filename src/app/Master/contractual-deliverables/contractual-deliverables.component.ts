import { ContractualDeliverablesService } from './contractual-deliverables/contractual-deliverables.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, Input , ViewChild, ViewEncapsulation, ElementRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TransitionProfileService } from './../../transition-profile/Service/transition-profile.service';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { UserNameService } from 'Services/user-name.service';
import { NavtntService } from './../../navtnt.service';

export interface ContDeliverables {
  // MatPaginator Output
  pageEvent: PageEvent;
}

@Component({
  selector: 'app-contractual-deliverables',
  templateUrl: './contractual-deliverables.component.html',
  styleUrls: ['./contractual-deliverables.component.css']
})
export class ContractualDeliverablesComponent implements OnInit {
  CDForm: FormGroup;
  CreateFalg: any;
  Deliverableoptions: any;
  DeliverableValoptions: any;
  ToolsValueoptions: any;
  WPValueoptions: any;
  CDValue: any;
  IntegrationID: any;
  Tablerowdata: any;
  DuplicateDelivAdd: any;
  DuplicateDelivUpdate: any;
  duplvariable: any;
FlagHide: any;
username: any;
FlagDelOpt:any;

  duplicatecheckval: number;
  editFlag: number; // check whether user is going for edit or new row add
  // position = new FormControl('above');
  displayedColumns: string[] = ['DeliverableName', 'DeliverableValues', 'ContractDoc_OwnerNM', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('ContractDoc_OwnerNM') nameField: ElementRef;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  private saveSubscription: Subscription;
  private UpdateSubscription: Subscription;
  private deleteSubscription: Subscription;
  myJSON: '';
  Employee_Name: any[];
  CDDelVal: any[];

  count: number;
  emailcheck: any;
  Empnamecheck: any;
  deleteFlag: number;

  constructor(private _Ser: ContractualDeliverablesService,
    private _SerTransisiton: TransitionProfileService,
    private fb: FormBuilder,
    private route: Router,
    private _UserSer: UserNameService,
    private activatedRoute: ActivatedRoute,
    private navigation: NavtntService,
    private toaster: ToastrService) {
      this.CDForm =  this.fb.group ({
        DeliverableName: ['', [Validators.required]],
        DeliverableValue: ['', [Validators.required]],
        IntigrationID: [''],
        DeliverableValueText: ['', [Validators.required]],
        CreatedBy: [''],
          CreatedDate: [''],
          ModifiedBy: [''],
          ModifiedDate: [''],
          CDUNID: [''],
          ContractDoc_OwnerNM : ['', Validators.required],
          ContractDoc_Owneremail : ['']
      });
      this.editFlag = 0;
      this.dataLength = 0;
      this.selectedRow = 0;
      this.dataLength = 0;
      // this.duplvariable = 0;
    }

  ngOnInit() {
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);
       this.activatedRoute.queryParams.subscribe((respar: any) => {
      if (respar.filter) {
        if (this.navigation.getParameterValue(respar.filter, 'ViewFlag') === 'Yes') {
        this.FlagHide = 'Yes';
        } else {
          this.FlagHide = 'No';
        }
      }
    });

    this.CreateFalg = 'No' ;
    this.FlagDelOpt= 'No';
    this.duplvariable = 0;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loadData();
    if (this.CDForm.controls['DeliverableName'].value !== ''){
      this.onKeyDelVal();
    }
     return forkJoin([this._Ser.getDelivnameKeywordResult()])
      .subscribe(res => {
         this.Deliverableoptions = res[0];
          }, (err: HttpErrorResponse) => {
       if (err.error instanceof Error) {
         console.log('Client Sider Error.');
       } else {console.log('Server Sider Error.');
     }
     });
}

loadData() {
  this.activatedRoute.queryParams.subscribe((res: any) => {
        if (res.filter) {
             this.CDForm.controls['IntigrationID'].setValue(this.navigation.getParameterValue(res.filter, 'Id'));
             let obj: any;
       obj = {'IntegrationID': this.CDForm.controls['IntigrationID'].value };

      this._Ser.getContractualDeliverablesResult(obj.IntegrationID).subscribe(res => {

          this.dataSource.data = res;
           this.dataLength = this.dataSource.data.length;
          this.IntegrationID = res.IntegrationID;
    }, (errgetContractualDeliverablesResult: HttpErrorResponse) => {
           if (errgetContractualDeliverablesResult.error instanceof Error) {
             console.log('Client Sider Error.');
           } else {
             console.log('Server Sider Error.');
         }

         });
        }
      });
    }

  onSubmit( ) {
    // console.log(event)
     //   this.saveFunctionality();
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
 }

valuechange(TName: string) {
  this.CDForm.controls['ContractDoc_Owneremail'].setValue('');
  this.myJSON = null;
}
getEmail(OwnerName: string) {
  this.CDForm.controls['ContractDoc_Owneremail'].setValue(OwnerName);
}

getEmployeeName(Name: string) {
  this.Employee_Name = [];
  this._Ser.getEmployeeDirectory(Name).subscribe(res => {
  this.count = res.body.split('\n').length - 2;
  this.count = res.body.split('\n')[this.count].split(',')[1].split('=')[1];

    for ( let i = 0; i < this.count ; i++) {
      this.emailcheck = res.body.split('\n')[i * 69 + 22].split(':')[1];  
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
      this.Employee_Name.push(item);
    }
     this.myJSON = JSON.parse(JSON.stringify(this.Employee_Name));
     this.nameField.nativeElement.focus();
});
}

RemoveValidation(fieldName: string) {
     this.CDForm.get(fieldName).clearValidators();
     this.CDForm.get(fieldName).updateValueAndValidity();
}

onKeyDelVal() {
  this._Ser.getDelVal(this.CDForm.controls['DeliverableName'].value).subscribe(res => {
    this.CDValue=res;
   if (res.length === 0 ){
    this.FlagDelOpt='Yes'
       this.RemoveValidation('DeliverableValue');
  }else{
    this.FlagDelOpt='No'
        this.RemoveValidation('DeliverableValueText'); 
  }
  }); 
}

deselectval(){
  this.CDForm.controls['DeliverableValue'].setValue('');
  this.CDForm.controls['DeliverableValueText'].setValue('');
}

setClickedRow(index: number, rowdata: any): void {
 
  if(index === 0){
        this.selectedRow = 0;
        this.CreateFalg = 'No';
        this.editFlag = 0;
        this.resetFields();
  }else{
    if (index === this.selectedRow) {
        this.selectedRow = 0;
        this.CreateFalg = 'No';
        this.editFlag = 0;
        this.resetFields();
    }else{
      this.resetFields();
      this.CDForm.controls['DeliverableName'].setValue(rowdata.DeliverableName);
      this.onKeyDelVal(); 
      setTimeout(() => {                  
            this.selectedRow = index;
            this.Tablerowdata = rowdata;
            this.CreateFalg = 'Yes';
            this.editFlag = 1;

            if (this.FlagDelOpt==='Yes')  {   
                this.CDForm.controls['DeliverableValueText'].setValue(rowdata.DeliverableValues);
            }else{
                if( this.CDValue.indexOf(rowdata.DeliverableValues) !== 1){  
                  const item = {
                        'id':rowdata.CDUNID,
                        'FieldCategoryName':rowdata.DeliverableName,
                        'Categoryvalues': rowdata.DeliverableValues
                  }; 
                  this.CDValue.push(item);                                                       
                }         
                this.CDForm.controls['DeliverableValue'].setValue(rowdata.DeliverableValues.split(',')); 
                }
                this.CDForm.controls['ContractDoc_OwnerNM'].setValue(rowdata.ContractDoc_OwnerNM);
                this.CDForm.controls['ContractDoc_Owneremail'].setValue(rowdata.ContractDoc_Owneremail);
                this.CDForm.controls['IntigrationID'].setValue(rowdata.IntigrationID);
                this.CDForm.controls['CreatedBy'].setValue(rowdata.CreatedBy);
                this.CDForm.controls['ModifiedBy'].setValue(rowdata.ModifiedBy);
                this.CDForm.controls['CDUNID'].setValue(rowdata.CDUNID);
                if ((this.deleteFlag === 1) || (this.deleteFlag === 0) ) {
                    this.deleteFlag = null;
                    this.editFlag = 0;
                    this.selectedRow = 0;
                    this.resetFields();
                }
      }, 400);
    }                
  }
}

 Add(obj: any) {
  if (this.CDForm.controls['ContractDoc_Owneremail'].value === '') {
    this.toaster.warning('Please select the valid Owner Name.');
    return false;
  }
  this.CDForm.controls['CreatedBy'].setValue(this.username);
  this.CDForm.controls['ModifiedBy'].setValue(this.username);
  this._Ser.getDuplicateCDResult(this.CDForm.value).subscribe(res => {
     if (res.length === 0) {
      this.saveSubscription =  this._Ser.postCD(this.CDForm.value).subscribe(res => {
        this.loadData();
        this.resetFields();
        this.myJSON = null;
        this.toaster.success('Contractual Deliverables have added successfully.');
            });
    } else {
      this.toaster.info('Duplicate Deliverable Value exists');
      this.resetFields();
      return false;
    }
    }, (errpostCD: HttpErrorResponse) => {
  if (errpostCD.error instanceof Error) {
   console.log('Client side error.') ;
  } else {console.log('Server side error.') ; }
});
}

Update(obj: any) {
  if (this.CDForm.controls['ContractDoc_Owneremail'].value === '') {
    this.toaster.warning('Please select the valid Owner Name.');
    return false;
  }
  this.CDForm.controls['ModifiedBy'].setValue(this.username);
  this.UpdateSubscription =  this._Ser.putCD(this.CDForm.value).subscribe(res => {
  this.loadData();
  this.resetFields();
  this.editFlag = 0;
  this.myJSON = null;
  this.toaster.success('Contractual Deliverables have updated successfully.');
  });
}

onDelete(obj: any) {
  if (confirm('Are you sure want to delete ' + obj.DeliverableValues + ' ?')) {
    this.deleteSubscription =  this._Ser.deleteCD(obj.CDUNID).subscribe(res => {
          this.loadData();
           if (res.Delete === 'Success') {
             this.toaster.success('Deleted Succcessfully', 'Contractual Deliverables');
          } else {
          this.toaster.error('Delete Fail', 'Contractual Deliverables');
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
   }
}

resetFields() {
      this.CDForm.controls['DeliverableName'].setValue('');
      this.CDForm.controls['DeliverableValue'].setValue('');
      this.CDForm.controls['DeliverableValueText'].setValue('');
      this.CDForm.controls['ContractDoc_OwnerNM'].setValue('');
      this.CDForm.controls['ContractDoc_Owneremail'].setValue('');
}

}




