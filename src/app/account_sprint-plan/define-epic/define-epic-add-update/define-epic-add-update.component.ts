import { Component, OnInit,Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DefineEpicService } from '../define-epic/define-epic.service';
import { NavtntService } from './../../../navtnt.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-define-epic-add-update',
  templateUrl: './define-epic-add-update.component.html',
  styleUrls: ['./define-epic-add-update.component.css']
})
export class DefineEpicAddUpdateComponent implements OnInit, OnDestroy {


    editFlag: number; // check whether user is going for edit or new row add
    
    BaselineFlag: number; // check the baseline subscription used or not
    baseURL = environment.baseUrl;
    TransitionAccName: any;
    @ViewChild('Owner') nameField: ElementRef;  
    dataSource = new MatTableDataSource < any > ();
    dataLength: number;
    selectedRow: number;
    epicUpdateForm: FormGroup;
    private colorcode: any;
    private progress = 0;
    // private loadparamsSubscription: Subscription;
    private saveSubscription: Subscription;    
    private profileStartandEndDateSubscription : Subscription;
    private profileStartandEndDateSubscriptionFlag : number;
    private TransStartDt : any ;
    private TransEndDt : any;
    private baselineFlagValue: number;
    private baselinePageFlag: number;
    private savedFlag = false;
    private isGreen = false;    
    private appCategoryDatasource: any;
    private IntegrationID: string;    
    private errMessage : string;
    private acsDateFlag : number;
    private aceDateFlag : number;
    private dateFields : any;
    FlagHide: any;
    username: any;
    count: number;
    emailcheck: any;
    Empnamecheck: any;
    myJSON: '';
    Employee_Name: any[];
    private ownerIDValidation :number;
    addFlag : number;
  
      constructor(private service: DefineEpicService,
          public dialog : MatDialog,
          private fb: FormBuilder,
          private activatedRoute: ActivatedRoute,
          private toastr: ToastrService,
          private navigation: NavtntService,
          public datepipe: DatePipe,
          public dialogRef: MatDialogRef<DefineEpicAddUpdateComponent>,
          @Inject(MAT_DIALOG_DATA) public data: any
      ) {
          this.addFlag = 0;
          this.aceDateFlag = 0;
          this.acsDateFlag = 0;
          this.dataLength = 0;
          this.selectedRow = 0;
          this.editFlag = 0;          
          this.BaselineFlag = 0;
          this.ownerIDValidation = 0;
          this.profileStartandEndDateSubscriptionFlag =0
          this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
          this.username = decodeURIComponent(this.username._value);  
          this.TransitionAccName = JSON.parse(sessionStorage.getItem('ACCOUNTClientName'));
          this.TransitionAccName = decodeURIComponent(this.TransitionAccName._value);
          this.TransitionAccName = this.TransitionAccName.replace(/\s/g,'');              
          this.baselineFlagValue = this.data.baselineFlagValue;
          this.baselinePageFlag = this.data.baselinePageFlag;
          this.IntegrationID = this.data.IntegrationID;

          this.epicUpdateForm = this.fb.group({
              epicUNID: [''],
              epicName: ['', Validators.required],
              startDate: [''],
              endDate: [''],
              replanStartDate: [''],
              replanEndDate: [''],
              actualStartDate: [''],
              actualEndDate: [''],
              IntegrationID: [''],
              createdBy: [''],
              modifiedBy: [''],
              rag: [''],
              Owner: [''],
              reason_for_not_green: [''],
              go_to_green_plan: [''],
              remarks: [''],
              operation : ['']
          });
      
      
      }
      
