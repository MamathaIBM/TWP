import { NavtntService } from './../../../navtnt.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Component, inject, ViewChild, OnInit, OnDestroy,ElementRef, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EpicSprintPlanService } from '../epic-sprint-plan/epic-sprint-plan.service';
export interface epicsprintplan {
  // MatPaginator Output
  pageEvent: PageEvent;

}


@Component({
  selector: 'app-epic-sprint-plan-add-update',
  templateUrl: './epic-sprint-plan-add-update.component.html',
  styleUrls: ['./epic-sprint-plan-add-update.component.css']
})
export class EpicSprintPlanAddUpdateComponent implements OnInit {

  
  editFlag: number; // check whether user is going for edit or new row add
  // deleteFlag: number; // check the delete subscription used or not
  BaselineFlag: number; // check the baseline subscription used or not
  displayedColumns: string[] = ['epicName','sprintName','startDate', 'endDate','replanStartDate','replanEndDate','actualStartDate' , 'actualEndDate', 'rag', 'owner', 'remarks','reasonfornotgreen', 'gotogreenplan', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('Owner') nameField: ElementRef;
  TransitionAccName: any;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  epicUpdateForm: FormGroup;
  private progress = 0;
  // private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  
  private epicNameSubscription : Subscription;
  private profileStartandEndDateSubscription : Subscription;
  private profileStartandEndDateSubscriptionFlag : number;
  private getSingleEpicsNameSubscription : Subscription;
  private getSingleEpicsNameSubscriptionFlag : number;
  private baselineFlagValue:number;
  private baselinePageFlag:number;
  private savedFlag = false;
  private IntegrationID: string;
  private TransStartDt : any ;
  private TransEndDt : any;
  private TransStartDt1 : any ;
  private TransEndDt1 : any;
  private epicNameList : any;
  private errMessage : string;
  FlagHide: any;
  username: any;
  epicNameListval: any;
  private colorcode: any;
  myJSON: '';
  Employee_Name: any[];
  count: number;
  emailcheck: any;
  Empnamecheck: any;
  private acsDateFlag : number;
  private aceDateFlag : number;
  private ownerIDValidation :number;
  epicCount: number;
  private dateFields : any;
  private isGreen = false; 
  Scope_Level = [];   
  constructor(private service: EpicSprintPlanService,
              private fb: FormBuilder,
              private activatedRoute: ActivatedRoute,
               private toastr: ToastrService,
               private navigation: NavtntService,
               public datepipe: DatePipe,
               public dialog : MatDialog,
               public dialogRef: MatDialogRef<EpicSprintPlanAddUpdateComponent>,
               @Inject(MAT_DIALOG_DATA) public data: any

             ) {
    this.dataLength = 0;
    this.selectedRow = 0;
    this.editFlag = 0;
    // this.deleteFlag = 0;
    this.BaselineFlag =0; 
    this.aceDateFlag = 0;
    this.acsDateFlag = 0;
    this.ownerIDValidation = 0;
    this.profileStartandEndDateSubscriptionFlag =0;   
    this.getSingleEpicsNameSubscriptionFlag = 0;
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);  
    this.TransitionAccName = JSON.parse(sessionStorage.getItem('ACCOUNTClientName'));
    this.TransitionAccName = decodeURIComponent(this.TransitionAccName._value);
    this.TransitionAccName = this.TransitionAccName.replace(/\s/g,'');              
    this.baselineFlagValue = this.data.baselineFlagValue;
    this.baselinePageFlag = this.data.baselinePageFlag;
    this.IntegrationID = this.data.IntegrationID;
    this.IntegrationID = this.data.IntegrationID;
    
    this.epicUpdateForm = this.fb.group({
      epicUNID : ['', Validators.required],
      epicName : [''],
      sprintUNID : [''],
      sprintName  : ['', Validators.required],
      startDate : [''] ,
      endDate : [''] ,
      replanStartDate : [''],
      replanEndDate : [''],
      actualStartDate : [''],
      actualEndDate : [''],
      IntegrationID : [''],
      createdBy : [''],
      modifiedBy : [''],
      rag: [''],
      Owner: [''],
      reason_for_not_green: [''],
      go_to_green_plan: [''],
      remarks: [''],
      operation : [''],
      scopelevel: ['', Validators.required]      
    });
  }

