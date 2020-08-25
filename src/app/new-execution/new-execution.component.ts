import { NewExecutionService } from './service/new-execution.service';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, Input , ViewChild, ViewEncapsulation} from '@angular/core';

import { HttpErrorResponse } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NavtntService } from '../navtnt.service';
import { TransitionProfileService } from '../transition-profile/Service/transition-profile.service';




export interface NewExecution {
  // MatPaginator Output
  pageEvent: PageEvent;
  highlighted?: boolean;
  hovered?: boolean;
}

@Component({
  selector: 'app-new-execution',
  templateUrl: './new-execution.component.html',
  styleUrls: ['./new-execution.component.css'],

  // encapsulation: ViewEncapsulation.Native,

})
export class NewExecutionComponent implements OnInit {
  NewExecutionForm: FormGroup;

  position = new FormControl('above');
  displayedColumns: string[] = ['ClientName', 'Sector', 'Industry', 'SiebelNo', 'OwningTTS', 'SolMonth', 'Solyear', 'AMSTCV'];
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;

  private SolOwnTTS = [];
  // SolOwnTTS:any;
  SolSector: any;
  IndCom: any;
  IndDis: any;
  IndFSS: any;
  IndInd: any;
  IndPub: any;
  SolYear: any;
  Industry: any;
  EngProfileData: any;
 CreateFalg: any;



  selectedSolOWnTTS: string;
  selectedSolSector: string;
  selectedSolIndustry: string;
  selectedSolYear: string;
  selectedSolSieNo: string;
  transProfile: any;
  FlagNew: string;
  USER_ORG: any;
  constructor(private _Ser: NewExecutionService,
    private _Ser1:TransitionProfileService,
    private fb: FormBuilder,
    private route: Router,
    private navigation: NavtntService,
    private toaster: ToastrService) {

     this.NewExecutionForm = this.fb.group({
      selectedSolOWnTTS: [''],
      selectedSolSector: [''],
      Industry: [''],
      selectedSolYear: [''],
      selectedSolSieNo: [''],
      AccountName: [''],
     });
    this.dataLength = 0;
    this.selectedRow = 0;
    this.dataLength = 0;

  }

  onSubmit( ) {
    // console.log(event)

  }

  ngOnInit() {
    this.FlagNew = 'No';
    this.CreateFalg = 'No' ;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    return forkJoin([this._Ser.getOwnTTSKeywordResult(),
                    this._Ser.getSectorKeywordResult(),
                    this._Ser.getSolYearKeywordResult()])
      .subscribe(res => {
        // this.SolOwnTTS = res[0];   
        this.USER_ORG = JSON.parse(sessionStorage.getItem('USER_TRAN_ORG'));
        this.SolOwnTTS.push(decodeURIComponent(this.USER_ORG._value));
        const str = this.SolOwnTTS.join('\n').split(',');
        this.SolOwnTTS = str;     
        this.SolSector = res[1];
        this.SolYear = res[2];

          }, (err: HttpErrorResponse) => {
       if (err.error instanceof Error) {
         console.log('Client Sider Error.');
       } else {console.log('Server Sider Error.');
     }
     });
     this.valuechange();
  }

  public ResetMe(){

    let NewExeArr = ['selectedSolOWnTTS', 
    'selectedSolSector', 
    'Industry', 
    'selectedSolYear', 
    'selectedSolSieNo', 
    'AccountName'];

    for( let i=0; i< NewExeArr.length; i++){
      this.NewExecutionForm.controls[NewExeArr[i]].setValue('');
    } 

  } 

