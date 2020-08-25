import { SprintLevelPlanService } from './../Transition-Sprint-Plan/sprint-level-plan/sprint-level-plan.service';
import { NavtntService,KeyValue } from './../../navtnt.service';
import { sprintLevelPlan } from './class/sprintLevelPlan.model';
import { inject,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource, MatRadioChange } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from "@angular/common/http";
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Component, OnInit, Input , ViewChild, ViewEncapsulation, ElementRef, NgZone, Renderer2 } from '@angular/core'; 
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
export interface tailoredServiceBaklogpage {
  // MatPaginator Output 
  pageEvent: PageEvent;} 
@Component({
  selector: 'app-sprint-level-plan',
  templateUrl: './sprint-level-plan.component.html',
  styleUrls: ['./sprint-level-plan.component.css']
})
export class SprintLevelPlanComponent implements OnInit, OnDestroy {

    private selectedValue: string;
    private username: any;
    private UpdateFlag: number; // check the delete subscription used or not
    private baseLineFlag: number;

    private displayedColumns: string[] = [
        'PHASE_NAME',
        'STANDARD_ACTIVITY_NAME',
        'MILESTONE_OR_TASK',
        'P_Start_Date',
        'P_End_Date',
        'RP_Start_Date',
        'RP_End_Date',
        'A_Start_Date',
        'A_End_Date',
        'Status',
        'Owner_Name',
        'Comments',
    ];
    @ViewChild(MatPaginator) paginator: MatPaginator; // Pagination
    @ViewChild('oName') nameField: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource < any > ();
    dataLength: number;
    selectedRow: number;
    private isExistValue: number;
    private isExist: number;
    private TaskApplicationLevelRAGRollupRAG : string
    private TaskSprintLevelRAGRollupRAG : string
    private loadparamsSubscription: Subscription;
    private loadparamsSubscriptionFlag: number;
    private UpdateSubscription: Subscription;
    private BaselineSubscription: Subscription;
    private getSprintstatusSubscription: Subscription;
    private getSprintstatusSubscriptionFlag : number;
    private getEpicSubscription: Subscription;
    private getEpicSubscriptionFlag : number;
    private getSprintSubscription: Subscription;
    private getSprintSubscriptionFlag : number;
    private accountExistCheckSubscription: Subscription;
    private accountExistCheckSubscriptionFlag : number;
    private getApplicationSubscription: Subscription;
    private getApplicationSubscriptionFlag: number;
    private getSTScopeSubscription: Subscription;
    private getSTScopeSubscriptionFlag: number;
    private saveSubscription: Subscription;
    private saveSubscriptionFlag : number;
    private profileStartandEndDateSubscription : Subscription;
    private profileStartandEndDateSubscriptionFlag : number;
    private IntegrationID: string;
    private modifiedBy: string;
    private FlagHide: any;
    private localtwbs = [];    
    private listarray: sprintLevelPlan[] = [];
    private tailoredSelectedValue;
    private progress = 0;
    private StatusKeywords: any;
    private StatusKeywords1: any;
    Employee_Name = [];
    Employee_Email: any = [];
    private myJSON = '';
    private count: number;
    private emailcheck: any;
    private Empnamecheck: any;
    private ownerfield: string;
    private selectedName: string
    private matchID: number;
    private epicKeywords1: any
    private epicKeywords: any
    private applicationkeywords: any;
    private applicationkeywords1: any;
    private STScopekeywords: any;
    private STScopekeywords1: any;
    private sprintKeywords: any;
    private sprintKeywords1: any;
    private estartdate: any;
    private eenddate: any;
    private erstartdate: any;
    private erenddate: any;
    private eastartdate: any;
    private eaenddate: any;
    private sstartdate: any;
    private enddate: any;
    private rsstartdate: any;
    private renddate: any;
    private asstartdate: any;
    private aenddate: any;
    private setsStartDate: any;
    private setEndDate: any;
    private scopeUNID: any;
    private sprintUNID: any
    private epicUNID: any;
    private AppUNID: any;
    private STUNID: any;    
    private accountExistFlag: number;
    private loadparamFlag: number;
    private applicationFlag: number;
    private param: string;
    private saveFlag: number;    
    private updateI : number;
    private TransStartDt : any ;
    private TransEndDt : any;
    RadioFlag: boolean;
    LevelRadioValue: any;
    Scope_Level= [];
    private ownerIDValidation: number;
    disableSelect = new FormControl(false);
  private applicationLEVEL: number;
  private springLEVEL: number;
 