  ngOnInit() {
    console.log(this.data)
    this.getEpicsNameData();
    this.profileStartandEndDate();

    this.service.getScopeLvels().subscribe(Sres=>{ 
      this.Scope_Level=Sres;
    });  
    
    this.epicUpdateForm.controls['IntegrationID'].setValue(this.data.IntegrationID)      
    this.epicUpdateForm.controls['modifiedBy'].setValue(this.data.username);      
    if(this.data.operation === 'Add'){
        this.editFlag = 0;
        this.epicUpdateForm.controls['createdBy'].setValue(this.data.username);
        this.epicUpdateForm.controls['operation'].setValue('Add');          
      }else if(this.data.operation === 'update' ){
        this.editFlag = 1;
        // this.getSingleEpicsName(this.data.epicUNID);
        setTimeout(() => {
          console.log("100")
          this.getSingleEpicsName(this.data.epicUNID);
        }, 100);
        setTimeout(() => {
          console.log("200")
          this.loadData();
        }, 200);
      }else if (this.data.operation === 'View'){
        this.loadData();
        this.epicUpdateForm.disable();
      }
  }

  loadData() {  
    this.epicUpdateForm.controls['epicUNID'].setValue(this.data.epicUNID);  
    this.epicUpdateForm.controls['sprintUNID'].setValue(this.data.sprintUNID);    
    this.epicUpdateForm.controls['sprintName'].setValue(this.data.sprintName);
    this.epicUpdateForm.controls['scopelevel'].setValue(this.data.scopelevel);
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
  
  this.dateFields= this.datepipe.transform(this.data.replanStartDate, 'yyyy-MM-dd')  

  if(this.dateFields === null  ){
    
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
      
      this.epicUpdateForm.controls['actualStartDate'].setValue('');
  }else{
    this.acsDateFlag = 1;
    this.epicUpdateForm.controls['actualStartDate'].setValue(new Date(this.data.actualStartDate));
  }
  this.dateFields= this.datepipe.transform(this.data.actualEndDate, 'yyyy-MM-dd')
  if(this.dateFields === null  ){
      
      this.epicUpdateForm.controls['actualEndDate'].setValue('');
  }else{
    this.aceDateFlag = 1;
    this.epicUpdateForm.controls['actualEndDate'].setValue(new Date(this.data.actualEndDate));
  }
   
  this.colorcode = this.data.rag;
  this.epicUpdateForm.controls['rag'].setValue(this.data.rag);
  this.epicUpdateForm.controls['Owner'].setValue(this.data.Owner);
  this.epicUpdateForm.controls['remarks'].setValue(this.data.remarks);
  this.epicUpdateForm.controls['reason_for_not_green'].setValue(this.data.reason_for_not_green);
  this.epicUpdateForm.controls['go_to_green_plan'].setValue(this.data.go_to_green_plan);    
  this.epicUpdateForm.controls['operation'].setValue('update');    
  if (this.data.rag === 'Green'){
    this.epicUpdateForm.controls['reason_for_not_green'].disable();
    this.epicUpdateForm.controls['go_to_green_plan'].disable();
    // this.epicUpdateForm.controls['reason_for_not_green'].setValue('');
    // this.epicUpdateForm.controls['go_to_green_plan'].setValue('');
  }
  if(this.data.rag === 'Green'){
      this.isGreen = true;
  }
  else{
      this.isGreen = false;
  }
  console.log("new data")
  console.log(this.epicUpdateForm.value)
  
  }

