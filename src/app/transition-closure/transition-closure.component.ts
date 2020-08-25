import { TailoredSprintBacklogService } from 'src/app/account_sprint-plan/tailored-sprint-backlog/tailored-sprint-backlog/tailored-sprint-backlog.service';
import { Component, inject,ViewChild,OnInit,OnDestroy, ViewEncapsulation, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from "@angular/common/http";
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { NavtntService } from '../navtnt.service';
import { TransitionClosureService } from './transition-closure/transition-closure.service';

@Component({
  selector: 'app-transition-closure',
  templateUrl: './transition-closure.component.html',
  styleUrls: ['./transition-closure.component.css']
})
export class TransitionClosureComponent implements OnInit {

  private baseLineFlag : number;
  private displayedColumns: string[] = ['STANDARD_ACTIVITY_NAME',
  'MILESTONE_OR_TASK', 
  'P_Start_Date',
  'P_End_Date',
  'RP_Start_Date',
  'RP_End_Date',
  'A_Start_Date',
  'A_End_Date',
  'Status',
  'Owner_Name',                                           
  'Comments'];

@ViewChild(MatPaginator) paginator: MatPaginator; // Pagination
@ViewChild(MatSort) sort: MatSort;
@ViewChild('oName') nameField: ElementRef;
dataSource = new MatTableDataSource < any > ();
dataLength: number;
selectedRow: number;
private ownerIDValidation: number;
private loadparamsSubscription: Subscription;
private UpdateSubscription: Subscription;
private BaselineSubscription : Subscription;
private getSprintstatusSubscription : Subscription;
private profileStartandEndDateSubscription : Subscription;
private profileStartandEndDateSubscriptionFlag : number;
private TransStartDt : any ;
private TransEndDt : any; 
private IntegrationID: string;
private updateI : number;
  tailoredSelectedValue: string;
  UpdateFlag: number;
  username: any;
  FlagHide: string;
  TCStatusval: any;
  TCStatus: any;
  progress: number;
  TCSelectedValue: string;
  localTCSelval: any;
  localTCval: any;
  ownerfield: string;
  myJSON: any;
  matchID: any;
  Employee_Name: any[];
  count: number;
  emailcheck: any;
  Empnamecheck: any;
    
constructor(private _TCService: TransitionClosureService,
  private fb: FormBuilder,
  private activatedRoute: ActivatedRoute,
  private toastr: ToastrService,
  private navigation: NavtntService,
  public datepipe: DatePipe, ) {
  this.TCSelectedValue = "CLOSURE"
  this.dataLength = 0;
  this.selectedRow = 0;
  this.UpdateFlag = 0; 
  this.profileStartandEndDateSubscriptionFlag = 0 ; 
  this.updateI = 0;
  this.ownerIDValidation = 0;
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
          this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id')
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.profileStartandEndDate()
          this.loadData();
          this.loadgetSprintstatusKeywords();           
         }
  });
          this.profileStartandEndDate()
          this.loadData();
          this.loadgetSprintstatusKeywords(); 
  }

  loadgetSprintstatusKeywords(){
    this.getSprintstatusSubscription = this._TCService.getTransCloseStatus().subscribe(res=>{
        this.TCStatusval = res;
    },(err:HttpErrorResponse)=>{
        if(err.error instanceof Error){
            console.log("Client Side Error")
        }else{
            console.log("server Side Error")
        }
    },()=>{
        this.TCStatus = this.TCStatusval;
    })
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

loadData() {
  this.loadparamsSubscription = this._TCService.getTransCloseforAccount(this.TCSelectedValue, this.IntegrationID).subscribe(res => {
      this.localTCSelval = res;
  }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
          console.log("Client Sider Error.");
      } else {
          console.log("Server Sider Error.");
      }

  }, () => {
  
     this.dataSource.data = this.localTCSelval;  
      this.localTCval = this.localTCSelval;
      this.dataLength = this.dataSource.data.length;
      console.log(this.localTCval) 
      for (var i = 0; i < this.localTCval.length; i++) {
        var obj = this.localTCval[i];    
        obj['colorFlag']='0'    
        var today =  this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        var endDT = this.datepipe.transform(new Date(this.localTCval[i].Plan_Start_Date), 'yyyy-MM-dd');
        if( this.localTCval[i].Plan_Start_Date !== '' || this.localTCval[i].Plan_Start_Date !== null ){                  
            if (new Date(today) > new Date(endDT)) {
              obj['colorFlag']='1'                 
            }else{
              obj['colorFlag']='0'
            }
            this.localTCval[i] = obj;
        }
    }
     console.log(this.localTCval) 
  });
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