  private selectedEPIC  :string;
  private selectedSprint  :string;
  private selectedApplication :string;
  private selectedSTScope  :string;
    constructor(private twbsService: SprintLevelPlanService,
      private ngZone: NgZone, private renderer: Renderer2,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private toastr: ToastrService,
        private navigation: NavtntService,
        public datepipe: DatePipe, ) {
        this.tailoredSelectedValue = "AT-PLAN/AT-LEARN/AT-PERFORM"
        this.dataLength = 0;
        this.selectedRow = 0;
        this.loadparamFlag = 0;
        this.applicationFlag = 0;
        this.AppUNID = "x";
        this.STUNID = "x";
        this.saveFlag = 0;   
        this.applicationLEVEL = 0;
        this.springLEVEL = 0  
        this.ownerIDValidation = 0;     
        //subscriptions flag
        this.loadparamsSubscriptionFlag = 0
        this.UpdateFlag = 0;
        this.baseLineFlag = 0;
        this.getSprintstatusSubscriptionFlag = 0
        this.getEpicSubscriptionFlag = 0;
        this.getSprintSubscriptionFlag = 0;
        this.accountExistCheckSubscriptionFlag = 0;
        this.getApplicationSubscriptionFlag = 0;
        this.saveSubscriptionFlag = 0
        this.updateI = 0;
        this.profileStartandEndDateSubscriptionFlag = 0
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
          this.modifiedBy = this.username
          this.RadioFlag= false
          this.twbsService.getScopeLvels().subscribe(Sres=>{ 
            this.Scope_Level=Sres;
          });
          this.loadgetSprintstatusKeywords();
          this.loadEpicKeywords();
          this.profileStartandEndDate();
         }
        });
       }
       profileStartandEndDate(){
        this.profileStartandEndDateSubscriptionFlag =1  
        this.profileStartandEndDateSubscription = this.twbsService.profileStartandEndDate(this.IntegrationID).subscribe(pres=>{  
            this.TransStartDt = this.datepipe.transform(pres[0].TransStartDt, 'yyyy-MM-dd');
            this.TransEndDt = this.datepipe.transform(pres[0].TransEndDt, 'yyyy-MM-dd');
        }, (profileStartandEndDateSubscriptionerr: HttpErrorResponse) => {
            if (profileStartandEndDateSubscriptionerr.error instanceof Error) {
                console.log('Client Sider Error.');
            } else {
                console.log('Server Sider Error.');
            }
        })
      }
    
       loadSpint(sprintarrary: any) {
         this.dataLength=0
         this.selectedApplication =null
         this.selectedSTScope=null
        this.sprintUNID = sprintarrary.sprintUNID
        this.scopeUNID = sprintarrary.Scope_UNID
        this.sstartdate = this.datepipe.transform(sprintarrary.startDate, 'yyyy-MM-dd');
        this.enddate = this.datepipe.transform(sprintarrary.endDate, 'yyyy-MM-dd');
        this.rsstartdate = this.datepipe.transform(sprintarrary.replanStartDate, 'yyyy-MM-dd');
        this.renddate = this.datepipe.transform(sprintarrary.replanEndDate, 'yyyy-MM-dd');
        this.asstartdate = this.datepipe.transform(sprintarrary.actualStartDate, 'yyyy-MM-dd');
        this.aenddate = this.datepipe.transform(sprintarrary.actualEndDate, 'yyyy-MM-dd');
        
        if(this.asstartdate !== null ){
          this.setsStartDate = this.asstartdate
        }else if (this.rsstartdate !== null){
          this.setsStartDate = this.rsstartdate
        }else{
          this.setsStartDate = this.sstartdate
        }
        
        if(this.asstartdate !== null &&  this.aenddate === null){
          if(this.eaenddate!=null){
            this.setEndDate  = this.eaenddate
          }else if (this.erenddate !== null){
            this.setEndDate  = this.erenddate
          }else if(this.eenddate !== null ){
            this.setEndDate  = this.eenddate
          }else{
            this.setEndDate  = this.TransEndDt
          }

        }
        else if( this.aenddate !== null){
          this.setEndDate =   this.aenddate;
        }else if (this.renddate !== null){
          this.setEndDate =  this.renddate;
        }else{
          this.setEndDate =  this.enddate;
        }
      
        if(this.LevelRadioValue === 'AT'){
          this.loadApplicationList();
        }else if(this.LevelRadioValue === 'ST'){
          this.loadSTScopeList();
        }       
        
        // this.accountExistCheck();
       }
       loadPlan() {
        this.dataSource.data = [];
        this.accountExistCheck();
       }
       loadApplicationList() {
        
        this.getApplicationSubscription = this.twbsService.getSprintApplication(this.sprintUNID,this.IntegrationID).subscribe(res => {
         this.getApplicationSubscriptionFlag = 1;
         this.applicationkeywords1 = res;
        }, (errgetSprintApplication: HttpErrorResponse) => {
         if (errgetSprintApplication.error instanceof Error) {
          console.log("Client Side Error")
         } else {
          console.log("server Side Error")
         }
        }, () => {
         this.applicationkeywords = this.applicationkeywords1
        })
       }
       loadApplication(App: any) {
        this.dataLength=0;
        this.AppUNID = App.AppUNID;
        }

        loadSTScopeList() {
        
          this.getSTScopeSubscription = this.twbsService.getSprintSTScope(this.sprintUNID,this.IntegrationID).subscribe(res => {
           this.getSTScopeSubscriptionFlag = 1;
           this.STScopekeywords1 = res;
          }, (errgetSprintApplication: HttpErrorResponse) => {
           if (errgetSprintApplication.error instanceof Error) {
            console.log("Client Side Error")
           } else {
            console.log("server Side Error")
           }
          }, () => {
           this.STScopekeywords = this.STScopekeywords1
          })
         }

         loadSTScope(STScopeID: any) {
          this.dataLength=0;
          this.STUNID = STScopeID.MasterSTInfoid;
          }

       earliestActualStartDate(){
        var  firstDate ;
        var secondDate ;
        let tempDate ;
        

        if (this.listarray.length === 1 ){
          tempDate =   this.datepipe.transform(new Date(this.listarray[0].Actual_End_Date));
        }else if(this.listarray.length > 1 ) {          
          for(var i =1;i<this.listarray.length;i++ ){
            tempDate = this.datepipe.transform(new Date(this.listarray[i-1].Actual_End_Date));
            secondDate = this.datepipe.transform(new Date(this.listarray[i].Actual_End_Date));

          }
        }

       

        for(var i =0 ; i<this.listarray.length;i++ ){
          if(tempDate === null || tempDate === '' || tempDate === "" || i+1 <= this.listarray.length){
            secondDate = this.datepipe.transform(new Date(this.listarray[i+1].Actual_End_Date)) ;
          }

          firstDate = this.datepipe.transform(new Date(this.listarray[i].Actual_End_Date)) ;
          for(var j = i+1 ; j<this.listarray.length;j++ ){
              secondDate = this.datepipe.transform(new Date(this.listarray[j].Actual_End_Date)) ;
              if ( new Date(firstDate) < new Date (secondDate) ){
                  tempDate =  new Date(firstDate);
              }else{
                tempDate =  new Date(secondDate);
              }
              break;
          }
        }

       }
       latestActualEndDate(){

       }

       RAGRollUPLogic(){
        let temp : number;
        temp =0;       
        let tempRAG = "";         
        let statusflags : number;        
     
          for(var i =0 ; i<this.listarray.length;i++ ){  
            statusflags = 0;               
          
            var loctoday = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
            var locendDT = this.datepipe.transform(new Date(this.listarray[i].Actual_End_Date), 'yyyy-MM-dd');
        
            if(this.listarray[i].Actual_End_Date !== null){
              if (new Date(loctoday) > new Date(locendDT)) {
                
                statusflags = 1;
               } else {
               
                statusflags = 0;
               }
              
                if(this.listarray[i]['ServiceStatus'] === 'Completed' || this.listarray[i]['ServiceStatus'] === 'On Schedule'  ){
                    temp = temp +1
                }else if(this.listarray[i]['ServiceStatus'] === 'Behind Schedule' ){
                  temp = temp +2
                }else if (this.listarray[i]['ServiceStatus'] === 'Not Started'){                
                  if(statusflags === 1) {                  
                    temp = temp +3
                  }else{                  
                    temp = temp +1
                  }
                }
            }
            
          }
          setTimeout(() => {
            let findRAGNumber : number;
            findRAGNumber=0;
            
            findRAGNumber = temp/this.listarray.length
         
            if(findRAGNumber <=1 ){
              tempRAG = "Green"
            }else if(findRAGNumber >1 && findRAGNumber <=2 ){
              tempRAG = "Amber"
            }else{
              tempRAG = "Red"
            }         
          }, 5);

          setTimeout(() => {
            if(this.springLEVEL === 1){
              this.TaskSprintLevelRAGRollupRAG =  tempRAG
            }else{
              this.TaskApplicationLevelRAGRollupRAG = tempRAG
            }
            
          }, 10);
       }

       loadEpicKeywords() {
        this.getEpicSubscription = this.twbsService.getEpicsName(this.IntegrationID).subscribe(res => {
         this.getEpicSubscriptionFlag = 1;
         this.epicKeywords1 = res;
        }, function(errgetEpickeywords: HttpErrorResponse) {
         if (errgetEpickeywords.error instanceof Error) {
          console.log("Client Side Error")
         } else {
          console.log("server Side Error")
         }
        }, () => {
         this.epicKeywords = this.epicKeywords1;
         
        })
       }
       loadgetSprintstatusKeywords() {
        this.getSprintstatusSubscription = this.twbsService.getSprintstatus().subscribe(res => {
         this.getSprintstatusSubscriptionFlag = 1;
         this.StatusKeywords1 = res;
        }, (errgetSprintstatus: HttpErrorResponse) => {
         if (errgetSprintstatus.error instanceof Error) {
          console.log("Client Side Error")
         } else {
          console.log("server Side Error")
         }
        }, () => {
         this.StatusKeywords = this.StatusKeywords1;
         
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
       loadData(param) {         
        this.loadparamsSubscription = this.twbsService.getTailoredSBforAccount(this.tailoredSelectedValue, this.IntegrationID, param, this.LevelRadioValue).subscribe(res => {
         this.localtwbs = res;
         this.loadparamsSubscriptionFlag = 1;
        }, (errgetTailoredSBforAccount: HttpErrorResponse) => {
         if (errgetTailoredSBforAccount.error instanceof Error) {
          console.log("Client Sider Error.");
         } else {
          console.log("Server Sider Error.");
         }
        }, () => {
         this.dataSource.data = this.localtwbs;
         
         var ScUNID='';
         this.dataLength = this.dataSource.data.length;
         this.listarray = [];
         for (var i = 0; i < this.localtwbs.length; i++) {
          this.localtwbs[i]['epicUNID'] = this.epicUNID;
          this.localtwbs[i]['sprintUNID'] = this.sprintUNID;       
          if(this.LevelRadioValue === 'AT'){
            ScUNID=this.AppUNID;
          }else if(this.LevelRadioValue === 'ST'){
            ScUNID=this.STUNID;
          }
          this.localtwbs[i]['Scope_UNID'] = ScUNID;
          this.localtwbs[i]['STANDARD_ACTIVITY_CREATED_BY'] = this.username
          this.localtwbs[i]['STANDARD_ACTIVITY_LAST_UPDATED_BY'] = this.username
          // this.listarray.push(this.localtwbs[i]);           
          var obj = this.localtwbs[i];
          var today = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
          var endDT = this.datepipe.transform(new Date(this.localtwbs[i].Plan_Start_Date), 'yyyy-MM-dd');
          if (this.localtwbs[i].Plan_Start_Date !== '' || this.localtwbs[i].Plan_Start_Date !== null) {
           if (new Date(today) > new Date(endDT)) {
            obj['colorFlag'] = '1';
           } else {
            obj['colorFlag'] = '0';
           }
          }
          this.listarray.push(obj);
         }
         
        });
       }
       loadSavedData(param) {

        this.loadparamsSubscription = this.twbsService.getTailoredSLPPforSavedAccount(this.IntegrationID, param).subscribe(res => {
                
          this.localtwbs = res;
         this.loadparamsSubscriptionFlag = 1;
        }, (errgetTailoredSLPPforSavedAccount: HttpErrorResponse) => {
         if (errgetTailoredSLPPforSavedAccount.error instanceof Error) {
          console.log("Client Sider Error.");
         } else {
          console.log("Server Sider Error.");
         }
        }, () => {
               
         this.dataSource.data = this.localtwbs;
         this.dataLength = this.dataSource.data.length;
         this.listarray = [];
         var ScUNID='';
         for (var i = 0; i < this.localtwbs.length; i++) {
          this.localtwbs[i]['epicUNID'] = this.epicUNID;
          this.localtwbs[i]['sprintUNID'] = this.sprintUNID;
          if(this.LevelRadioValue === 'AT'){
            ScUNID=this.AppUNID;
          }else if(this.LevelRadioValue === 'ST'){
            ScUNID=this.STUNID;
          }
          this.localtwbs[i]['Scope_UNID'] = ScUNID;
          if (this.localtwbs[i]['T_STANDARD_ACTIVITY_ID'] === null) {
           this.localtwbs[i]['STANDARD_ACTIVITY_CREATED_BY'] = this.username
           this.localtwbs[i]['STANDARD_ACTIVITY_LAST_UPDATED_BY'] = this.username
          }
       
          // this.listarray.push(this.localtwbs[i]);           
          var obj = this.localtwbs[i];
          var today = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
          var endDT = this.datepipe.transform(new Date(this.localtwbs[i].Plan_Start_Date), 'yyyy-MM-dd');
          if (this.localtwbs[i].Plan_Start_Date !== '' || this.localtwbs[i].Plan_Start_Date !== null) {
           if (new Date(today) > new Date(endDT)) {
            obj['colorFlag'] = '1';
           } else {
            obj['colorFlag'] = '0';
           }
          }
          this.listarray.push(obj);
          this.onScheduleValidation(i);
         }
        
        });
       }
       CommentsonKey(event, obj) {
        this.listarray[obj]['Comments'] = ''
        this.listarray[obj]['Comments'] = event.srcElement.value
       }
       applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
       }
       
       validateDates(startDate, endDate, ind, cond, errMessage) {
        this.updateI = ind;
        var transitionDateErrMsg = "Dates should be between the transition dates["+this.TransStartDt+"-"+this.TransEndDt+"]"
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
       timeOutfunction(){
        setTimeout(() => {
          this.localtwbs = [];
          this.listarray = [];
          this.accountExistCheck()
         }, 3000)
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
      //  this.RAGRollUPLogic();
       // return false;
        if (this.isExistValue === 0) {
         this.saveSubscription = this.twbsService.postTailoredWBSSB(this.listarray).subscribe(res => {
          this.saveSubscriptionFlag = 1;
          if (res[0].save === "success") {
           this.dataSource.data = [];
           this.incrementSpinner();
           this.saveFlag = 1;
           this.inserttimeout();
          //  setTimeout(() => {
          //   this.localtwbs = [];
          //   this.listarray = [];
          //   this.accountExistCheck()
          //  }, 3000)
          this.timeOutfunction();          }
         }, (errsaveappLevelSpPlanResult: HttpErrorResponse) => {
          if (errsaveappLevelSpPlanResult.error instanceof Error) {
           console.log("Client Side Error.");
           this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com')
          } else {
           this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com')
           console.log("Server Side Error.");
          }
         })
        } else {
         //update      
       
         this.UpdateSubscription = this.twbsService.putTailoredWBSSB(this.listarray).subscribe(res => {
          if (res[0].insert === "success") {
            this.dataSource.data = [];
           this.incrementSpinner();
           this.UpdateFlag = 1;           
           this.inserttimeout();
           this.timeOutfunction();
        
          }
         }, (errputappLevelSpPlanResult: HttpErrorResponse) => {
          if (errputappLevelSpPlanResult.error instanceof Error) {
           console.log("Client Side Error.");
           this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com')
          } else {
           this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com')
           console.log("Server Side Error.");
          }
         })
        }
       }
       
       inserttimeout() {
        setTimeout(() => {
         if (this.progress > 100) {
          this.progress = 0;
          // this.loadData(this)
          this.toastr.success('Inserted Succcessfully', 'Task Level - Sprint Execution Plan')
         } else {
          this.toastr.error('Insert Fail', 'Task Level - Sprint Execution Plan')
       
         }
        }, 3000)
       }
       
       updateDate(event, obj, dateFieldName) {
        let i = obj;
        this.listarray[i][dateFieldName] = null;
        this.listarray[i][dateFieldName] = this.datepipe.transform(event.value, 'yyyy-MM-dd');
        this.listarray[i]['STANDARD_ACTIVITY_LAST_UPDATED_BY'] = this.modifiedBy
        if (dateFieldName === 'Plan_Start_Date') {
         var today = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
         var endDT = this.datepipe.transform(new Date(this.listarray[i][dateFieldName]), 'yyyy-MM-dd');
         if (this.listarray[i]['Plan_Start_Date'] !== '' || this.listarray[i]['Plan_Start_Date'] !== null) {
          if (new Date(today) > new Date(endDT)) {
           this.listarray[i]['colorFlag'] = '1'
          } else {
           this.listarray[i]['colorFlag'] = '0'
          }
         }
        }
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
       loadSprintKeywords(Scope_EpicID: any) {
        this.dataLength=0
        this.selectedSprint=null;
        this.selectedApplication =null;
        this.selectedSTScope =null;
        this.estartdate = this.datepipe.transform(Scope_EpicID.startDate, 'yyyy-MM-dd');
        this.eenddate = this.datepipe.transform(Scope_EpicID.endDate, 'yyyy-MM-dd');
        this.erstartdate = this.datepipe.transform(Scope_EpicID.replanStartDate, 'yyyy-MM-dd');
        this.erenddate = this.datepipe.transform(Scope_EpicID.replanEndDate, 'yyyy-MM-dd');
        this.eastartdate = this.datepipe.transform(Scope_EpicID.actualStartDate, 'yyyy-MM-dd');
        this.eaenddate = this.datepipe.transform(Scope_EpicID.actualEndDate, 'yyyy-MM-dd');
        this.sstartdate = "";
        this.enddate = "";
        this.scopeUNID = Scope_EpicID.Scope_UNID
        this.epicUNID = Scope_EpicID.epicUNID
        this.sprintUNID = '';
      
        this.getSprintSubscription = this.twbsService.getSprintNamesData(this.IntegrationID, Scope_EpicID.epicUNID,this.LevelRadioValue).subscribe(res => {
         this.getSprintSubscriptionFlag = 1;
         this.sprintKeywords1 = res;
        }, (errgetSprintkeywords: HttpErrorResponse) => {
         if (errgetSprintkeywords.error instanceof Error) {
          console.log("Client Side Error")
         } else {
          console.log("server Side Error")
         }
        }, () => {
         this.sprintKeywords = this.sprintKeywords1;
        
        })
       }
       change(event, obj) {
        if (event.isUserInput) {
         this.listarray[obj]['ServiceStatus'] = event.source.value
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
    
    ownerlist(name,ind:number){        
              this.listarray[ind]['Owner_Name'] = ''
        this.listarray[ind]['Owner_Name'] = name
        this.ownerIDValidation = 0;
               this.myJSON = null
        this.nameField.nativeElement.focus();
    }       
    
    
    getEmployeeName(obj: any, index) {
        this.matchID = index;
        let Name: string;
        Name = this.ownerfield;
       
        this.Employee_Name = [];
        this.twbsService.getEmployeeDirectory(Name).subscribe(res => {
         this.count = res.body.split('\n').length - 2;
         this.count = res.body.split('\n')[this.count].split(',')[1].split('=')[1];
         for (let i = 0; i < this.count; i++) {
          this.emailcheck = res.body.split('\n')[i * 69 + 22].split(':')[1];
          if ((this.emailcheck === '') || (this.emailcheck === undefined) || (this.emailcheck === null)) {
           this.emailcheck = 'No email ID in Bluepages';
          }
          this.Empnamecheck = res.body.split('\n')[i * 69 + 57].split(':')[1] + res.body.split('\n')[i * 69 + 59].split(':')[1];
          if ((this.Empnamecheck === '') || (this.Empnamecheck === undefined) || (this.Empnamecheck === null)) {
           this.Empnamecheck = res.body.split('\n')[i * 69 + 12].split(': ')[1];
          }
          const item = {
           'name': res.body.split('\n')[i * 69 + 12].split(': ')[1],
           'email': this.emailcheck,
           'Emp_Name': this.Empnamecheck,
           'cnum': res.body.split('\n')[i * 69 + 0].split(': ')[1],
           'photo': 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/' + res.body.split('\n')[i * 69 + 0].split(': ')[1]
          };
          this.Employee_Name.push(item);
         }
         this.myJSON = JSON.parse(JSON.stringify(this.Employee_Name));
         //    this.nameField.nativeElement.focus();
         this.setFocus('#SLPOName'+this.matchID);
        });
       }

       setFocus (selector : string ) : void{
        this.ngZone.runOutsideAngular(()=>{
            setTimeout(() => {
                this.renderer.selectRootElement(selector).focus();
            }, 0);
        })
    }
       onBaseline() {    
        if (confirm('Do you want to Baseline the Scope Stream Task Level Tracking plan ?')) {  
            var BaselineUpdateFlag = 0;
              for (var i = 0 ;i < this.listarray.length ; i++ ){
                  if ((this.listarray[i]['Plan_Start_Date'] === "" ||  this.listarray[i]['Plan_Start_Date'] === null)){
                      BaselineUpdateFlag = 1;
                  }
                  if( (this.listarray[i]['Plan_End_Date'] === "" ||  this.listarray[i]['Plan_End_Date'] === null)){
                      BaselineUpdateFlag = 1;
                  }
              }       
              if (BaselineUpdateFlag === 1 ){       
                      this.toastr.error("Planned Start and End dates cannot be blank for Baselining the plan","Baseline")
              }else{       
                  this.onBaselineUpdate();
              }
        }
    } 
  
    onBaselineUpdate() {
        
        this.BaselineSubscription = this.twbsService.putTailoredSBBaseline(this.listarray).subscribe(res => {
         if (res[0].insert === "success") {
          this.dataSource.data = [];

          this.baseLineFlag = 1;
          this.onUpdate();
        
         }
         }, (errputTailoredSBBaseline: HttpErrorResponse) => {
         if (errputTailoredSBBaseline.error instanceof Error) {
          console.log("Client Side Error.");
          this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com')
         } else {
          this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
         }
        })
       }

OnchangeRadio(event: MatRadioChange){
      
        this.LevelRadioValue = event.value;
         if (event.value !== '') {
             this.RadioFlag = true;
         }
         this.dataLength=0
         this.selectedEPIC =null
         this.selectedSprint =null
         this.selectedApplication =null
         this.selectedSTScope =null


         this.applicationkeywords =[];
         this.sprintKeywords  =[];
       if(event.value=== 'AT'){
        this.tailoredSelectedValue = "AT-PLAN/AT-LEARN/AT-PERFORM"
       
       }else if(event.value=== 'ST'){
        this.tailoredSelectedValue = "ST-PLAN/ST-DEFINE/ST-IMPLEMENT^ST-HANDOVER"
            
       }    
      }
      
       accountExistCheck() {
console.log(this.STUNID)
        var ScUNID='';

        if(this.LevelRadioValue === 'AT'){
          ScUNID=this.AppUNID;
        }else if(this.LevelRadioValue === 'ST'){
          ScUNID=this.STUNID;
        }

        this.accountExistCheckSubscription = this.twbsService.getaccountExistCheck(this.IntegrationID, this.epicUNID, this.sprintUNID, ScUNID).subscribe(res => {
       
         this.accountExistCheckSubscriptionFlag = 0;
         this.accountExistFlag = 1;
         this.isExist = res[0].exist;
        }, (errgetaccountExistCheck: HttpErrorResponse) => {
         if (errgetaccountExistCheck.error instanceof Error) {
          console.log("Client Side Error")
         } else {
          console.log("server Side Error")
         }
        }, () => {
         this.isExistValue = this.isExist
         console.log("this.isExistValue"+ this.isExistValue)
         if (this.isExistValue === 0) {
          this.loadData("0/0/0");
         } else {
          //  this.loadSavedData();          
          console.log("this.epicUNID - "+this.epicUNID + " this.sprintUNID -  "+this.sprintUNID +" this.AppUNID - "+ScUNID+" this.LevelRadioValue - "+this.LevelRadioValue)
          this.param = this.epicUNID + "/" + this.sprintUNID + "/" + ScUNID + "/" + this.LevelRadioValue
          console.log(this.param)
          this.loadSavedData(this.param);
         }
       
        })
       }
       ngOnDestroy() {
        if (this.loadparamsSubscriptionFlag === 1) {
         this.loadparamsSubscription.unsubscribe();
        }
        if (this.UpdateFlag === 1) {
         this.UpdateSubscription.unsubscribe();
        }
        if (this.baseLineFlag === 1) {
         this.BaselineSubscription.unsubscribe();
        }
        if (this.getSprintstatusSubscriptionFlag === 1) {
         this.getSprintstatusSubscription.unsubscribe();
        }
        if (this.getEpicSubscriptionFlag === 1) {
         this.getEpicSubscription.unsubscribe();
        }
        if (this.getSprintSubscriptionFlag === 1) {
         this.getSprintSubscription.unsubscribe();
        }
        if (this.accountExistCheckSubscriptionFlag === 1) {
         this.accountExistCheckSubscription.unsubscribe();
        }
        if (this.getApplicationSubscriptionFlag === 1) {
         this.getApplicationSubscription.unsubscribe();
        }
        if (this.getSTScopeSubscriptionFlag === 1) {
          this.getSTScopeSubscription.unsubscribe();
        }        
        if (this.saveSubscriptionFlag === 1) {
         this.saveSubscription.unsubscribe();
        }
        if(this.profileStartandEndDateSubscriptionFlag === 1) {
          this.profileStartandEndDateSubscription.unsubscribe();
        }
       }
}
