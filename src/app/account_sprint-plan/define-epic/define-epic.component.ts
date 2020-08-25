import { NavtntService } from './../../navtnt.service';
import { DefineEpicService } from 'src/app/account_sprint-plan/define-epic/define-epic/define-epic.service';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Component, inject, ViewChild, OnInit, OnDestroy,ElementRef, ViewEncapsulation } from '@angular/core';
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
import {forkJoin} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material';
import { DefineEpicAddUpdateComponent } from './define-epic-add-update/define-epic-add-update.component';

export interface epicplanning {
  // MatPaginator Output
  pageEvent: PageEvent;
}

@Component({
  selector: 'app-define-epic',
  templateUrl: './define-epic.component.html',
  styleUrls: ['./define-epic.component.css'],
  
})

export class DefineEpicComponent implements OnInit, OnDestroy {
  editFlag: number; // check whether user is going for edit or new row add
  deleteFlag: number; // check the delete subscription used or not
  BaselineFlag: number; // check the baseline subscription used or not
  baseURL = environment.baseUrl;
  TransitionAccName: any;
 displayedColumns: string[] = ['epicName', 'startDate', 'endDate', 'replanStartDate', 'replanEndDate', 'actualStartDate', 'actualEndDate', 'rag', 'owner', 'remarks','reasonfornotgreen', 'gotogreenplan', 'icon'];
 
 @ViewChild(MatPaginator) paginator: MatPaginator; // Pagination
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('Owner') nameField: ElementRef;  
  dataSource = new MatTableDataSource < any > ();
  dataLength: number;
  selectedRow: number;
  epicUpdateForm: FormGroup;
  private colorcode: any;
  private progress = 0;
  private loadparamsSubscription: Subscription;
//   private saveSubscription: Subscription;
  private deleteSubscription: Subscription;
  private baselineSubscription: Subscription;
//   private profileStartandEndDateSubscription : Subscription;
//   private profileStartandEndDateSubscriptionFlag : number;
  private TransStartDt : any ;
  private TransEndDt : any;
  private baselineFlagValue: number;
  private baselinePageFlag: number;
  private savedFlag = false;
  private isGreen = false;
  private sprinnerFlag : number ;
  private appCategoryDatasource: any;
  private IntegrationID: string;
  // private createdBy: string;
  // private modifiedBy: string;
  private errMessage : string;
  private acsDateFlag : number;
  private aceDateFlag : number;
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
    ) {
        this.sprinnerFlag = 1;
        this.addFlag = 0;
        this.aceDateFlag = 0;
        this.acsDateFlag = 0;
        this.dataLength = 0;
        this.selectedRow = 0;
        this.editFlag = 0;
        this.deleteFlag = 0;
        this.BaselineFlag = 0;
        this.ownerIDValidation = 0;
        // this.profileStartandEndDateSubscriptionFlag =0
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
            operation : [''],
            baselineFlagValue   : [''],
            baselinePageFlag    : [''],
        });
    
    
    }

   
    
    
  ngOnInit() {      
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);

    this.TransitionAccName = JSON.parse(sessionStorage.getItem('ACCOUNTClientName'));
  this.TransitionAccName = decodeURIComponent(this.TransitionAccName._value);
  this.TransitionAccName = this.TransitionAccName.replace(/\s/g,'');
  
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
            // this.profileStartandEndDate();
            this.loadData();
            this.epicUpdateForm.controls['IntegrationID'].setValue(this.IntegrationID);
            this.epicUpdateForm.controls['createdBy'].setValue(this.username);
            this.epicUpdateForm.controls['modifiedBy'].setValue(this.username);
        }
    });  
}

openDialog(): void {
  let dialogRef = this.dialog.open(DefineEpicAddUpdateComponent, {
     width: '1800px',   
     data: {    IntegrationID       : this.IntegrationID,
                baselineFlagValue   : this.baselineFlagValue,
                baselinePageFlag    : this.baselinePageFlag,
                operation           : 'Add'
            }
  });
  dialogRef.afterClosed().subscribe(result => {
      this.loadData();                           
   });
}

