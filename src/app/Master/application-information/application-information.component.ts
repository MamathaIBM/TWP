import { environment } from 'src/environments/environment';
import { NavtntService } from './../../navtnt.service';
import { ApplicationInfo } from './class/AppInfo.model';
// import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ApplicationInformationService } from './application-information/application-information.service';
import { Component, inject, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';
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
import * as XLSX from 'xlsx';
import { TraineeService } from '../trainee/trainee/trainee.service';

@Component({
  selector: 'app-application-information',
  templateUrl: './application-information.component.html',
  styleUrls: ['./application-information.component.css']
})
export class ApplicationInformationComponent implements OnInit, OnDestroy {

  editFlag: number; // check whether user is going for edit or new row add
  deleteFlag: number; // check the delete subscription used or not
  // tslint:disable-next-line:max-line-length
 // displayedColumns: string[] = ['AppId', 'AppName', 'Complexity', 'Criticality', 'Technology' , 'Vendor', 'appCategory' , 'appParameter', 'appValue', 'appType','Delete'];
 displayedColumns: string[] = ['AppId', 'AppName', 'appApplicationType', 'AppSizeParameter', 'AppSizeValue', 'Complexity', 'Criticality', 'appCategory', 'Technology' , 'Vendor', 'AppServiceAgreement', 'AppRemarks', 'AppDescription', 'Delete']; 
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('file') InputField: ElementRef;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  ApplInfoUpdateeForm: FormGroup;
  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private deleteSubscription: Subscription;
  private duplicateSubscription: Subscription;
  private savedFlag = false;
  private complexityDatasource: any;
  private criticalityDatasource: any;
  private technologyDatasource: any;
  private vendorDatasource: any;
  private appCategoryDatasource: any;
  private IntegrationID: string;
  private createdBy: string;
  private modifiedBy: string;
  LocalappInfo = [];
  FlagHide: any;
  username: any;
  boolan: boolean;
  boolanV: boolean;
  appSizeParameterDatasource: any;
  appFunctionalDatasource: any;
  appvalueDatasource: any;
  SizeValue: any;
  file: any;
  disableBtn: any;
  stndardactivityactivities = '';
  Userlist = [];
  baseURL = environment.baseUrl;
//  private applinfo :any= [];

colwidth: any = [
  { wpx: 120 },
  { wpx: 150 },
  { wpx: 120 },
  { wpx: 120 },
  { wpx: 120 },
  { wpx: 120 },
  { wpx: 120 },
  { wpx: 120 },
  { wpx: 120 },
  { wpx: 120 },
  { wpx: 120 },
  { wpx: 120 },
  { wpx: 120 }
];


Instruction: any = [
{
'Column Name': 'AppId',
'Format': 'Application ID',
'Example': 'App1234'
},
{
'Column Name': 'AppName',
'Format': 'Application Name',
'Example': 'UBC'
},
{
'Column Name': 'Technology',
'Format': 'DotNet, JAVA, Oracle, SAP,Other',
'Example': 'SAP'
},
{
'Column Name': 'OtherTechonology',
'Format': 'If Technology="Other"',
'Example': 'Other Techonology'
},
{
'Column Name': 'Complexity',
'Format': '"High" or "Medium" or "Low"',
'Example': 'High'
},
{
'Column Name': 'Criticality',
'Format': '"High" or "Medium" or "Low"',
'Example': 'Low'
},
{
'Column Name': 'Vendor',
'Format': '"Cognizant" or "TCS" or "Infosys" or "Other"',
'Example': 'Cognizant'
},
{
  'Column Name': 'OtherVendor',
  'Format': 'If Vendor= "Other"',
  'Example': 'Other Vendor Name'
  },
  {
    'Column Name': 'appCategory',
    'Format': '"Bronze" or "Silver" or "Gold"',
    'Example': 'Gold'
    },
    {
      'Column Name': 'appSizeParameter',
      'Format': '"Line of Code" or "Function Point"',
      'Example': 'Line of Code'
      },
      {
        'Column Name': 'appSizeValue',
        'Format': '"NA" or "< 100" or "101 to 500 FPs" or "501 to 1500 FPs" or "> 4000 FPs" or "1501 to 4000 FPs"',
        'Example': '< 100'
        },
        {
          'Column Name': 'appApplicationType',
          'Format': '"Fixed Price" or "Time & Material" or "Mix"',
          'Example': 'Fixed Price'
          },
          {
            'Column Name': 'AppDescription',
            'Format': 'Application Description',
            'Example': 'Application Description'
            }
];

Heareds: any = [{ AppId: '',
AppName: '',
Technology: '',
OtherTechonology: '',
Complexity: '',
Criticality: '',
Vendor: '',
OtherVendor: '',
appCategory: '',
appSizeParameter: '',
appSizeValue: '',
appApplicationType: '',
AppDescription: ''}];

  appAppTypeDatasource: any;
  appBooleankeyword: any;
  Excel_Falg: any;
  displayedColumnsExcel: string[] = ['AppId', 'AppName', 'appApplicationType', 'AppSizeParameter', 'AppSizeValue', 'Complexity', 'Criticality', 'appCategory', 'Technology', 'OtherTechonology', 'Vendor', 'OtherVendor', 'AppServiceAgreement', 'AppRemark', 'AppDescription'];
  R: any;
  urlopen: any;
  progress: number;
  existAppName: any;
 
  constructor(
              private _service: ApplicationInformationService ,
              private _TraineeSer: TraineeService,
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

                this.ApplInfoUpdateeForm =  this.fb.group ({
                  AppUNID: [''],
                  AppId: [''],
                  AppName: [''],
                  Complexity: [''] ,
                  Criticality: [''],
                  Technology: [''],
                  OtherTechonology: [''],
                  Vendor: [''],
                  OtherVendor: [''],
                  appCategory: [''] ,
                  IntegrationID: [''],
                  createdBy: [''],
                  modifiedBy: [''],
                  date: [''],
                  appSizeParameter: [''],
                  appSizeValue: [''],
                  appApplicationType: [''],
                  AppDescription: [''],
                  AppServiceAgreement: [''],
                  AppRemark: ['']
                })   ;

  }

  ngOnInit() {
    this.boolan = true;
    this.boolanV = true;
    this.progress = 0;
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);
       
    this.ApplInfoUpdateeForm.controls['createdBy'].setValue(this.username);
    this.ApplInfoUpdateeForm.controls['modifiedBy'].setValue(this.username);
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

          this.ApplInfoUpdateeForm.controls['IntegrationID'].setValue(this.IntegrationID);
      }
      this.ApplInfoUpdateeForm.controls['IntegrationID'].setValue(this.IntegrationID);
    });

         }