  setDates(epicRow : any){
    if(epicRow.actualStartDate !== null ){
      this.TransStartDt = epicRow.actualStartDate
    }else if (epicRow.replanStartDate !== null){
      this.TransStartDt = epicRow.replanStartDate
    }else{
      this.TransStartDt = epicRow.startDate
    }

    if(epicRow.actualStartDate !== null && epicRow.actualEndDate === null){
      this.TransEndDt = this.TransEndDt1
    }
    else if(epicRow.actualEndDate !== null){
      this.TransEndDt = epicRow.actualEndDate
    }else if (epicRow.replanEndDate !== null){
      this.TransEndDt = epicRow.replanEndDate
    }else{
      this.TransEndDt = epicRow.endDate
    }
    
  }
  
  profileStartandEndDate(){
    this.profileStartandEndDateSubscriptionFlag =1  
    this.profileStartandEndDateSubscription = this.service.profileStartandEndDate(this.IntegrationID).subscribe(pres=>{  
        this.TransStartDt1 = this.datepipe.transform(pres[0].TransStartDt, 'yyyy-MM-dd');
        this.TransEndDt1 = this.datepipe.transform(pres[0].TransEndDt, 'yyyy-MM-dd');
    }, (profileStartandEndDateSubscriptionerr: HttpErrorResponse) => {
        if (profileStartandEndDateSubscriptionerr.error instanceof Error) {
            console.log('Client Sider Error.');
        } else {
            console.log('Server Sider Error.');
        }
    })
  }
  