viewOpenDialog(): void {
    let dialogRef = this.dialog.open(DefineEpicAddUpdateComponent, {
       width: '1800px',   
       data: this.epicUpdateForm.value
    });  
    dialogRef.afterClosed().subscribe(result => {
        // this.resetFields()
        // this.loadData();                           
     });
  }


  editOpenDialog(): void {
    let dialogRef = this.dialog.open(DefineEpicAddUpdateComponent, {
       width: '1800px',   
       data: this.epicUpdateForm.value
    });
  
    dialogRef.afterClosed().subscribe(result => {
        this.resetFields()
        this.loadData();                           
     });
  }

loadData() {    
    this.loadparamsSubscription = this.service.getEpics(this.IntegrationID).subscribe(res => {
        this.dataSource.data = res;  
        this.dataLength = this.dataSource.data.length;
        if (this.dataLength !== 0) {
            this.baselineFlagValue = res[0].Baselined
            this.baselinePageFlag = res[0].Baselined
            this.sprinnerFlag = 1;
            
        }else{
            this.baselineFlagValue = 0
            this.baselinePageFlag = 0
            
        }
        console.log(this.baselineFlagValue)
        console.log(this.baselinePageFlag)

    }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
            console.log('Client Sider Error.');
        } else {
            console.log('Server Sider Error.');
        }
    });
}

// profileStartandEndDate(){
//   this.profileStartandEndDateSubscriptionFlag =1
//   this.profileStartandEndDateSubscription = this.service.profileStartandEndDate(this.IntegrationID).subscribe(res=>{
//       this.TransStartDt = this.datepipe.transform(res[0].TransStartDt, 'yyyy-MM-dd');
//       this.TransEndDt = this.datepipe.transform(res[0].TransEndDt, 'yyyy-MM-dd');
//       console.log(this.TransStartDt)
//       console.log( this.TransEndDt)

//   }, (profileStartandEndDateSubscriptionerr: HttpErrorResponse) => {
//       if (profileStartandEndDateSubscriptionerr.error instanceof Error) {
//           console.log('Client Sider Error.');
//       } else {
//           console.log('Server Sider Error.');
//       }
//   })
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

applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
}

setClickedRow(index: number, rowdata: any,buttonOperation :string ): void {    
    // if (index === this.selectedRow) {        
    //     this.selectedRow = 0;        
    // } else {     
        this.selectedRow = index;
        this.editFlag = 1;
        this.epicUpdateForm.controls['epicUNID'].setValue(rowdata.epicUNID);
        this.epicUpdateForm.controls['epicName'].setValue(rowdata.epicName);
        if(rowdata.startDate !== null ){
          this.epicUpdateForm.controls['startDate'].setValue(new Date(rowdata.startDate));
        }
        if(rowdata.endDate !== null ){
          this.epicUpdateForm.controls['endDate'].setValue(new Date(rowdata.endDate));
      }
      if(rowdata.replanStartDate !== null ){
          this.epicUpdateForm.controls['replanStartDate'].setValue(new Date(rowdata.replanStartDate));
      }else{
        this.epicUpdateForm.controls['replanStartDate'].setValue('');
      }
      if(rowdata.replanEndDate !== null ){
          this.epicUpdateForm.controls['replanEndDate'].setValue(new Date(rowdata.replanEndDate));
      }
      if(rowdata.actualStartDate !== null ){
          this.acsDateFlag = 1;
          this.epicUpdateForm.controls['actualStartDate'].setValue(new Date(rowdata.actualStartDate));
      }
      if(rowdata.actualEndDate !== null ){
          this.aceDateFlag = 1;
          this.epicUpdateForm.controls['actualEndDate'].setValue(new Date(rowdata.actualEndDate));
      }
       
      this.colorcode = rowdata.rag;
      this.epicUpdateForm.controls['rag'].setValue(rowdata.rag);
      this.epicUpdateForm.controls['Owner'].setValue(rowdata.owner);
      this.epicUpdateForm.controls['remarks'].setValue(rowdata.remarks);
      this.epicUpdateForm.controls['reason_for_not_green'].setValue(rowdata.reason_for_not_green);
      this.epicUpdateForm.controls['go_to_green_plan'].setValue(rowdata.green_plan);  
      if(buttonOperation === 'Edit') {
        this.epicUpdateForm.controls['operation'].setValue("update"); 
      }else{
        this.epicUpdateForm.controls['operation'].setValue("View"); 
      }
      
      this.epicUpdateForm.controls['baselineFlagValue'].setValue(this.baselineFlagValue); 
      this.epicUpdateForm.controls['baselinePageFlag'].setValue(this.baselinePageFlag); 
      
      if(rowdata.rag === 'Green'){
          this.isGreen = true;
      }
      else{
          this.isGreen = false;
      }

        //if ((this.deleteFlag === 1) || (this.deleteFlag === 0)) {
      if (this.deleteFlag === 1) {
          this.deleteFlag = null;
          this.editFlag = 0;
          this.selectedRow = 0;
          //this.resetFields();              
        }

        setTimeout(() => {
            if(buttonOperation === 'Edit') {
                this.editOpenDialog();
            }else{
                this.viewOpenDialog();
            }
            
        }, 100);
      
    // }
}
onSubmit() {

}