CommentsonKey(event,obj:any){
for (var i = 0; i < this.localTCval.length; i++) {
    if (this.localTCval[i]['STANDARD_ACTIVITY_ID'] == obj.STANDARD_ACTIVITY_ID) {           
        this.localTCval[i]['Comments'] = ''
        this.localTCval[i]['Comments'] = event.taregt.value
    }
}    
}

profileStartandEndDate(){
  this.profileStartandEndDateSubscriptionFlag =1
  this.profileStartandEndDateSubscription = this._TCService.profileStartandEndDate(this.IntegrationID).subscribe(res=>{
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
onUpdate() {   
  if (this.ownerIDValidation !== 0 ) {
    this.toastr.error('Validate the Owner Name with Bluepages using search button ')
    return false;
}   
  for (var i = 0; i < this.localTCval.length; i++) {
    if (this.localTCval[i].Baselined === 0) {
     this.validateDates('Plan_Start_Date', 'Plan_End_Date', i, "G", 'Transition planned Start Date is greater than Transition planned End Date for '+this.localTCval[i].STANDARD_ACTIVITY_NAME + "  Activity")
     if (this.updateI > this.localTCval.length) {
      break;
     }
     this.validateDates('Plan_Start_Date', 'Plan_End_Date', i, "L", 'Transition planned End Date is less than Transition planned Start Date for '+this.localTCval[i].STANDARD_ACTIVITY_NAME + "  Activity")
     if (this.updateI > this.localTCval.length) {
      break;
     }
    } else {
     this.validateDates('Replan_Start_Date', 'RePlan_End_Date', i, "G", 'Transition Replan Start Date is greater than Transition Replan End Date for '+this.localTCval[i].STANDARD_ACTIVITY_NAME + "  Activity")
     if (this.updateI > this.localTCval.length) {
      break;
     }
     this.validateDates('Replan_Start_Date', 'RePlan_End_Date', i, "L", 'Transition Replan End Date is less than Transition Replan Start Date for '+this.localTCval[i].STANDARD_ACTIVITY_NAME + "  Activity")
     if (this.updateI > this.localTCval.length) {
      break;
     }
    }
    this.validateDates('Actual_Start_Date', 'Actual_End_Date', i, "G", 'Transition Actual Start Date is greater than Transition Actual End Date for '+this.localTCval[i].STANDARD_ACTIVITY_NAME + "  Activity")
    if (this.updateI > this.localTCval.length) {
     break;
    }
    this.validateDates('Actual_Start_Date', 'Actual_End_Date', i, "L", 'Transition Actual End Date is less than Transition Actual Start Date for '+this.localTCval[i].STANDARD_ACTIVITY_NAME + "  Activity")
    if (this.updateI > this.localTCval.length) {
     break;
    }
   }
  
   if (this.updateI > this.localTCval.length) {
    return false;
   }

  
  this.UpdateSubscription = this._TCService.putTransClose(this.localTCval).subscribe(res => {
      if (res.insert === "success") {
          this.dataSource.data = [];
          this.incrementSpinner();
          this.UpdateFlag = 1;
          setTimeout(() => {
              if (this.progress > 100) {
                  this.progress = 0;
                  this.loadData()
                  this.toastr.success('Inserted Succcessfully', 'Transition Closure')
              } else {
                  this.toastr.error('Insert Fail', 'Transition Closure')
              }
          }, 3000)
      }
      console.log(res)
  }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
          console.log("Client Side Error.");
          this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com')
      } else {
          this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
      }
  })
}

updateDate(event, obj, dateFieldName) {
  for (var i = 0; i < this.localTCval.length; i++) {
      if (this.localTCval[i]['STANDARD_ACTIVITY_ID'] == obj.STANDARD_ACTIVITY_ID) {
          this.localTCval[i][dateFieldName] = null;
          this.localTCval[i][dateFieldName] = this.datepipe.transform(event.value, 'yyyy-MM-dd');
          if(dateFieldName ===  'Plan_Start_Date'){
            var today =  this.datepipe.transform(new Date(), 'yyyy-MM-dd');
            var endDT = this.datepipe.transform(new Date(this.localTCval[i][dateFieldName]), 'yyyy-MM-dd');
            if (new Date(today) > new Date(endDT)) {                        
                this.localTCval[i]['colorFlag']='1'
            }else{
                this.localTCval[i]['colorFlag']='0'
            }
        }          
          this.localTCval[i]['STANDARD_ACTIVITY_LAST_UPDATED_BY'] = this.username

          if (dateFieldName === 'Plan_Start_Date') {
            this.validateDates('Plan_Start_Date', 'Plan_End_Date', i, "G", 'Transition planned Start Date is greater than Transition planned End Date')
          }
          if (dateFieldName === 'Plan_End_Date') {
            this.validateDates('Plan_Start_Date', 'Plan_End_Date', i, "L", 'Transition planned End Date is less than Transition planned Start Date')
          }
          if (dateFieldName === 'Replan_Start_Date') {
            this.validateDates('Replan_Start_Date', 'RePlan_End_Date', i, "G", 'Transition Replan Start Date is greater than Transition Replan End Date')
          }
          if (dateFieldName === 'RePlan_End_Date') {
            this.validateDates('Replan_Start_Date', 'RePlan_End_Date', i, "L", 'Transition Replan End Date is less than Transition Replan Start Date')        
          }
          if (dateFieldName === 'Actual_Start_Date') {
            this.validateDates('Actual_Start_Date', 'Actual_End_Date', i, "G", 'Transition Actual Start Date is greater than Transition Actual End Date')        
          }
          if (dateFieldName === 'Actual_End_Date') {
            this.validateDates('Actual_Start_Date', 'Actual_End_Date', i, "L", 'Transition Actual End Date is less than Transition Actual Start Date')        
          }
         
      }
  }
  console.log(this.localTCval)
}

change(event, obj: any) {
  if (event.isUserInput) {          
      for (var i = 0; i < this.localTCval.length; i++) {
          if (this.localTCval[i]['STANDARD_ACTIVITY_ID'] == obj.STANDARD_ACTIVITY_ID) {
              this.localTCval[i]['ServiceStatus'] = event.target.value
          }
      }
      
  }
}

timeOutfuntion(){
  setTimeout(() => {
      if (this.progress > 100) {
          this.progress = 0;
          this.loadData()
          this.toastr.success('Inserted Succcessfully', 'Transition Closure')
      } else {
          this.toastr.error('Insert Fail', 'Transition Closure')
      }
  }, 3000)
}

onBaseline() {        
  this.BaselineSubscription = this._TCService.putTransCloseBaseline(this.localTCval).subscribe(res => {
      if (res.insert === "success") {
          this.dataSource.data = [];
          this.incrementSpinner();
          this.baseLineFlag = 1;
          this.timeOutfuntion()
      }
      console.log(res)
  }, (errputTailoredSpBBaseline: HttpErrorResponse) => {
      if (errputTailoredSpBBaseline.error instanceof Error) {
          console.log("Client Side Error.");
          this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com')
      } else {
          this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
      }
  })
}
updateOwner(event,i : number){  
  if(event.target.value === "" ){
      this.ownerIDValidation = 0 ;
  }else {
          this.ownerIDValidation = 1 ;
  }
  this.ownerfield  = '';
  this.ownerfield = event.target.value; 
  this.localTCval[i]['Owner_Name'] = ''
  this.localTCval[i]['Owner_Name'] =  this.ownerfield  
  console.log(this.localTCval[i]['Owner_Name'])    
}

ownerlist(name,obj:any,ind:number){        
  console.log(name)
  this.localTCval[ind]['Owner_Name'] = ''
  this.localTCval[ind]['Owner_Name'] = name
  this.ownerIDValidation = 0;
  console.log(this.localTCval)
  this.myJSON = null
  this.nameField.nativeElement.focus();
}

// updateOwner(event,i : number){
//   this.ownerfield  = '';
//   this.ownerfield = event.target.value;        
// }

// ownerlist(name,obj:any){
//   for (var i = 0; i < this.localTCval.length; i++) {
//       if (this.localTCval[i]['STANDARD_ACTIVITY_ID'] == obj.STANDARD_ACTIVITY_ID) {           
//           this.localTCval[i]['Owner_Name'] = ''
//           this.localTCval[i]['Owner_Name'] = name
//       }
//   }    
//   // this.selectedName = name
//   this.myJSON = null
//   this.nameField.nativeElement.focus();
// }

getEmployeeName(obj:any,index) {
  this.matchID = index;
  let Name : string;
  Name = this.ownerfield;

    this.Employee_Name = [];
    this._TCService.getEmployeeDirectory(Name).subscribe(res => {
    this.count = res.body.split('\n').length - 2;
    this.count = res.body.split('\n')[this.count].split(',')[1].split('=')[1];
      for ( let i = 0; i < this.count ; i++) {
        this.emailcheck = res.body.split('\n')[i * 69 + 22].split(':')[1];
        if ((this.emailcheck === '') || (this.emailcheck === undefined) || (this.emailcheck === null)) {
          this.emailcheck = 'No email ID in Bluepages';
        }
        this.Empnamecheck = res.body.split('\n')[i * 69 + 57].split(':')[1] + res.body.split('\n')[i * 69 + 59].split(':')[1];
        if ((this.Empnamecheck === '') || (this.Empnamecheck === undefined) || (this.Empnamecheck === null)) {
          this.Empnamecheck = res.body.split('\n')[ i * 69 + 12].split(': ')[1];
        }
        const item = {
          'name': res.body.split('\n')[ i * 69 + 12].split(': ')[1],
          'email': this.emailcheck,
          'Emp_Name' : this.Empnamecheck,
          'cnum' : res.body.split('\n')[i * 69 + 0].split(': ')[1],          
          'photo' : 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/' + res.body.split('\n')[i * 69 + 0].split(': ')[1]
        };
             this.Employee_Name.push(item);
      }
       this.myJSON = JSON.parse(JSON.stringify(this.Employee_Name));
  //    this.nameField.nativeElement.focus();
  });
  }
  validateDates(startDate, endDate, ind, cond, errMessage) {
    var transitionDateErrMsg = "Dates should be between the transition dates["+this.TransStartDt+"-"+this.TransEndDt+"]"
    this.updateI = ind;
    if (this.localTCval[ind][startDate] !== null && this.localTCval[ind][endDate] !== null) {
     var startDT = this.datepipe.transform(new Date(this.localTCval[ind][startDate]), 'yyyy-MM-dd');
     var endDT = this.datepipe.transform(new Date(this.localTCval[ind][endDate]), 'yyyy-MM-dd');
     if (cond === "G") {
      if (startDT > endDT) {            
       this.updateI = this.localTCval.length + 2;
       this.toastr.error(errMessage);
      }
     } else {
      if (endDT < startDT) {           
       this.updateI = this.localTCval.length + 2;
       this.toastr.error(errMessage);
      }
     }
     
     if (startDT < this.TransStartDt ||  startDT >  this.TransEndDt) {            
      this.updateI = this.localTCval.length + 2;
      this.toastr.error(transitionDateErrMsg);
   }else 
   if (endDT < this.TransStartDt ||  endDT >  this.TransEndDt) {                   
      this.updateI = this.localTCval.length + 2;
      this.toastr.error(transitionDateErrMsg);
   }
    }
   }


  ngOnDestroy() {

    if (this.profileStartandEndDateSubscriptionFlag === 1 ) {
      this.profileStartandEndDateSubscription.unsubscribe();
  }
}
}
