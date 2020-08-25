import { TailoredSprintBacklogService } from 'src/app/account_sprint-plan/tailored-sprint-backlog/tailored-sprint-backlog/tailored-sprint-backlog.service';

import { NavtntService,KeyValue } from './../../navtnt.service';
import { twbsSprtBlog } from './class/twbs.model';
import { Component, inject,ViewChild,OnInit,OnDestroy, ViewEncapsulation, ElementRef, NgZone, Renderer2  } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from "@angular/common/http";
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

export interface tailoredServiceBaklogpage {
  // MatPaginator Output 
  pageEvent: PageEvent;} 

@Component({
  selector: 'app-tailored-sprint-backlog',
  templateUrl: './tailored-sprint-backlog.component.html',
  styleUrls: ['./tailored-sprint-backlog.component.css']
})
export class TailoredSprintBacklogComponent implements OnInit,OnDestroy {
  private myJSON = '';  
  private ownerfield : string;
  private UpdateFlag: number; // check the delete subscription used or not
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
  private loadparamsSubscription: Subscription;
  private UpdateSubscription: Subscription;
  private BaselineSubscription : Subscription;
  private getSprintstatusSubscription : Subscription;
  private profileStartandEndDateSubscription : Subscription;
  private profileStartandEndDateSubscriptionFlag : number;
  private TransStartDt : any ;
  private TransEndDt : any;  
  private IntegrationID: string;
  private modifiedBy: string;
  private FlagHide: any;
  private localtwbs = [];
  private listarray: twbsSprtBlog[] = [];
  private tailoredSelectedValue;
  private progress = 1; //changed to 1 from 0
  private StatusKeywords : any;
  Employee_Name = [];
  Employee_Email: any = [];  
  private matchID : number;
  private emailcheck: any; 
  private Empnamecheck: any;
  private count: number; 
  private StatusKeywordsval: any;
  private localtwbsval: twbsSprtBlog[];
  private updateI : number;
  private ownerIDValidation: number;
  disableSelect = new FormControl(false);
  constructor(private twbsService: TailoredSprintBacklogService,
    private ngZone: NgZone, private renderer: Renderer2,
      private fb: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private toastr: ToastrService,
      private navigation: NavtntService,
      public datepipe: DatePipe, ) {
      this.tailoredSelectedValue = "SPRINT_BACKLOG"
      this.dataLength = 0;
      this.selectedRow = 0;
      this.UpdateFlag = 0;
      this.baseLineFlag=0;
      this.updateI = 0;
      this.profileStartandEndDateSubscriptionFlag =0;
      this.ownerIDValidation = 0;
      this.loadgetSprintstatusKeywords(); 
  }
  
  
  ngOnInit() {
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
            //   this.modifiedBy = "Ram"
              }
      });
              this.profileStartandEndDate();
              setTimeout(()=>{
                this.loadData();
              },1000)
     
              

  }
  
  loadgetSprintstatusKeywords(){
      this.getSprintstatusSubscription = this.twbsService.getSprintstatus().subscribe(res=>{          
          this.StatusKeywordsval = res;
      },(err:HttpErrorResponse)=>{
          if(err.error instanceof Error){
              console.log("Client Side Error")
          }else{
              console.log("server Side Error")
          }
      },()=>{
          this.StatusKeywords = this.StatusKeywordsval;
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
      }, 1000)
  }
  
  loadData() {
      this.loadparamsSubscription = this.twbsService.getTailoredSBforAccount(this.tailoredSelectedValue, this.IntegrationID).subscribe(res => {
          this.localtwbsval = res;
        //   this.progress = 0; // added
      }, (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
              console.log("Client Sider Error.");
          } else {
              console.log("Server Sider Error.");
          }
  
      }, () => {
          this.dataSource.data = this.localtwbsval;
          this.localtwbs = this.localtwbsval;
          this.dataLength = this.dataSource.data.length;
          this.listarray = [];
          for (var i = 0; i < this.localtwbs.length; i++) {
            //   this.listarray.push(this.localtwbs[i]);
            var obj = this.localtwbs[i];
            var today =  this.datepipe.transform(new Date(), 'yyyy-MM-dd');
            var endDT = this.datepipe.transform(new Date(this.localtwbs[i].Plan_Start_Date), 'yyyy-MM-dd');
            console.log(this.localtwbs[i].Plan_Start_Date)
            if( this.localtwbs[i].Plan_Start_Date !== '' || this.localtwbs[i].Plan_Start_Date !== null ){                  
                if (new Date(today) > new Date(endDT)) {
                    obj['colorFlag'] = '1';                    
                }else{
                    obj['colorFlag'] = '0';
                }
            }            
            this.listarray.push(obj);
            this.onScheduleValidation(i)
          }
          setTimeout(() => {
            this.progress = 0; // added
        }, 10);
          console.log(this.listarray)
      });
  }
  
  
  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  CommentsonKey(event,obj:any){
    for (var i = 0; i < this.listarray.length; i++) {
        if (this.listarray[i]['STANDARD_ACTIVITY_ID'] == obj.STANDARD_ACTIVITY_ID) {           
            this.listarray[i]['Comments'] = ''
            this.listarray[i]['Comments'] = event.srcElement.value
            console.log(this.listarray)
            break;
        }
    }    
}
  
  onUpdate() {      
    if (this.ownerIDValidation !== 0 ) {
        this.toastr.error('Validate the Owner Name with Bluepages using search button ')
        return false;
    }   
    for (var i = 0; i < this.listarray.length; i++) {
        if (this.listarray[i].Baselined === 0) {
         this.validateDates('Plan_Start_Date', 'Plan_End_Date', i, "G", 'Transition planned Start Date is greater than Transition planned End Date for '+this.listarray[i].STANDARD_ACTIVITY_NAME + "  Activity")
         if (this.updateI > this.listarray.length) {
          break;
         }
         this.validateDates('Plan_Start_Date', 'Plan_End_Date', i, "L", 'Transition planned End Date is less than Transition planned Start Date for '+this.listarray[i].STANDARD_ACTIVITY_NAME + "  Activity")
         if (this.updateI > this.listarray.length) {
          break;
         }
        } else {
         this.validateDates('Replan_Start_Date', 'RePlan_End_Date', i, "G", 'Transition Replan Start Date is greater than Transition Replan End Date for '+this.listarray[i].STANDARD_ACTIVITY_NAME + "  Activity")
         if (this.updateI > this.listarray.length) {
          break;
         }
         this.validateDates('Replan_Start_Date', 'RePlan_End_Date', i, "L", 'Transition Replan End Date is less than Transition Replan Start Date for '+this.listarray[i].STANDARD_ACTIVITY_NAME + "  Activity")
         if (this.updateI > this.listarray.length) {
          break;
         }
        }
        this.validateDates('Actual_Start_Date', 'Actual_End_Date', i, "G", 'Transition Actual Start Date is greater than Transition Actual End Date for '+this.listarray[i].STANDARD_ACTIVITY_NAME + "  Activity")
        if (this.updateI > this.listarray.length) {
         break;
        }
        this.validateDates('Actual_Start_Date', 'Actual_End_Date', i, "L", 'Transition Actual End Date is less than Transition Actual Start Date for '+this.listarray[i].STANDARD_ACTIVITY_NAME + "  Activity")
        if (this.updateI > this.listarray.length) {
         break;
        }
       }
      
       if (this.updateI > this.listarray.length) {
        return false;
       }
    
      this.UpdateSubscription = this.twbsService.putTailoredSpB(this.listarray).subscribe(res => {
          if (res[0].insert === "success") {
              this.dataSource.data = [];
              this.incrementSpinner();
              this.UpdateFlag = 1;
              this.timeOutfuntion();
            //   setTimeout(() => {
            //       if (this.progress > 100) {
            //           this.progress = 0;
            //           this.loadData()
            //           this.toastr.success('Inserted Succcessfully', 'Sprint Backlog')
            //       } else {
            //           this.toastr.error('Insert Fail', 'Sprint Backlog')
            //       }
            //   }, 1000)
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
      console.log(event)
      console.log(dateFieldName)
      for (var i = 0; i < this.listarray.length; i++) {
          if (this.listarray[i]['STANDARD_ACTIVITY_ID'] == obj.STANDARD_ACTIVITY_ID) {
              this.listarray[i][dateFieldName] = null;
              this.listarray[i][dateFieldName] = this.datepipe.transform(event.value, 'yyyy-MM-dd');
              if(dateFieldName ===  'Plan_Start_Date'){
                var today =  this.datepipe.transform(new Date(), 'yyyy-MM-dd');
                var endDT = this.datepipe.transform(new Date(this.listarray[i][dateFieldName]), 'yyyy-MM-dd');
                if (new Date(today) > new Date(endDT)) {                        
                    this.listarray[i]['colorFlag']='1'
                }else{
                    this.listarray[i]['colorFlag']='0'
                }
            }
              this.listarray[i]['STANDARD_ACTIVITY_LAST_UPDATED_BY'] = this.modifiedBy
              console.log(this.listarray)   
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
  }
  
  onScheduleValidation(ind) {      
    var todayDate =  this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    var endDT;          
    if(this.listarray[ind].RePlan_End_Date !== null ){         
        endDT = this.datepipe.transform(new Date(this.listarray[ind].RePlan_End_Date) , 'yyyy-MM-dd');    
    } else if (this.listarray[ind].Plan_End_Date !== null ){
        endDT = this.datepipe.transform(new Date(this.listarray[ind].Plan_End_Date) , 'yyyy-MM-dd');        
    }
    if (endDT < todayDate ){    //&&   this.listarray[ind]['status'] ===  'On Schedule') {        
         this.listarray[ind]['statusFlag'] = 1 ;  
    }else{
        this.listarray[ind]['statusFlag'] = 0 ;              
    } 
  }

  
  change(event, obj: any) {
      if (event.isUserInput) {          
          for (var i = 0; i < this.listarray.length; i++) {
              if (this.listarray[i]['STANDARD_ACTIVITY_ID'] == obj.STANDARD_ACTIVITY_ID) {
                  this.listarray[i]['ServiceStatus'] = event.source.value
                  console.log(this.listarray)
                  break;
              }
          }
          
      }
  }

  profileStartandEndDate(){
    this.profileStartandEndDateSubscriptionFlag =1
    this.profileStartandEndDateSubscription = this.twbsService.profileStartandEndDate(this.IntegrationID).subscribe(res=>{
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
  timeOutfuntion(){
    setTimeout(() => {
        if (this.progress > 100) {
            this.progress = 0;
            this.loadData()
            this.toastr.success('Inserted Succcessfully', 'Sprint Backlog')
        } else {
            this.toastr.error('Insert Fail', 'Sprint Backlog')
        }
    }, 1000)
  }
  onBaseline() {        
      this.BaselineSubscription = this.twbsService.putTailoredSpBBaseline(this.listarray).subscribe(res => {
          if (res[0].insert === "success") {
              this.dataSource.data = [];
              this.incrementSpinner();
              this.baseLineFlag = 1;
              this.timeOutfuntion()
            //   setTimeout(() => {
            //       if (this.progress > 100) {
            //           this.progress = 0;
            //           this.loadData()
            //           this.toastr.success('Inserted Succcessfully', 'Sprint Backlog')
            //       } else {
            //           this.toastr.error('Insert Fail', 'Sprint Backlog')
            //       }
            //   }, 1000)
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
    this.listarray[i]['Owner_Name'] = ''
    this.listarray[i]['Owner_Name'] =  this.ownerfield  
    console.log(this.listarray[i]['Owner_Name'])    
}

ownerlist(name,obj:any,ind:number){        
    console.log(name)
    this.listarray[ind]['Owner_Name'] = ''
    this.listarray[ind]['Owner_Name'] = name
    this.ownerIDValidation = 0;
    console.log(this.listarray)
    this.myJSON = null
    this.nameField.nativeElement.focus();
}
getEmployeeName(obj:any,index) {
    this.matchID = index;
    let Name : string;
    Name = this.ownerfield;

      this.Employee_Name = [];
      this.twbsService.getEmployeeDirectory(Name).subscribe(res => {
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
         this.setFocus('#TSprintBckOwnName'+this.matchID);
    });
    }

    setFocus (selector : string ) : void{
        this.ngZone.runOutsideAngular(()=>{
            setTimeout(() => {
                this.renderer.selectRootElement(selector).focus();
            }, 0);
        })
    }
    validateDates(startDate, endDate, ind, cond, errMessage) {
        var transitionDateErrMsg = "Dates should be between the transition dates["+this.TransStartDt+"-"+this.TransEndDt+"]"
        this.updateI = ind;
        if (this.listarray[ind][startDate] !== null && this.listarray[ind][endDate] !== null) {
         var startDT = this.datepipe.transform(new Date(this.listarray[ind][startDate]), 'yyyy-MM-dd');
         var endDT = this.datepipe.transform(new Date(this.listarray[ind][endDate]), 'yyyy-MM-dd');
         if (cond === "G") {
          if (startDT > endDT) {            
           this.updateI = this.listarray.length + 2;
           this.toastr.error(errMessage);
          }
         } else {
          if (endDT < startDT) {           
           this.updateI = this.listarray.length + 2;
           this.toastr.error(errMessage);
          }
         }
         if (startDT < this.TransStartDt ||  startDT >  this.TransEndDt) {            
            this.updateI = this.listarray.length + 2;
            this.toastr.error(transitionDateErrMsg);
         }else 
         if (endDT < this.TransStartDt ||  endDT >  this.TransEndDt) {                   
            this.updateI = this.listarray.length + 2;
            this.toastr.error(transitionDateErrMsg);
         }
        }
       }

  ngOnDestroy() {
      this.loadparamsSubscription.unsubscribe();  
      this.getSprintstatusSubscription.unsubscribe();  
      if (this.UpdateFlag === 1) {
          this.UpdateSubscription.unsubscribe();
      }
      if (this.baseLineFlag === 1) {
          this.BaselineSubscription.unsubscribe();
      }
      if (this.profileStartandEndDateSubscriptionFlag === 1 ) {
        this.profileStartandEndDateSubscription.unsubscribe();
    }
  }

}