    ngOnInit() { 
      console.log(this.data)     
      this.epicUpdateForm.controls['IntegrationID'].setValue(this.data.IntegrationID)      
      this.epicUpdateForm.controls['modifiedBy'].setValue(this.data.username);
      this.profileStartandEndDate();     
      
        if(this.data.operation === 'Add'){
          this.editFlag = 0;
          this.epicUpdateForm.controls['createdBy'].setValue(this.data.username);
          this.epicUpdateForm.controls['operation'].setValue('Add');          
        }else if(this.data.operation === 'update' ){
          this.editFlag = 1;
          this.loadData();
        }else if (this.data.operation === 'View'){
          this.loadData();
          this.epicUpdateForm.disable();
        }
  }
  
   
  loadData() {  
    console.log(this.data)
    this.epicUpdateForm.controls['epicUNID'].setValue(this.data.epicUNID);
    this.epicUpdateForm.controls['epicName'].setValue(this.data.epicName);
    
    this.dateFields= this.datepipe.transform(this.data.startDate, 'yyyy-MM-dd')
    if(this.dateFields === null  ){
      this.epicUpdateForm.controls['startDate'].setValue('');      
    }else{
      this.epicUpdateForm.controls['startDate'].setValue(new Date(this.data.startDate));
    }
    this.dateFields= this.datepipe.transform(this.data.endDate, 'yyyy-MM-dd')
    if(this.dateFields === null  ){
      this.epicUpdateForm.controls['endDate'].setValue('');
  }else{    
    this.epicUpdateForm.controls['endDate'].setValue(new Date(this.data.endDate));
  }
  console.log(this.data.replanStartDate)
  this.dateFields= this.datepipe.transform(this.data.replanStartDate, 'yyyy-MM-dd')
  console.log(this.dateFields)

  if(this.dateFields === null  ){
    console.log("yes")
      this.epicUpdateForm.controls['replanStartDate'].setValue('');
  }else{
    this.epicUpdateForm.controls['replanStartDate'].setValue(new Date(this.data.replanStartDate));
  }
  this.dateFields= this.datepipe.transform(this.data.replanEndDate, 'yyyy-MM-dd')
  if(this.dateFields === null  ){
      this.epicUpdateForm.controls['replanEndDate'].setValue('');
  }else{
    this.epicUpdateForm.controls['replanEndDate'].setValue(new Date(this.data.replanEndDate));
  }
  this.dateFields= this.datepipe.transform(this.data.actualStartDate, 'yyyy-MM-dd')
  if(this.dateFields === null  ){
      this.acsDateFlag = 1;
      this.epicUpdateForm.controls['actualStartDate'].setValue('');
  }else{
    this.epicUpdateForm.controls['actualStartDate'].setValue(new Date(this.data.actualStartDate));
  }
  this.dateFields= this.datepipe.transform(this.data.actualEndDate, 'yyyy-MM-dd')
  if(this.dateFields === null  ){
      this.aceDateFlag = 1;
      this.epicUpdateForm.controls['actualEndDate'].setValue('');
  }else{
    this.epicUpdateForm.controls['actualEndDate'].setValue(new Date(this.data.actualEndDate));
  }
   
  this.colorcode = this.data.rag;
  this.epicUpdateForm.controls['rag'].setValue(this.data.rag);
  this.epicUpdateForm.controls['Owner'].setValue(this.data.Owner);
  this.epicUpdateForm.controls['remarks'].setValue(this.data.remarks);
  this.epicUpdateForm.controls['reason_for_not_green'].setValue(this.data.reason_for_not_green);
  this.epicUpdateForm.controls['go_to_green_plan'].setValue(this.data.go_to_green_plan);
  if (this.data.rag === 'Green'){
    this.epicUpdateForm.controls['reason_for_not_green'].disable();
    this.epicUpdateForm.controls['go_to_green_plan'].disable();
    // this.epicUpdateForm.controls['reason_for_not_green'].setValue('');
    // this.epicUpdateForm.controls['go_to_green_plan'].setValue('');
  }
      
  this.epicUpdateForm.controls['operation'].setValue('update');    
  
  if(this.data.rag === 'Green'){
      this.isGreen = true;
  }
  else{
      this.isGreen = false;
  }
  console.log(this.epicUpdateForm.value)
      // this.loadparamsSubscription = this.service.getEpics(this.IntegrationID).subscribe(res => {
      //     this.dataSource.data = res;  
      //     this.dataLength = this.dataSource.data.length;
      //     if (this.dataLength !== 0) {
      //         this.baselineFlagValue = res[0].Baselined
      //         this.baselinePageFlag = res[0].Baselined
      //     }
      // }, (err: HttpErrorResponse) => {
      //     if (err.error instanceof Error) {
      //         console.log('Client Sider Error.');
      //     } else {
      //         console.log('Server Sider Error.');
      //     }
      // });
  }
  