onBaseline() {
    if (confirm('Do you want to Baseline the Epic plan ?')) {
        this.sprinnerFlag = 0;
        this.baselineSubscription = this.service.epicBaseline({
            'IntegrationID': this.IntegrationID
        }).subscribe(res => {
            this.BaselineFlag = 1;
            if (res.insert === 'success') {
                this.baselinePageFlag = 1;
                this.dataSource.data = [];
                // this.incrementSpinner();

                setTimeout(() => {
                    if (this.progress > 100) {
                        this.progress = 0;
                        this.loadData()
                        this.toastr.success('Baselined Succcessfully', 'Epic')
                    }
                    
                }, 3000)
            } else {
                this.sprinnerFlag = 1;    
                this.toastr.error('Baselined Fail', 'Epic')
            }
        })
    }
}
onDelete(obj: any) {
    console.log('delete');
    if (confirm('Are you sure want to delete ?')) {
        this.sprinnerFlag = 0;
        console.log('delete' + obj.epicUNID);
        this.deleteSubscription = this.service.epicDelete(obj.epicUNID).subscribe(res => {
            if (res.Delete === 'success') {
                this.toastr.success('Deleted Succcessfully', 'Epic');
                this.loadData();
            } else {
                this.sprinnerFlag = 1;
                this.toastr.error(res.Delete, 'Epic');
                window.alert(res.Delete.join('\n'));
            }
        }, (errepicDelete: HttpErrorResponse) => {
            if (errepicDelete.error instanceof Error) {
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
    }
    //this.resetFields();

}
valuechange(TName: string) {
  //this.CDForm.controls['ContractDoc_Owneremail'].setValue('');
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

exportEpicAsPPT(){
if( this.dataSource.data.length === 0){
  alert("No Records exists for "+this.TransitionAccName+" Account.");
  return false;
 }else{
      var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');               
      this.service.exportEpicAsPPT(this.username,this.IntegrationID,'EpicWiseStatusReport-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
      window.open(this.baseURL+'/ExportEpicPPT/'+this.username+'/'+this.IntegrationID+'/'+'EpicWiseStatusReport-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
 }
}

resetFields() {
    this.editFlag = 0
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
ngOnDestroy() {
    this.loadparamsSubscription.unsubscribe();

    if (this.deleteFlag === 1) {
        this.deleteSubscription.unsubscribe();
    }
    if (this.BaselineFlag === 1) {
        this.baselineSubscription.unsubscribe();
    }
    
}

}