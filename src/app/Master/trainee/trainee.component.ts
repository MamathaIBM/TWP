import { environment } from 'src/environments/environment'; 
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit, Input , ViewChild, ViewEncapsulation, ElementRef} from '@angular/core';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
// tslint:disable-next-line:import-blacklist
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { UserNameService } from 'Services/user-name.service';
import { NavtntService } from './../../navtnt.service';
import { TraineeService } from './trainee/trainee.service';
import * as XLSX from 'xlsx';
import { validateConfig } from '@angular/router/src/config';

export interface ContDeliverables {
  // MatPaginator Output
  pageEvent: PageEvent;

}

@Component({
  selector: 'app-trainee',
  templateUrl: './trainee.component.html',
  styleUrls: ['./trainee.component.css']
})
export class TraineeComponent implements OnInit {
  traineeForm: FormGroup;
  editFlag: number;
  dataLength: number;
  selectedRow: number;
  
  displayedColumns: string[] = ['Trainee_Name', 'Trainee_email', 'Trainee_Role', 'Trainee_OnBoardDate', 'Trainee_Travel', 'Trainee_Skills', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('Trainee_Name') nameField: ElementRef;
  @ViewChild('file') InputField: ElementRef;
    dataSource = new MatTableDataSource<any>();
    baseURL = environment.baseUrl
  private saveSubscription: Subscription;
  private UpdateSubscription: Subscription;
  private deleteSubscription: Subscription;
  username: any;

  FlagHide: string;
  CreateFalg: string;
  TrNames: any;
  TrRoles: any;
  Trtravel: any;
  TrSkills: any;
  deleteFlag: number;
  boolan: boolean;
  count: number;
  Employee_Name = [];
  Employee_Email: any = [];
  jemplyee: any;
  employeeDir: any = [];
   myJSON = '';
   emailcheck: any;
   Trainee_Name = '';
  photo: string;
  Empnamecheck: any;
  file: any;
  disableBtn: any;
  stndardactivityactivities = '';
  Userlist = [];
  TrRolesarray = [];
  ResultTrRolesarray = [];
  TraineeMessage = [];
  TrBoolansarray = [];
  ResultTrBoolansarray = [];
  ResultTrSkillsarray = [];
  TrSkillsarray = [];
  values = [];
  Msgbox: string;
  TraineeCount: number;
  colwidth: any = [
      { wpx: 120 },
      { wpx: 150 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 120 },
      { wpx: 120 },
    ];

    // colwidth1 : any = [
    //   { wpx: 150 },
    //   { wpx: 300 },
    //   { wpx: 150 },
    // ]

  Instruction: any = [
  {
    'Column Name': 'Trainee_Name',
    'Format': 'Trainee First & Last Name',
    'Example': 'TTSTools Support'
  },
  {
    'Column Name': 'Trainee_email',
    'Format': 'Trainee intranet ID',
    'Example': 'ttstoolssupport@in.ibm.com'
  },
  {
    'Column Name': 'Trainee_Role',
    'Format': 'Trainee Role',
    'Example': 'Developer'
  },
  {
    'Column Name': 'Trainee_OnBoardDate',
    'Format': 'Date should be in "mm-dd-yyyy"',
    'Example': '02-20-2019'
  },
  {
    'Column Name': 'Trainee_Travel',
    'Format': '"Yes" or "No"',
    'Example': 'Yes'
  },
  {
    'Column Name': 'Trainee_Skills',
    'Format': 'Trainee Techical Skills',
    'Example': 'SAP, JAVA'
  },
  {
    'Column Name': 'Trainee_Visa',
    'Format': 'If Trainee_Travel= "Yes" then Trainee_Visa ="Yes" or "No"',
    'Example': 'Yes'
  }
];

  Heareds: any = [{ Trainee_Name: '',
  Trainee_email : '',
  Trainee_Role: '',
  Trainee_OnBoardDate: '',
  Trainee_Travel: '',
  Trainee_Skills: '',
  Trainee_Visa: ''}];
  trintranetID: any;
  importfile: any;
  importpath: any;
  progress: number;

    constructor(private _Ser: TraineeService,
    private fb: FormBuilder,
    private route: Router,
    private _UserSer: UserNameService,
    private activatedRoute: ActivatedRoute,
    private navigation: NavtntService,
    private toaster: ToastrService) {
      this.traineeForm =  this.fb.group ({
        Trainee_IntegrationID: [''],
        CREATED_BY: [''],
        LAST_UPDATED_BY: [''],
        Trainee_SNO: [''],
        Trainee_Name: ['' , Validators.required],
        Trainee_email: [''],
        Trainee_Role: ['', Validators.required],
        Trainee_OnBoardDate: ['', Validators.required],
        Trainee_Travel: ['', Validators.required],
        Trainee_Skills: ['', Validators.required],
        Trainee_Visa: ['', [Validators.required]]
             });
      this.editFlag = 0;
      this.dataLength = 0;
      this.selectedRow = 0;
      this.dataLength = 0;
      // this.duplvariable = 0;
     }

  ngOnInit() {
    this.boolan = true;
    this.disableBtn = true;
    this.progress = 0;
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
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loadData();
    // this.CDForm.controls['IntegrationID'].setValue(this._SerTransisiton.IntegrationID);
     return forkJoin([this._Ser.TraineeNameKeywordResult(),
                    this._Ser.TraineeRoleKeywordResult(),
                    this._Ser.TraineeTravelKeywordResult(),
                    this._Ser.TraineeSkillsKeywordResult(),
          ])
      .subscribe(res => {
         this.TrNames = res[0];
        this.TrRoles = res[1];
        this.Trtravel = res[2];
        this.TrSkills = res[3];
          }, (err: HttpErrorResponse) => {
       if (err.error instanceof Error) {
         console.log('Client Sider Error.');
       } else {console.log('Server Sider Error.');
     }
     });
  }
  onSubmit() {
    }
  loadData() {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res.filter) {
              //  this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id');
        this.traineeForm.controls['Trainee_IntegrationID'].setValue(this.navigation.getParameterValue(res.filter, 'Id'));
        let obj: any;
         obj = {'Trainee_IntegrationID': this.traineeForm.controls['Trainee_IntegrationID'].value };

        // tslint:disable-next-line:no-shadowed-variable
        this._Ser.TraineeDataResult(obj.Trainee_IntegrationID).subscribe(res => {

            this.dataSource.data = res;
        //    this.dataLength = res.length;
            this.dataLength = this.dataSource.data.length;
      }, (errTraineeDataResult: HttpErrorResponse) => {
             if (errTraineeDataResult.error instanceof Error) {
               console.log('Client Sider Error.');
             } else {
               console.log('Server Sider Error.');
           }

           });
          }
        });
      }

      // exportAsXLSX(): void {
      //   this._Ser.exportAsExcelFile(this.colwidth, 'sample');
      // }
      // exportAsXLSX() {
      //   this._Ser.exportAsXLSX().subscribe(res => {
      //     console.log(res);
      //     if (res.Success === 'success') {
      //       console.log('into loop');
      //     window.open(res.URL);
      //     }
      //   });
      // }
      exportAsXLSX() {  
        this.traineeForm.controls['LAST_UPDATED_BY'].setValue(this.username)
        this._Ser.getexecelfile(this.traineeForm.controls['LAST_UPDATED_BY'].value);
       window.open(this.baseURL+'/getexcelTrainee');
        // this._Ser.exportAsXLSX();
        // window.open('https://localhost:3000/CreateExcel');
        // window.open(location.origin.split(':')[0]+':'+location.origin.split(':')[1]+':3000/CreateExcel');
      }  
  applyFilter(filterValue: string) {
     this.dataSource.filter = filterValue.trim().toLowerCase();
  }

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