  profileStartandEndDate(){
    this.profileStartandEndDateSubscriptionFlag =1
    this.profileStartandEndDateSubscription = this.service.profileStartandEndDate(this.IntegrationID).subscribe(res=>{
        this.TransStartDt = this.datepipe.transform(res[0].TransStartDt, 'yyyy-MM-dd');
        this.TransEndDt = this.datepipe.transform(res[0].TransEndDt, 'yyyy-MM-dd');
        console.log(this.TransStartDt)
        console.log( this.TransEndDt)
  
    }, (profileStartandEndDateSubscriptionerr: HttpErrorResponse) => {
        if (profileStartandEndDateSubscriptionerr.error instanceof Error) {
            console.log('Client Sider Error.');
        } else {
            console.log('Server Sider Error.');
        }
    })
  }
  
  
  
  
  onSubmit() {
  
  }
  
  
  
  Add(key : number) {
    
  if(this.epicUpdateForm.controls['epicName'].value.trim().length === 0){
    this.toastr.warning('Epic Name should not be blank.','Epic')
    return false;
  }

    if( this.ownerIDValidation !== 0){
        this.toastr.error('Validate the Owner Name with Bluepages using search button ')
        return false;
    }
    this.dateValidation(key);
    if (this.errMessage !== "") {
      this.toastr.error(this.errMessage);
  //    this.errMessage = ""
      return false;
  }
      this.epicUpdateForm.controls['createdBy'].setValue(this.username);
      this.epicUpdateForm.controls['modifiedBy'].setValue(this.username);
      //this.epicUpdateForm.controls['reason_for_not_green'].setValue('');
      //this.epicUpdateForm.controls['go_to_green_plan'].setValue('');
      // if (confirm('Are you sure want to delete ?' ) ) {
      console.log(this.epicUpdateForm.value)
      this.saveSubscription = this.service.epicSave(this.epicUpdateForm.value).subscribe(res => {
        if (res.duplicate === 'success') {
            this.toastr.error('Epic Name already exists', 'Epic');            
        } else if (res.save === 'success') {
              this.toastr.success('Inserted Succcessfully', 'Epic');
              this.dialogRef.close({operation : this.epicUpdateForm.value.operation});
              //this.loadData();
          } else {
              this.toastr.error('Insert Fail', 'Epic');
          }
          this.savedFlag = true;
      }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
              this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com');
          } else {
              this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com');
          }
      });
      //this.resetFields();
  }
  close():void {
    this.dialogRef.close({operation : "close"});
  }
  Update(key : number) {
    if(this.epicUpdateForm.controls['epicName'].value.trim().length === 0){
      this.toastr.warning('Epic Name should not be blank.','Epic')
      return false;
    }

    if( this.ownerIDValidation !== 0){
        this.toastr.error('Validate the Owner Name with Bluepages using search button ')
        return false;
    }
    this.errMessage = "test"
    this.dateValidation(key);
    if (this.errMessage !== "") {
      this.toastr.error(this.errMessage);
      this.errMessage = ""
  //    this.errMessage = ""
      return false;
  }
      this.epicUpdateForm.controls['modifiedBy'].setValue(this.username);
      console.log('update');
      console.log(this.epicUpdateForm.value);
      this.saveSubscription = this.service.updateEpic(this.epicUpdateForm.value).subscribe(res => {
          console.log(res)
          if (res.insert === 'success') {
             //this.resetFields();
             this.editFlag = 0;
              this.toastr.success('Updated Succcessfully', 'Epic');
              this.dialogRef.close({operation : this.epicUpdateForm.value.operation});
              //this.loadData();
          } else {
              this.toastr.error(res.insert, 'Epic');
          }
  
          this.savedFlag = true;
         
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
  
  valuechangeCorrection(event){  
      if((event.target.value.length-1  === 0) && (event.code == "Backspace" || event.code == "Delete")){   
        this.ownerIDValidation = 0;    
      }      
   }
  
  valuechange(TName: string) {
    //this.CDForm.controls['ContractDoc_Owneremail'].setValue('');
    console.log("TName"+TName.length)  
    this.ownerIDValidation = 1;    
    this.myJSON = null;
  }
  setOWnerFlag(){
    this.ownerIDValidation = 0;   
  }
  dateValidation(key : number){
    this.errMessage = ""
    // console.log(this.epicUpdateForm.value)
    console.log("dateValidation")
    console.log(this.epicUpdateForm.value.startDate)
    console.log(this.epicUpdateForm.value.endDate)
      if (this.baselinePageFlag === 0 || this.baselineFlagValue===0 || this.dataLength ===0 || key === 1) {
          
          if ((this.epicUpdateForm.value.startDate !== "" && this.epicUpdateForm.value.startDate !== null) &&
              (this.epicUpdateForm.value.endDate !== "" && this.epicUpdateForm.value.endDate !== null) 
              && (this.epicUpdateForm.value.startDate > this.epicUpdateForm.value.endDate)) {          
                this.errMessage = 'Transition planned Start Date is greater than Transition planned End Date'
          }      
       }else{
           console.log("else")
            if ((this.epicUpdateForm.value.replanStartDate !== "" && this.epicUpdateForm.value.replanStartDate !== null) &&
                (this.epicUpdateForm.value.replanEndDate !== "" && this.epicUpdateForm.value.replanEndDate !== null) 
                && (this.epicUpdateForm.value.replanStartDate > this.epicUpdateForm.value.replanEndDate)) {          
                  this.errMessage = 'Transition Replanned Start Date is greater than Transition Replanned End Date'
            }
       }     
       if ((this.epicUpdateForm.value.actualStartDate !== ""  && this.epicUpdateForm.value.actualStartDate !== null) 
            && (this.epicUpdateForm.value.actualEndDate !== ""  &&  this.epicUpdateForm.value.actualEndDate !== null)
            && (this.epicUpdateForm.value.actualStartDate > this.epicUpdateForm.value.actualEndDate)) {   
             if(this.errMessage !== ""){
              this.errMessage =this.errMessage + ", "
             }       
            this.errMessage =this.errMessage + 'Transition Actual Start Date is greater than Transition Actual End Date'
          }
        }
  

getEmployeeName(Name: string) {

  this.Employee_Name = [];
  this.service.getEmployeeDirectory(Name).subscribe(res => {
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

getColor(newsetcolor :string) {  
  if(newsetcolor === 'Green'){      
    this.epicUpdateForm.controls['go_to_green_plan'].disable();
    this.epicUpdateForm.controls['reason_for_not_green'].disable();
    this.isGreen = true;   
    this.colorcode = newsetcolor; 
  }
  else{
    this.epicUpdateForm.controls['go_to_green_plan'].enable();
    this.epicUpdateForm.controls['reason_for_not_green'].enable();
    this.isGreen = false;    
    this.colorcode = newsetcolor; 
  }
}
 
  ngOnDestroy() {
    this.resetFields();
      // this.loadparamsSubscription.unsubscribe();
      if (this.savedFlag === true) {
          this.saveSubscription.unsubscribe();
      }
     
      if (this.profileStartandEndDateSubscriptionFlag === 1 ) {
          this.profileStartandEndDateSubscription.unsubscribe();
      }
  }
  resetFields() {
    this.aceDateFlag = 0;
    this.acsDateFlag = 0;
    this.epicUpdateForm.controls['epicName'].setValue('');
    this.epicUpdateForm.controls['startDate'].setValue('');
    this.epicUpdateForm.controls['endDate'].setValue('');
    this.epicUpdateForm.controls['replanStartDate'].setValue('');
    this.epicUpdateForm.controls['replanEndDate'].setValue('');
    this.epicUpdateForm.controls['actualStartDate'].setValue('');
    this.epicUpdateForm.controls['actualEndDate'].setValue('');
    this.colorcode = null;
    this.epicUpdateForm.controls['rag'].setValue('');
    this.epicUpdateForm.controls['Owner'].setValue('');
    this.epicUpdateForm.controls['remarks'].setValue('');
    this.epicUpdateForm.controls['reason_for_not_green'].setValue('');
    this.epicUpdateForm.controls['go_to_green_plan'].setValue('');
}


}