loadData() {
  this.ApplInfoUpdateeForm.controls['IntegrationID'].setValue(this.IntegrationID);
  this._service.getApplnInfo1(this.IntegrationID)
  .subscribe(res => {
    this.LocalappInfo = res;
    this.dataSource.data = this.LocalappInfo;
    this.dataLength = this.LocalappInfo.length;
    this.dataLength = this.dataSource.data.length;
  },
  error => console.log(error),
  () => {
    // this.LocalappInfo = this.LocalappInfo;
  } );


  this.loadparamsSubscription  = forkJoin ([
    // this._service.getApplnInfo(this.IntegrationID),
    this._service.getComplexity(),
    this._service.getCriticality(),
    this._service.getTechnology(),
    this._service.getVendor(),
    this._service.getapp_Category(),
    this._service.getappSize(),
    this._service.getappFunctionsValue(),
    this._service.getappLinesValue(),
    this._service.getApplicationTypeValue(),
    this._service.getBooleanKeyword()
  ] ).subscribe(res => {
          this.complexityDatasource = res[0];
          this.criticalityDatasource = res[1];
          this.technologyDatasource = res[2];
          this.vendorDatasource = res[3];
          this.appCategoryDatasource = res[4];
          this.appSizeParameterDatasource = res[5];
          this.appFunctionalDatasource = res[6];
          this.appvalueDatasource = res[7];
          this.appAppTypeDatasource = res[8];
          this.appBooleankeyword = res[9];

  }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
              console.log('Client Sider Error.');
            } else {
              console.log('Server Sider Error.');
          }


  });

   }
  //  exportAsXLSX(): void {
  //   this._service.exportAsExcelFile(this.Heareds, this.Instruction, this.colwidth, 'sample');
  // }

  incrementSpinner() {
    this.progress = 1;
    setTimeout(() => {
        if (this.progress < 100) {
            for (var i = this.progress; i <= 100; i++) {
                this.progress += 1;
            }
        }
    }, 3000)
  }

  exportAsXLSX() {   
    let obj: any;
    obj = {'username':  this.ApplInfoUpdateeForm.controls['createdBy'].value };
    console.log("this.username"+obj.username)    

    this._service.getAppInfoexecelfile(obj.username);
   window.open(this.baseURL +'/getexcelAppInfo');
    // this._Ser.exportAsXLSX();
    // window.open('https://localhost:3000/CreateExcel');
    // window.open(location.origin.split(':')[0]+':'+location.origin.split(':')[1]+':3000/CreateExcel');
  }  

  fileChanged(e) {
        this.file = e.target.files[0];
    this.upload();
     }
  upload() {
        if ((this.file.name).split('.')[1] === 'csv') {
      } else {
        this.toastr.warning('Sorry, ' + this.file.name + ' is invalid, allowed extensions is csv only');
           this.file = null;
        this.InputField.nativeElement.value = null;
        return false;
      }
       const fileReader = new FileReader();
       fileReader.onload = (e: any) => {
       /* read workbook */
       const bstr: string = e.target.result;
       const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary', cellDates: true, dateNF: 'mm/dd/yyyy;@'});
       /* grab first sheet */
       const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];       
        this.Excel_Falg  = 'No';     
        this.R = 0;
          for ( let col = 0 ; col < 15 ; col++ ) {
              const cell = ws[XLSX.utils.encode_cell({c: col, r: this.R})];
              if ((this.displayedColumnsExcel.includes(cell.v) === false) && this.Excel_Falg === 'No') {                  
                  this.Excel_Falg = 'Yes';
              }
          }        
       if (this.Excel_Falg === 'Yes') {     
          this.file = null;
          this.InputField.nativeElement.value = null;    
        alert('Please select the .csv file with headers mentioned in the sample template and headings should start from 2nd Row');
        return false;
         }
    this.Userlist = XLSX.utils.sheet_to_json(ws, {raw: true});
    if(this.Userlist[0].Trainee_Name === "Please validate the data"){
      this.Userlist.splice( 0, 1 );
     }
    this.Userlist.push({'App_IntegrationID' : this.IntegrationID , 'CREATED_BY' : this.username, 'LAST_UPDATED_BY' : this.username});
     this.stndardactivityactivities = JSON.parse(JSON.stringify(this.Userlist)) ;
     if(this.stndardactivityactivities.length > 201){
      alert('Max.Limit for Application Information import will be upto 200 Applications.');
      return false;
     }
     this.incrementSpinner();
     setTimeout(() => {        
        this._service.UploadApplicationinfo(this.stndardactivityactivities).subscribe(res => {
        if (res.insert === 'success') {
          if (this.progress > 100) {
            this.progress = 0;
            this.loadData();
            this.toastr.success('Application Info have uploaded successfully.', 'Application Information');
          }          
        } else {  
          if (this.progress > 100) {
            this.progress = 0; 
            this._service.ViewAppUploadexecelfile(this.username);
            window.open(this.baseURL +'/ViewUploadeAppInfo/'+this.username); 
             alert('Application Info csv file has Improper Data to upload, Please check & reload again.'); 
            //this.toastr.error('Application Info csv file has Improper Data to upload, Please check & reload again', 'Application Information');   
           }
        }     
        });
        }, 8000)
       };
    fileReader.readAsBinaryString(this.file);
    this.file = null;
    this.InputField.nativeElement.value = null;
    this.disableBtn = true;
    }
  applyFilter(filterValue: string) {
          this.dataSource.filter   = filterValue.trim().toLowerCase();
    }

    onKey() {
      this.ApplInfoUpdateeForm.controls['appSizeValue'].setValue('');
      this.SizeValue = [{"Categoryvalues": ''}]
      if (this.ApplInfoUpdateeForm.controls['appSizeParameter'].value === 'Lines of code') {
         this.SizeValue = this.appvalueDatasource;
        } else if (this.ApplInfoUpdateeForm.controls['appSizeParameter'].value === 'Function Points') {
         this.SizeValue = this.appFunctionalDatasource;
         console.log(this.SizeValue )
        }else{
          this.SizeValue = [{"Categoryvalues": 'Not Available'}]
        }
        }