  public clickMe(): any {
    this.selectedRow = 0;
    let obj: any;

    if (((this.NewExecutionForm.controls['selectedSolOWnTTS'].value === '') || (this.NewExecutionForm.controls['selectedSolOWnTTS'].value === undefined )) &&

    ((this.NewExecutionForm.controls['selectedSolSector'].value === '') || (this.NewExecutionForm.controls['selectedSolSector'].value === undefined )) &&
    ((this.NewExecutionForm.controls['Industry'].value === '') || (this.NewExecutionForm.controls['Industry'].value === undefined )) &&
    ((this.NewExecutionForm.controls['selectedSolYear'].value === '') || (this.NewExecutionForm.controls['selectedSolYear'].value === undefined )) &&
    ((this.NewExecutionForm.controls['selectedSolSieNo'].value === '') || (this.NewExecutionForm.controls['selectedSolSieNo'].value === undefined )) &&
    ((this.NewExecutionForm.controls['AccountName'].value === '') || (this.NewExecutionForm.controls['AccountName'].value === undefined ))) {
      this.toaster.warning('Please select any of the criteria and click on the search');
      return false;
    }

    obj = {
    'Account_Name': this.NewExecutionForm.controls['AccountName'].value,
    'OwningTTS': this.NewExecutionForm.controls['selectedSolOWnTTS'].value,
    'Sector': this.NewExecutionForm.controls['selectedSolSector'].value,
    'Industry': this.NewExecutionForm.controls['Industry'].value,
    'Solyear': this.NewExecutionForm.controls['selectedSolYear'].value,
    'SiebelNo': this.NewExecutionForm.controls['selectedSolSieNo'].value };

this._Ser.getEngProfileDataResult(obj).subscribe(res => {

          this.FlagNew = 'Yes';
          this.dataSource.data = res;
          this.dataLength = res.length;
          this.dataLength = this.dataSource.data.length;
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
       console.log('Client side error.') ;
      } else {console.log('Server side error.') ; }

    });
}

  
  valuechange(){
    this._Ser1.getIndustry(this.NewExecutionForm.controls['selectedSolSector'].value).subscribe(res => {
      this.Industry=res;
    }); 
    this.FlagNew = 'No';
    this.dataSource.data = [];
    this.dataLength = 0;
  
  }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }


    setClickedRow(index: number): void {

        if (index === this.selectedRow) {
          this.selectedRow = 0;
          this.CreateFalg = 'No';
         } else {
          this.selectedRow = index;
          this.CreateFalg = 'Yes';
         }
   }


   CreateTransition() {

    this._Ser.TranVal = this.selectedRow;

    const sourceComponentPath = '/transition-Main';
  const destinationComponentPath = '/transition-Main';
  const destinationComponentParameterArray = [{ id: 'Id', param: this._Ser.TranVal.IntegrationID },
                                            { id: 'ClientName', param: this._Ser.TranVal.ClientName },
                                            { id: 'Sector', param: this._Ser.TranVal.Sector },
                                            { id: 'Industry', param: this._Ser.TranVal.Industry },
                                            {id: 'SaveFlag', param: 'Save'},
                                            { id: 'ViewFlag', param: 'No'}   ];

    let obj: any;
    obj = {'IntegrationID': this._Ser.TranVal.IntegrationID };

    this._Ser.getDuplicateTransProfile(obj).subscribe(res => {

      this.transProfile = res;
       if (this.transProfile.length > 0) {
       this.toaster.info('Transition profile already exist for ' + this._Ser.TranVal.ClientName + ' account.');
       return false;
      } else if ( this._Ser.TranVal.ClientName === undefined || this._Ser.TranVal.ClientName === '') {
            if (confirm('No Solution record selected. Do you want to create new Transition Record without a Solution record?')) {
//              this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
var transitionOrg = this._Ser.TranVal.Geo;  // Owning organization
this.navigation.enterNewTransition(sourceComponentPath, 
                            destinationComponentPath,
                            this._Ser.TranVal.IntegrationID,
                            transitionOrg,
                            destinationComponentParameterArray  ); 

            } else {
              return false;
            }
      } else {
        if (confirm('Do you want to create new Transition Record for ' + this._Ser.TranVal.ClientName + '?')) {
      //    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
      var transitionOrg = this._Ser.TranVal.Transition_org; 
      this.navigation.enterNewTransition(sourceComponentPath, 
                                  destinationComponentPath,
                                  this._Ser.TranVal.IntegrationID,
                                  transitionOrg,
                                  destinationComponentParameterArray  ); 


        } else {
          return false;
        }
      }
      }, (err: HttpErrorResponse) => {
    if (err.error instanceof Error) {
     console.log('Client side error.') ;
    } else {console.log('Server side error.') ; }

  });
}



HideOtherV() {
   this.FlagNew = 'No';
   this.dataSource.data = [];
   this.dataLength = 0;
}
Keyup() {
  this.FlagNew = 'No';
  this.dataSource.data = [];
  this.dataLength = 0;
}
}