valuechange(TName: string) {

  this.traineeForm.controls['Trainee_email'].setValue('');
  this.myJSON = null;

}
getEmail(TraineeName: string) {
    this.traineeForm.controls['Trainee_email'].setValue(TraineeName);
}

getEmployeeName(Name: string) {

  this.Employee_Name = [];
  this._Ser.getEmployeeDirectory(Name).subscribe(res => {

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
           this.Employee_Name.push(item);
    }
     this.myJSON = JSON.parse(JSON.stringify(this.Employee_Name));
  this.nameField.nativeElement.focus();
});
}

fileChanged(e) {
  this.disableBtn = false;
  this.file = e.target.files[0];
  this.importfile = this.InputField.nativeElement.value;
  this.upload();
   }

upload() { 
        if ((this.file.name).split('.')[1] === 'csv') {
    } else {
      this.toaster.warning('Sorry, ' + this.file.name + ' is invalid, allowed extensions is csv only');
      this.disableBtn = true;
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
     if ((ws['A1'].v !== 'Trainee_Name') ||
        (ws['B1'].v !== 'Trainee_email') ||
        (ws['C1'].v !== 'Trainee_Role') ||
        (ws['D1'].v !== 'Trainee_OnBoardDate') ||
        (ws['E1'].v !== 'Trainee_Travel') ||
        (ws['F1'].v !== 'Trainee_Skills') ||
        (ws['G1'].v !== 'Trainee_Visa')) {
        this.file = null;
      this.InputField.nativeElement.value = null;
      this.disableBtn = true;
      // tslint:disable-next-line:max-line-length
      alert('Please select the .csv file .' + '\n\nA1:Trainee_Name' + '\nB1:Trainee_email' + '\nC1:Trainee_Role' + '\nD1:Trainee_OnBoardDate' + '\nE1:Trainee_Travel' + '\nF1:Trainee_Skills' + '\nG1:Trainee_Visa');
      return false;
       }
      this.Userlist = XLSX.utils.sheet_to_json(ws, {raw: true});
      if(this.Userlist[0].Trainee_Name === "Please validate the data"){
       this.Userlist.splice( 0, 1 );
      }
   this.Userlist.push({'Trainee_IntegrationID' : this.traineeForm.controls['Trainee_IntegrationID'].value , 'CREATED_BY' : this.username, 'LAST_UPDATED_BY' : this.username, 'filename': this.importfile});
   this.stndardactivityactivities = JSON.parse(JSON.stringify(this.Userlist)) ;
   if(this.stndardactivityactivities.length > 151){
    alert('Max.Limit for trainee import will be upto 150 trainees.');
    return false;
   }
   this.incrementSpinner();
   setTimeout(() => {
   this._Ser.createStandardActivity(this.stndardactivityactivities).subscribe(res => {
      if (res.Filepath === undefined) {
        if (this.progress > 100) {
          this.progress = 0;
          this.loadData();
          this.toaster.success('Trainee Info have uploaded successfully.', 'Trainee Info');
        } 
      } else {  
      if (this.progress > 100) {
        this.progress = 0; 
        this._Ser.ViewUploadexecelfile(this.username);       
        window.open(this.baseURL+'/ViewUploadexecelTrainee/'+this.username); 
        alert('Trainee Info csv file has Improper Data to upload, Please check & reload again.'); 
       // this.toaster.error('Trainee Info csv file has Improper Data to upload, Please check & reload again', 'Trainee Info');   
      }
      }     
   });
  }, 8000)
  };
  fileReader.readAsBinaryString(this.file);
  this.file = null;
  // this.importfile = null;
  this.InputField.nativeElement.value = null;
  this.disableBtn = true;


  // window.open('https://localhost:3000/ImportTrainee');
  }

  setClickedRow(index: number, rowdata: any): void {
    if(index === 0){
      this.selectedRow = 0;
      this.CreateFalg = 'No';
      this.editFlag = 0;
      this.boolan = true;
      this.resetFields();
    }else {
    if (index === this.selectedRow) {
      this.selectedRow = 0;
      this.CreateFalg = 'No';
      this.editFlag = 0;
      this.boolan = true;
      this.resetFields();
     } else {
      this.selectedRow = index;
      this.CreateFalg = 'Yes';
      this.editFlag = 1;
      this.traineeForm.controls['Trainee_IntegrationID'].setValue(rowdata.Trainee_IntegrationID);
      this.traineeForm.controls['CREATED_BY'].setValue(rowdata.CREATED_BY);
      this.traineeForm.controls['LAST_UPDATED_BY'].setValue(rowdata.LAST_UPDATED_BY);
      this.traineeForm.controls['Trainee_SNO'].setValue(rowdata.Trainee_SNO);
      this.traineeForm.controls['Trainee_Name'].setValue(rowdata.Trainee_Name);
      this.traineeForm.controls['Trainee_email'].setValue(rowdata.Trainee_email);
      this.traineeForm.controls['Trainee_Role'].setValue(rowdata.Trainee_Role.split(','));
      this.traineeForm.controls['Trainee_OnBoardDate'].setValue(rowdata.Trainee_OnBoardDate);
      this.traineeForm.controls['Trainee_Travel'].setValue(rowdata.Trainee_Travel);
      if ((this.traineeForm.controls['Trainee_Travel'].value === 'No') || (this.traineeForm.controls['Trainee_Travel'].value === null)) {
        this.traineeForm.get('Trainee_Visa').clearValidators();
        this.traineeForm.get('Trainee_Visa').updateValueAndValidity();
        this.boolan = true;
      } else {
        this.boolan = false;
        this.traineeForm.controls['Trainee_Visa'].setValue(rowdata.Trainee_Visa);
      }
      this.traineeForm.controls['Trainee_Skills'].setValue(rowdata.Trainee_Skills.split(','));
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
  const string: any = this.traineeForm.controls['Trainee_Travel'].value;

  if (string.indexOf('Yes') < 0 ) {
  this.boolan = true;
  this.traineeForm.controls['Trainee_Visa'].setValue('');
  this.traineeForm.get('Trainee_Visa').clearValidators();
    this.traineeForm.get('Trainee_Visa').updateValueAndValidity();
  } else {
    this.traineeForm.get('Trainee_Visa').setValidators(Validators.required);
    this.traineeForm.get('Trainee_Visa').updateValueAndValidity();
     this.boolan = false;
    }

  }

resetFields() {
  this.traineeForm.controls['Trainee_Name'].setValue('');
  this.traineeForm.controls['Trainee_email'].setValue('');
  this.traineeForm.controls['Trainee_Role'].setValue('');
  this.traineeForm.controls['Trainee_OnBoardDate'].setValue('');
  this.traineeForm.controls['Trainee_Travel'].setValue('');
  this.traineeForm.controls['Trainee_Skills'].setValue('');
  this.traineeForm.controls['Trainee_Visa'].setValue('');
}

Add(obj: any) {

if (this.traineeForm.controls['Trainee_email'].value === '') {
  this.toaster.warning('Please select the valid Trainee Name.');
  return false;
}
  this.traineeForm.controls['CREATED_BY'].setValue(this.username);
 this.traineeForm.controls['LAST_UPDATED_BY'].setValue(this.username);
 console.log(this.traineeForm.value);

 this.saveSubscription = this._Ser.postAddTrainee(this.traineeForm.value).subscribe(res => {
  this.loadData();
  this.resetFields();
  this.boolan = true;
  this.myJSON = null ;
  this.toaster.success('Trainee Info Details have added successfully.');
}, (errpostAddTrainee: HttpErrorResponse) => {
  if (errpostAddTrainee.error instanceof Error) {
      console.log('Client Sider Error.');
  } else {
      console.log('Server Sider Error.');
  }
});
}

onDelete(obj: any) {
  if (confirm('Are you sure want to delete ' + obj.Trainee_Name + ' ?')) {
      this.deleteSubscription = this._Ser.DeleteTrainee(obj.Trainee_SNO).subscribe(res => {
          this.loadData();
          console.log(res.Delete);
           if (res.Delete === 'success') {
             this.toaster.success('Deleted Succcessfully', 'Trainee Info');
          } else if (res.Delete === 'Fail') {
          this.toaster.error('Delete Fail', 'Trainee Info');
          } else {
        // console.log(res.Delete.join('/r/n'));
         window.alert(res.Delete.join('\n'));
        //  this.toaster.error(res.Delete.join('/r/n') , 'Trainee Name can not be deleted as mapped to below functionalities:');
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
      // this.toaster.info('Deleted Canclled.', 'Trainee Info');
       }
       }

 Update(obj: any) {
  if (this.traineeForm.controls['Trainee_email'].value === '') {
    this.toaster.warning('Please select the valid Trainee Name.');
    return false;
  }
        this.traineeForm.controls['LAST_UPDATED_BY'].setValue(this.username);
          this.UpdateSubscription =  this._Ser.putUpdateTrainee(this.traineeForm.value).subscribe(res => {
            this.loadData();
            this.resetFields();
            this.editFlag = 0;
            this.boolan = true;
            this.myJSON = null;
            this.toaster.success('Trainee details Updated.');
          }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
         console.log('Client side error.') ;
        } else {console.log('Server side error.') ; }
      });
}
}