setClickedRow(index: number, rowdata: any): void {
  if(index === 0){
    this.selectedRow = 0;
    this.boolan = true;
    this.boolanV = true;
    this.editFlag = 0;
    this.resetFields();
  }else {
              if (index === this.selectedRow) {
                this.selectedRow = 0;
                this.boolan = true;
                this.boolanV = true;
                this.editFlag = 0;
                this.resetFields();
               } else {
                this.selectedRow = index;                
                this.ApplInfoUpdateeForm.controls['IntegrationID'].setValue(rowdata.IntegrationID);
                this.ApplInfoUpdateeForm.controls['AppUNID'].setValue(rowdata.AppUNID);
                this.ApplInfoUpdateeForm.controls['AppId'].setValue(rowdata.AppId);
                this.ApplInfoUpdateeForm.controls['AppName'].setValue(rowdata.AppName);
                this.existAppName = this.ApplInfoUpdateeForm.controls['AppName'].value;
                this.ApplInfoUpdateeForm.controls['Complexity'].setValue(rowdata.Complexity);
                this.ApplInfoUpdateeForm.controls['Criticality'].setValue(rowdata.Criticality);
                this.ApplInfoUpdateeForm.controls['Technology'].setValue(rowdata.Technology.split(','));
                if (rowdata.OtherTechonology !== '') {
                  this.boolan = false;
                } else {
                  this.boolan = true;
                }
                this.ApplInfoUpdateeForm.controls['OtherTechonology'].setValue(rowdata.OtherTechonology);
                this.ApplInfoUpdateeForm.controls['Vendor'].setValue(rowdata.Vendor);
                if (rowdata.OtherVendor !== '') {
                  this.boolanV = false;
                } else {
                  this.boolanV = true;
                }
                this.ApplInfoUpdateeForm.controls['OtherVendor'].setValue(rowdata.OtherVendor);
                this.ApplInfoUpdateeForm.controls['appCategory'].setValue(rowdata.appCategory);
                this.ApplInfoUpdateeForm.controls['appSizeParameter'].setValue(rowdata.AppSizeParameter);
                this.onKey();
                this.ApplInfoUpdateeForm.controls['appSizeParameter'].setValue(rowdata.AppSizeParameter);
                this.ApplInfoUpdateeForm.controls['appSizeValue'].setValue(rowdata.AppSizeValue);
                this.ApplInfoUpdateeForm.controls['AppDescription'].setValue(rowdata.AppDescription);
                this.ApplInfoUpdateeForm.controls['appApplicationType'].setValue(rowdata.appApplicationType);
                this.ApplInfoUpdateeForm.controls['AppServiceAgreement'].setValue(rowdata.AppServiceAgreement);
                this.ApplInfoUpdateeForm.controls['AppRemark'].setValue(rowdata.AppRemark);
              
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

HideOtherT(value) {
  const string: any = this.ApplInfoUpdateeForm.controls['Technology'].value;

  if (string.indexOf('Other') < 0 ) {
  this.boolan = true;
  this.ApplInfoUpdateeForm.controls['OtherTechonology'].setValue('');
  } else {
    this.boolan = false;
    }

  }

  HideOtherV(value) {
    const string: any = this.ApplInfoUpdateeForm.controls['Vendor'].value;

    if (string.indexOf('Other') < 0 ) {
    this.boolanV = true;
    this.ApplInfoUpdateeForm.controls['OtherVendor'].setValue('');
    } else {
      this.boolanV = false;
      }

    }

resetFields() {
  this.ApplInfoUpdateeForm.controls['AppId'].setValue('');
  this.ApplInfoUpdateeForm.controls['AppName'].setValue('');
  this.ApplInfoUpdateeForm.controls['Complexity'].setValue('');
  this.ApplInfoUpdateeForm.controls['Criticality'].setValue('');
  this.ApplInfoUpdateeForm.controls['Technology'].setValue('');
  this.ApplInfoUpdateeForm.controls['OtherTechonology'].setValue('');
  this.ApplInfoUpdateeForm.controls['Vendor'].setValue('');
  this.ApplInfoUpdateeForm.controls['OtherVendor'].setValue('');
  this.ApplInfoUpdateeForm.controls['appCategory'].setValue('');
  this.ApplInfoUpdateeForm.controls['appSizeParameter'].setValue('');
  this.ApplInfoUpdateeForm.controls['appSizeParameter'].setValue('');
  this.ApplInfoUpdateeForm.controls['appSizeValue'].setValue('');
  this.ApplInfoUpdateeForm.controls['AppDescription'].setValue('');
  this.ApplInfoUpdateeForm.controls['appApplicationType'].setValue('');
  this.ApplInfoUpdateeForm.controls['AppServiceAgreement'].setValue('');
  this.ApplInfoUpdateeForm.controls['AppRemark'].setValue('');
  }

onSubmit() {

  //    this.saveFunctionality();
}

Update() {

  if(this.ApplInfoUpdateeForm.controls['AppName'].value.trim().length === 0){
    this.toastr.warning('Application Name should not be blank.','Application Information')
    return false;
  }

  this.ApplInfoUpdateeForm.controls['modifiedBy'].setValue(this.username);
  this.ApplInfoUpdateeForm.controls['AppName'].setValue(this.ApplInfoUpdateeForm.controls['AppName'].value.trim());

  if(this.existAppName.toUpperCase().trim() === this.ApplInfoUpdateeForm.controls['AppName'].value.toUpperCase().trim()){
    this.saveSubscription =  this._service.putApplnInfo (this.ApplInfoUpdateeForm.value ).subscribe(res => {
      if (res.insert === 'success') {
        this.toastr.success('Updated Succcessfully', 'Application Information');
        this.loadData();
       } else {
        this.toastr.error('Update Fail', 'Application Information');
       }
       this.savedFlag = true;
       this.editFlag = 0;
       this.resetFields();
      }, (errputApplnInfo: HttpErrorResponse) => {
        if (errputApplnInfo.error instanceof Error ) {
          console.log('Client Side Error.');
          this.toastr.error('Client side update Error', 'ttstoolssupport@in.ibm.com');
        } else {
          this.toastr.error('Server side update Error', 'ttstoolssupport@in.ibm.com');
          console.log('Server Sider Error.');
      }
      });
  }else{

  this._service.getDuplicateAppInfoResult(this.ApplInfoUpdateeForm.value).subscribe(dupres => {   
    if (dupres.length < 1) {
      this.saveSubscription =  this._service.putApplnInfo (this.ApplInfoUpdateeForm.value ).subscribe(res => {
      if (res.insert === 'success') {
        this.toastr.success('Updated Succcessfully', 'Application Information');
        this.loadData();
       } else {
        this.toastr.error('Update Fail', 'Application Information');
       }
       this.savedFlag = true;
       this.editFlag = 0;
       this.resetFields();
      });
    }else {
      this.toastr.info('Duplicate Application Name exists');
    }
    }, (errputApplnInfo: HttpErrorResponse) => {
      if (errputApplnInfo.error instanceof Error ) {
        console.log('Client Side Error.');
        this.toastr.error('Client side update Error', 'ttstoolssupport@in.ibm.com');
      } else {
        this.toastr.error('Server side update Error', 'ttstoolssupport@in.ibm.com');
        console.log('Server Sider Error.');
    }
  });
 }
}

Add() {

  if(this.ApplInfoUpdateeForm.controls['AppName'].value.trim().length === 0){
    this.toastr.warning('Application Name should not be blank.','Application Information')
    return false;
  }

  this.ApplInfoUpdateeForm.controls['createdBy'].setValue(this.username);
  this.ApplInfoUpdateeForm.controls['modifiedBy'].setValue(this.username);
  this.ApplInfoUpdateeForm.controls['IntegrationID'].setValue(this.IntegrationID);
  this.ApplInfoUpdateeForm.controls['AppName'].setValue(this.ApplInfoUpdateeForm.controls['AppName'].value.trim());

  this._service.getDuplicateAppInfoResult(this.ApplInfoUpdateeForm.value).subscribe(dupres => {   
    if (dupres.length === 0) {
      this.saveSubscription = this._service.postApplnInfo(this.ApplInfoUpdateeForm.value).subscribe(res => {
      this.LocalappInfo = res;      
       if (res.save === 'success') {   
        this.loadData();
        this.savedFlag = true; 
        this.resetFields();       
        this.toastr.success('Record Added Succcessfully', 'Application Information');    
      } else {
        this.toastr.error('Record Add Fail', 'Application Information');
      }        
     }); 
  }else {
    this.toastr.info('Duplicate Application Name exists');
  }
}, (errpostApplnInfo: HttpErrorResponse) => {
  if (errpostApplnInfo.error instanceof Error ) {
    console.log('Client Side Error.');
    this.toastr.error('Client side update Error', 'ttstoolssupport@in.ibm.com');
  } else {
    this.toastr.error('Server side update Error', 'ttstoolssupport@in.ibm.com');
    console.log('Server Sider Error.');
}   
});
}

Clone(){
  this.editFlag = 0;
  this.selectedRow=0;
}



// saveFunctionality(){

// console.log(this.ApplInfoUpdateeForm.value)
//  if( this.editFlag === 0) {
//           console.log("save")
//          this.saveSubscription=  this._service.postApplnInfo(this.ApplInfoUpdateeForm.value).subscribe(res=>{
//          console.log(res);
//          this.loadData();
//          this.savedFlag = true;
//       })
//   }else{
//     console.log("update")
//     console.log(this.ApplInfoUpdateeForm.value)
//        this.saveSubscription=  this._service.putApplnInfo (this.ApplInfoUpdateeForm.value ).subscribe(res=>{
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
      this.deleteSubscription =  this._service.deleteApplnInfo(obj.AppUNID).subscribe(res => {
        if (res.Delete === 'success') {
          this.toastr.success('Deleted Succcessfully', 'Application Information');
          this.loadData();
        } else if (res.Delete === 'Fail') {
          this.toastr.error('Delete Fail', 'Application Information');
         } else {
          window.alert(res.Delete.join('\n'));
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
    //this.toastr.info('Deleted Cancelled.', 'Application Info');
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