  getEpicsNameData() {
    this.epicNameSubscription = this.service.getEpicsName(this.IntegrationID).subscribe(res => {      
        this.epicNameListval = res;
      }, (getEpicsNameerr: HttpErrorResponse) => {
            if (getEpicsNameerr.error instanceof Error ) {
              console.log('Client Sider Error.');
            } else {
              console.log('Server Sider Error.');
          }
        },
      ()=>{
        this.epicNameList = this.epicNameListval;
      });
  }
  close():void {
    this.dialogRef.close({operation : "close"});
  }
  getSingleEpicsName(epicUNID:string){
    this.getSingleEpicsNameSubscription = this.service.getSingleEpicsName(this.IntegrationID,epicUNID).subscribe(gsres => {            
      this.getSingleEpicsNameSubscriptionFlag = 1;      
      this.setDates(gsres[0])
    }, (getSingleEpicsNameSubscriptionerr: HttpErrorResponse) => {
          if (getSingleEpicsNameSubscriptionerr.error instanceof Error ) {
            console.log('Client Sider Error.');
          } else {
            console.log('Server Sider Error.');
        }
      },
    ()=>{    
    });
  }

onSubmit(){

}

resetFields() {
  this.aceDateFlag = 0;
  this.acsDateFlag = 0;
  this.epicUpdateForm.controls['sprintUNID'].setValue('');
  this.epicUpdateForm.controls['epicUNID'].setValue('');
  this.epicUpdateForm.controls['sprintName'].setValue('');
  this.epicUpdateForm.controls['scopelevel'].setValue('');
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

dateValidation(){
  this.errMessage = ""
    if (this.baselinePageFlag === 0 || this.baselineFlagValue===0 || this.dataLength ===0) {
        if ((this.epicUpdateForm.value.startDate !== "" && this.epicUpdateForm.value.startDate !== null) &&
            (this.epicUpdateForm.value.endDate !== "" && this.epicUpdateForm.value.endDate !== null) 
            && (this.epicUpdateForm.value.startDate > this.epicUpdateForm.value.endDate)) {          
              this.errMessage = 'Transition planned Start Date is greater than Transition planned End Date'
        }      
     }else{
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

Add() {

  if(this.epicUpdateForm.controls['sprintName'].value.trim().length === 0){
    this.toastr.warning('Sprint Name should not be blank.','Epic Sprint ')
    return false;
  }

  if( this.ownerIDValidation !== 0){
    this.toastr.error('Validate the Owner Name with Bluepages using search button ')
    return false;
}
  this.dateValidation();
      if (this.errMessage !== "") {
        this.toastr.error(this.errMessage);
    //    this.errMessage = ""
        return false;
    }
  this.epicUpdateForm.controls['createdBy'].setValue(this.username);
  this.epicUpdateForm.controls['modifiedBy'].setValue(this.username);
  // if (confirm('Are you sure want to delete ?' ) ) {    
  var obj =this.epicUpdateForm.value
  if(this.baselinePageFlag === 1 || this.baselineFlagValue===1){
    
    obj['Baselined'] = 1

    // this.epicUpdateForm.value = obj
  }
    console.log(obj)
  this.saveSubscription =  this.service.sprintSave(obj).subscribe(res => {
    if (res.duplicate === 'success') {
      this.toastr.error('Sprint Name already exists', 'Sprint');            
  } else if (res.save === 'success') {
    this.toastr.success('Inserted Succcessfully', 'Sprint');
    this.dialogRef.close({operation : this.epicUpdateForm.value.operation});
    // this.loadData();
  } else {
    this.toastr.error('Insert Fail', 'Sprint');
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
}

Update() {
  if(this.epicUpdateForm.controls['sprintName'].value.trim().length === 0){
    this.toastr.warning('Sprint Name should not be blank.','Epic Sprint ')
    return false;
  }
  if( this.ownerIDValidation !== 0){
    this.toastr.error('Validate the Owner Name with Bluepages using search button ')
    return false;
}
  this.dateValidation();
      if (this.errMessage !== "") {
        this.toastr.error(this.errMessage);
       // this.errMessage = ""
        return false;
    }

  this.epicUpdateForm.controls['modifiedBy'].setValue(this.username);
  console.log('update');
  console.log(this.epicUpdateForm.value);
     this.saveSubscription =  this.service.updateSprint(this.epicUpdateForm.value ).subscribe(res => {
       console.log(res)
       if (res.insert === 'success') {
        this.editFlag = 0;
        this.toastr.success('Updated Succcessfully', 'Sprint');
        this.dialogRef.close({operation : this.epicUpdateForm.value.operation});
        // this.loadData();
       } else {
        this.toastr.error(res.insert, 'Sprint');
        window.alert(res.Delete.join('\n'));
       }

     this.savedFlag = true;
    
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error ) {
        console.log('Client Side Error.');
        this.toastr.error('Client side update Error', 'ttstoolssupport@in.ibm.com');
      } else {
        this.toastr.error('Server side update Error', 'ttstoolssupport@in.ibm.com');
        console.log('Server Sider Error.');
    }
  });
    // this.resetFields();
}

getColor(newsetcolor :string) { 
  //this.colorcode = newsetcolor; 
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
valuechangeCorrection(event){   
  if(event.code == "Delete"){
    this.ownerIDValidation = 0;    
  }else
  if((event.target.value.length-1 === 0) && (event.code == "Backspace")){   
    this.ownerIDValidation = 0;    
  }      
}
valuechange(TName: string) {
  //this.CDForm.controls['ContractDoc_Owneremail'].setValue('');
  this.ownerIDValidation = 1;
  this.myJSON = null;
}
setOWnerFlag(){
  this.ownerIDValidation = 0;   
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

ngOnDestroy() {
  // this.loadparamsSubscription.unsubscribe();
  this.epicNameSubscription.unsubscribe();
  if (this.savedFlag === true ) {
    this.saveSubscription.unsubscribe();
  }

  if(this.profileStartandEndDateSubscriptionFlag === 1) {
    this.profileStartandEndDateSubscription.unsubscribe();
  }
  if(this.getSingleEpicsNameSubscriptionFlag === 1){
    this.getSingleEpicsNameSubscription.unsubscribe();
  }

}

}
