import { SprintPlanApplnLevelService } from 'src/app/account_sprint-plan/sprint-plan-appln-level/sprint-plan-appln-level/sprint-plan-appln-level.service';
import { NavtntService,KeyValue } from './../../navtnt.service';
import { TrnPlanApplnLevel } from './class/TrnPlanApplnLevel.model';
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
import { Component, OnInit, Input , ViewChild, ViewEncapsulation, ElementRef, NgZone, Renderer2   } from '@angular/core'; 
import { environment } from 'src/environments/environment';

export interface tailoredServiceBaklogpage {
  // MatPaginator Output 
  pageEvent: PageEvent;} 
@Component({
  selector: 'app-sprint-plan-appln-level',
  templateUrl: './sprint-plan-appln-level.component.html',
  styleUrls: ['./sprint-plan-appln-level.component.css']
})
export class SprintPlanApplnLevelComponent implements OnInit, OnDestroy {  
  private scopeUNID: any;
  private sprintUNID: any
  private epicUNID: any;
  private sprintKeywords: any;
  private sprintKeywords1: any;
  private username: any;
  private fieldPress: string;
  private isExistValue: number;
  private isExist: number;
  private UpdateFlag: number; // check the delete subscription used or not
  private baseLineFlag : number;
  private updateI : number;
  baseURL = environment.baseUrl
  TransitionAccName: any;
  
  @ViewChild(MatPaginator) paginator: MatPaginator; // Pagination
  @ViewChild('oName') nameField: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
    dataSource = new MatTableDataSource < any > ();
  dataLength: number;
  selectedRow: number;
  selectedEPIC: String;
  private epicKeywords1 :any
  private epicKeywords :any
  private getEpicSubscription : Subscription;
  private loadparamsSubscription: Subscription;
  private UpdateSubscription: Subscription;
  private BaselineSubscription : Subscription;
  private getSprintstatusSubscription : Subscription;
  private accountExistCheckSubscription : Subscription;
  private getSprintSubscription : Subscription;
  private saveSubscription : Subscription;
  private profileStartandEndDateSubscription : Subscription;
  private profileStartandEndDateSubscriptionFlag : number;
  private IntegrationID: string;
  private modifiedBy: string;
  private FlagHide: any;
  private localtwbs = [];
  private sprintDates = [];
  private listarray: TrnPlanApplnLevel[] = [];
  private tailoredSelectedValue;
  private progress = 0;
  private StatusKeywords : any;
  private StatusKeywords1 : any;
  Employee_Name = [];
  Employee_Email: any = [];   
  private myJSON = '';   
  private count: number; 
  private emailcheck: any; 
  private Empnamecheck: any;
  private ownerfield : string;
  private selectedName : string
  private matchID : number;
  private saveFlag:number;
  private epicFlag : number;
  private sprintFlag : number;  
  private sprintstatusFlag : number;
  private accountExistFlag : number;
  private loadparamFlag : number;
  private selectedEpic :string;
  private estartdate : any;
  private eenddate : any;
  private erstartdate: any;
  private erenddate: any;
  private eastartdate: any;
  private eaenddate: any;
  private sstartdate : any;
  private setartdate : any;
  private sprintarraryValue =[];
  private TransStartDt : any ;
  private TransEndDt : any;
  private ownerIDValidation: number;
  disableSelect = new FormControl(false);
    RadioFlag: boolean;
    LevelRadioValue: any;
    displayedColumns: string[];
    private Levelarray = [];
    Scope_Level= [];
    selectedSprint: any;
  constructor(private SprintPlanApplnLevelService: SprintPlanApplnLevelService,
    private ngZone: NgZone, private renderer: Renderer2,
      private fb: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private toastr: ToastrService,
      private navigation: NavtntService,
      public datepipe: DatePipe, ) {
      this.tailoredSelectedValue = "SERVICE_BACKLOG"
      this.dataLength = 0;
      this.selectedRow = 0;
      this.UpdateFlag = 0;
      this.baseLineFlag=0;
      this.accountExistFlag = 0;
      this.sprintstatusFlag=0
      this.fieldPress="No";
      this.updateI = 0;
      this.profileStartandEndDateSubscriptionFlag = 0;
      this.ownerIDValidation = 0;
  }
 
  setFocus (selector : string ) : void{
      this.ngZone.runOutsideAngular(()=>{
          setTimeout(() => {
              this.renderer.selectRootElement(selector).focus();
          }, 0);
      })
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

              this.SprintPlanApplnLevelService.getScopeLvels().subscribe(Sres=>{ 
                this.Scope_Level=Sres;
              });

              this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id')
              this.dataSource.sort = this.sort;
              this.dataSource.paginator = this.paginator;
              this.modifiedBy = this.username
              this.saveFlag =0;
              this.epicFlag =0;
              this.sprintFlag = 0;
              this.loadparamFlag =0
              this.RadioFlag =false;
              this.profileStartandEndDate();        
              this.loadEpicKeywords();
            //    this.accountExistCheck();             
              this.loadgetSprintstatusKeywords();   
              this.getApplicationTaskLevelRecordExistFlag();
            }
      });  
  }
  getApplicationTaskLevelRecordExistFlag(){

  }
  getStartDate(){

  }

  loadSpint(sprintarrary:any){   
    this.sprintUNID =sprintarrary.sprintUNID
    this.scopeUNID =sprintarrary.Scope_UNID
    this.sprintarraryValue = [];
    this.sprintarraryValue.push(sprintarrary)
    this.sstartdate = this.datepipe.transform(sprintarrary.startDate, 'yyyy-MM-dd');
    this.setartdate = this.datepipe.transform(sprintarrary.endDate, 'yyyy-MM-dd');
   
    this.accountExistCheck();
  }
  accountExistCheck(){   
    this.accountExistCheckSubscription = this.SprintPlanApplnLevelService.getaccountExistCheck(this.IntegrationID,this.epicUNID,this.sprintUNID).subscribe(res=>{
        this.accountExistFlag = 1;  
        this.isExist = res[0] .exist;
    },(errgetaccountExistCheck:HttpErrorResponse)=>{
        if(errgetaccountExistCheck.error instanceof Error){
            console.log("Client Side Error")
        }else{
            console.log("server Side Error")        
        }
    },()=>{
        this.isExistValue = this.isExist
        if(this.isExistValue === 0){
            this.loadData();        
        }else{
            this.loadSavedData();
        }
        
    })
  }

  loadgetSprintstatusKeywords(){
      this.getSprintstatusSubscription = this.SprintPlanApplnLevelService.getSprintstatus().subscribe(res=>{
          this.StatusKeywords1 = res;
          this.sprintstatusFlag =1;
      },(errgetSprintstatus:HttpErrorResponse)=>{
          if(errgetSprintstatus.error instanceof Error){
              console.log("Client Side Error")
          }else{
              console.log("server Side Error")
          }
      },()=>{
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
  
  loadSavedData(){    
    this.listarray = [];
    this.localtwbs = [];  
    this.sprintDates = [];
    this.loadparamsSubscription = this.SprintPlanApplnLevelService.getappLevelSpPlanResultFromSaveLocation(this.IntegrationID,this.epicUNID,this.sprintUNID,this.LevelRadioValue).subscribe(res => {
        this.loadparamFlag = 1;
        this.localtwbs = res;          
    }, (errgetappLevelSpPlanResultFromSaveLocation: HttpErrorResponse) => {
        if (errgetappLevelSpPlanResultFromSaveLocation.error instanceof Error) {
            console.log("Client Sider Error.");
        } else {
            console.log("Server Sider Error.");
        }  
    },()=>{
        for (var i = 0; i < this.localtwbs.length; i++) {                     
            //this.listarray.push(this.localtwbs[i] );
                var obj = this.localtwbs[i];
                var today =  this.datepipe.transform(new Date(), 'yyyy-MM-dd');
                var endDT = this.datepipe.transform(new Date(this.localtwbs[i].Plan_Start_Date), 'yyyy-MM-dd');
               
                if( this.localtwbs[i].Plan_Start_Date !== '' || this.localtwbs[i].Plan_Start_Date !== null ){                  
                    if (new Date(today) > new Date(endDT)) {
                        obj['colorFlag'] = '1';                    
                    }else{
                        obj['colorFlag'] = '0';
                    }
                }   
                if(this.localtwbs[i].DinsertFlag === null){
                    obj["createdBy"]=this.username
                    obj["modifiedBy"]= this.username
                }
                
                this.listarray.push(obj);
                this.datePush(obj); 
                this.onScheduleValidation(i);
                // this.getStartDate(); 
                this.getApplicationTaskLevelRecordExistFlag();
            
          }                   
        this.dataSource.data = this.listarray;        
        this.dataLength = this.dataSource.data.length;
    })

    }

  loadData() {
  this.dataSource.data = [];  
  this.listarray = [];
  this.localtwbs = [];
  this.sprintDates = [];
  this.Levelarray=[];
  this.dataLength=0;  
  let filterval: string;
  let filtervalAT: string;

  if(this.LevelRadioValue ==='AT'){
    filterval = null;
    filtervalAT = 'AT';
  }else if(this.LevelRadioValue ==='ST'){
    filterval = 'ST';
    filtervalAT = 'ST';
  }else if(this.LevelRadioValue ==='Others'){
    filterval = 'Others';
    filtervalAT = 'Others';
  }

   this.loadparamsSubscription = this.SprintPlanApplnLevelService.getappLevelSpPlanResult(this.IntegrationID,this.epicUNID,this.sprintUNID,this.LevelRadioValue).subscribe(res => {
           this.localtwbs = res;     

      }, (errgetSprintScopeDataResult: HttpErrorResponse) => {
          if (errgetSprintScopeDataResult.error instanceof Error) {
              console.log("Client Sider Error.");
          } else {
              console.log("Server Sider Error.");
          }  
      }, () => {         
        
          for (var i = 0; i < this.localtwbs.length; i++) {
            var obj =  this.localtwbs[i]     
            obj["AppLevelSPUNID"]=""                            
            obj["Plan_Start_Date"]=""                
            obj["Plan_End_Date"]=""                
            obj["Replan_Start_Date"]=""                
            obj["RePlan_End_Date"]=""                
            obj["Actual_Start_Date"]=""                
            obj["Actual_End_Date"]="" 
            obj["Owner_Name"]="" 
            obj["psCompleted_per"]=0
            obj["asCompleted_per"]=0               
            obj["sch_Var"]=0         
            obj["Baselined"]=0         
            obj["status"]=""                
            obj["ktSummary"]=""                
            obj["Remarks"]=""                           
            obj["createdBy"]=this.username
            obj["modifiedBy"]= this.username
            obj['colorFlag'] = '0';
            obj["Reason_Not_Green"]=""                
            obj["goto_Green"]=""   
                
            this.listarray.push(obj);            
            this.datePush(obj);              
          }                    
          this.dataSource.data = this.listarray;        
          this.dataLength = this.dataSource.data.length;
      });
  }
  

  profileStartandEndDate(){
    this.profileStartandEndDateSubscriptionFlag =1  
    this.profileStartandEndDateSubscription = this.SprintPlanApplnLevelService.profileStartandEndDate(this.IntegrationID).subscribe(pres=>{  
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

  datePush(obj : any){
    var obj1=[];      
    for (var sa=0;sa< this.sprintarraryValue.length;sa++){
        if(this.sprintarraryValue[sa].sprintUNID === obj.sprintUNID ){       
             if(this.sprintarraryValue[sa].actualStartDate !== null ){
                obj1["starDate"] =this.sprintarraryValue[sa].actualStartDate
              }else if (this.sprintarraryValue[sa].replanStartDate !== null){
                obj1["starDate"] =this.sprintarraryValue[sa].replanStartDate
              }else{
                obj1["starDate"] =this.sprintarraryValue[sa].startDate
              }
            
             
            if(this.sprintarraryValue[sa].actualStartDate !== null && this.sprintarraryValue[sa].actualEndDate === null){                
              
                if(this.eaenddate!=null){                  
                    obj1["endDate"]  = this.eaenddate
                  }else if (this.erenddate !== null){                    
                    obj1["endDate"]  = this.erenddate
                  }else if(this.eenddate !== null ){                   
                    obj1["endDate"]  = this.eenddate
                  }else{                   
                    obj1["endDate"]  = this.TransEndDt
                  }                
            }
            else if(this.sprintarraryValue[sa].actualEndDate !== null){
                obj1["endDate"] =this.sprintarraryValue[sa].actualEndDate
            }else if (this.sprintarraryValue[sa].replanEndDate !== null){
                obj1["endDate"] =this.sprintarraryValue[sa].replanEndDate                    
            }else{
                obj1["endDate"] =this.sprintarraryValue[sa].endDate                    
            }           
           
            break;
        }
    }
    this.sprintDates.push(obj1)
  }
  loadEpicKeywords(){
    this.getEpicSubscription = this.SprintPlanApplnLevelService.getEpicsName(this.IntegrationID).subscribe(res=>{
        this.epicKeywords1 = res;
        this.epicFlag = 1;
    },function(errgetEpickeywords:HttpErrorResponse){
        if(errgetEpickeywords.error instanceof Error){
            console.log("Client Side Error")
        }else{
            console.log("server Side Error")
        }
    },()=>{
         this.epicKeywords = this.epicKeywords1;
    })
  }

  loadSprintKeywords(Scope_EpicID: any){
    this.estartdate = this.datepipe.transform(Scope_EpicID.startDate, 'yyyy-MM-dd');
    this.eenddate = this.datepipe.transform(Scope_EpicID.endDate, 'yyyy-MM-dd');
    this.erstartdate = this.datepipe.transform(Scope_EpicID.replanStartDate, 'yyyy-MM-dd');
    this.erenddate = this.datepipe.transform(Scope_EpicID.replanEndDate, 'yyyy-MM-dd');
    this.eastartdate = this.datepipe.transform(Scope_EpicID.actualStartDate, 'yyyy-MM-dd');
    this.eaenddate = this.datepipe.transform(Scope_EpicID.actualEndDate, 'yyyy-MM-dd');
    this.sstartdate = "";
    this.setartdate = "" ;
    this.scopeUNID =Scope_EpicID.Scope_UNID 
    this.epicUNID = Scope_EpicID.epicUNID
    this.sprintUNID = '';    
    this.sprintKeywords = [];   
    
 
    this.getSprintSubscription = this.SprintPlanApplnLevelService.getSprintNamesData(this.IntegrationID,Scope_EpicID.epicUNID,this.LevelRadioValue).subscribe(res=>{
        this.sprintKeywords1 = res;
        
    },(errgetSprintkeywords:HttpErrorResponse)=>{
        if(errgetSprintkeywords.error instanceof Error){
            console.log("Client Side Error")
        }else{
            console.log("server Side Error1")
        }
    },()=>{
        this.sprintKeywords = this.sprintKeywords1;
        this.sprintarraryValue = this.sprintKeywords
    
    })
    this.accountExistCheck()
  }

  OnchangeRadio(event: MatRadioChange){
      
  this.LevelRadioValue = event.value;
   if (event.value !== '') {
       this.RadioFlag = true;
   }
   this.selectedEPIC =null
   this.selectedSprint =null
   this.dataSource.data = [];  
   this.listarray = [];
   this.localtwbs = [];
//    this.sprintDates = [];
  // this.sprintarraryValue = [];
  this.estartdate = "";
  this.eenddate = "";
  this.erstartdate = "";
  this.erenddate = "";
  this.eastartdate = "";
  this.eaenddate = "";
  this.sstartdate = "";
  this.setartdate = "" ;
   this.Levelarray=[];
   this.dataLength=0;  
   
//   this.loadSprintKeywords("");
   if(event.value=== 'AT'){
     this.displayedColumns = [
        'EpicName',
        'Sprint',
        'AppID',
        'AppName',                                         
        'P_Start_Date',
        'P_End_Date',
        'RP_Start_Date',
        'RP_End_Date',
        'A_Start_Date',
        'A_End_Date',  
        'Status',
        'Owner_Name',                                      
        'psCompleted_per',
        'asCompleted_per',
        'sch_Var',
        'ktSummary',
        'Remarks',
        'Reason_Not_Green',
        'goto_Green'
     ];
    }else if(event.value=== 'ST'){
     this.displayedColumns = [
            'EpicName',
            'Sprint',
            'STScope',                                                 
            'P_Start_Date',
            'P_End_Date',
            'RP_Start_Date',
            'RP_End_Date',
            'A_Start_Date',
            'A_End_Date',  
            'Status',
            'Owner_Name',                                      
            'psCompleted_per',
            'asCompleted_per',
            'sch_Var',
            'ktSummary',
            'Remarks',
            'Reason_Not_Green',
            'goto_Green'
     ];
    }else if(event.value=== 'Others'){
      this.displayedColumns = [
            'EpicName',
            'Sprint',
            'BacklogActivity',                                        
            'P_Start_Date',
            'P_End_Date',
            'RP_Start_Date',
            'RP_End_Date',
            'A_Start_Date',
            'A_End_Date',  
            'Status',
            'Owner_Name',                                      
            'psCompleted_per',
            'asCompleted_per',
            'sch_Var',
            'ktSummary',
            'Remarks',
            'Reason_Not_Green',
            'goto_Green'
      ];     
    }    
}


  textUpdate(fldValue,ind,fldName:string){
  
        this.fieldPress="No"
        this.listarray[ind][fldName] = fldValue.target.value
        this.listarray[ind]['modifiedBy'] = this.username;       
    
        if (fldName === 'psCompleted_per' || fldName === 'asCompleted_per' ){
            if (this.listarray[ind]['asCompleted_per'] === '' || this.listarray[ind]['asCompleted_per'] === null){
                this.dataSource.data[ind]['sch_Var'] = ''
            }
            else if(this.listarray[ind]['psCompleted_per'] === '' || this.listarray[ind]['psCompleted_per'] === null){
                this.dataSource.data[ind]['sch_Var'] = ''
            }
            else if (this.listarray[ind]['psCompleted_per'] === '0'){
                this.dataSource.data[ind]['sch_Var'] = 0
            }        
            else{
            this.dataSource.data[ind]['sch_Var'] = ((this.listarray[ind]['psCompleted_per']-this.listarray[ind]['asCompleted_per'])/this.listarray[ind]['psCompleted_per'])*100
            this.listarray[ind]['sch_Var'] = ((this.listarray[ind]['psCompleted_per']-this.listarray[ind]['asCompleted_per'])/this.listarray[ind]['psCompleted_per'])*100
            }
        }   
}

validateDates(startDate, endDate, ind, cond, errMessage) {
    this.updateI = ind;
    var transitionDateErrMsg = "Dates should be between the transition dates["+this.TransStartDt+"-"+this.TransEndDt+"]"
    if ((this.listarray[ind][startDate] !== null && this.listarray[ind][startDate] !== "" ) && 
        (this.listarray[ind][endDate] !== null && this.listarray[ind][endDate] !== "")) {
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
public numberOnly(event,fldName:string): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        this.toastr.error('Please Enter Numeric values in '+fldName+' field')
    // alert('Please Enter Numeric values');
    return false;
  
    }
    return true;
  
    }  
  
  applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  
  insertsetTimeout(){
    setTimeout(() => {
        if (this.progress > 100) {
            this.progress = 0;
          
          //  this.loadData()
            this.toastr.success('Inserted Succcessfully', 'Scope Level - Sprint Execution Plan')
        } else {
            this.toastr.error('Insert Fail', 'Scope Level - Sprint Execution Plan')
        }
    }, 3000)
  }
  
  onUpdate() {  
    if (this.ownerIDValidation !== 0 ) {
        this.toastr.error('Validate the Owner Name with Bluepages using search button ')
        return false;
    }     
    for (var i = 0; i < this.listarray.length; i++) {
        if (this.listarray[i].Baselined === 0) {
         this.validateDates('Plan_Start_Date', 'Plan_End_Date', i, "G", 'Transition planned Start Date is greater than Transition planned End Date for '+this.listarray[i].AppName + "  Application")
         if (this.updateI > this.listarray.length) {
          break;
         }
         this.validateDates('Plan_Start_Date', 'Plan_End_Date', i, "L", 'Transition planned End Date is less than Transition planned Start Date for '+this.listarray[i].AppName + "  Application")
         if (this.updateI > this.listarray.length) {
          break;
         }
        } else {
         this.validateDates('Replan_Start_Date', 'RePlan_End_Date', i, "G", 'Transition Replan Start Date is greater than Transition Replan End Date for '+this.listarray[i].AppName + "  Application")
         if (this.updateI > this.listarray.length) {
          break;
         }
         this.validateDates('Replan_Start_Date', 'RePlan_End_Date', i, "L", 'Transition Replan End Date is less than Transition Replan Start Date for '+this.listarray[i].AppName + "  Application")
         if (this.updateI > this.listarray.length) {
          break;
         }
        }
        this.validateDates('Actual_Start_Date', 'Actual_End_Date', i, "G", 'Transition Actual Start Date is greater than Transition Actual End Date for '+this.listarray[i].AppName + "  Application")
        if (this.updateI > this.listarray.length) {
         break;
        }
        this.validateDates('Actual_Start_Date', 'Actual_End_Date', i, "L", 'Transition Actual End Date is less than Transition Actual Start Date for '+this.listarray[i].AppName + "  Application")
        if (this.updateI > this.listarray.length) {
         break;
        }
       }
      
       if (this.updateI > this.listarray.length) {
        return false;
       }
      
      if(this.isExistValue === 0){
          //Save
        this.saveSubscription = this.SprintPlanApplnLevelService.saveappLevelSpPlanResult(this.listarray).subscribe(res=>{
            if (res[0].save === "success") {
                          this.dataSource.data = [];
                          this.incrementSpinner();
                          this.saveFlag = 1;
                          this.insertsetTimeout();
                          setTimeout(() => {
                              this.localtwbs=[]; 
                              this.listarray =[];
                              this.accountExistCheck()
                          },3000)
                      }
        },(errsaveappLevelSpPlanResult: HttpErrorResponse) => {
                  if (errsaveappLevelSpPlanResult.error instanceof Error) {
                      console.log("Client Side Error.");
                      this.toastr.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com')
                  } else {
                      this.toastr.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com')
                      console.log("Server Side Error.");
                  }
              })
      }else{
          //update      
      this.UpdateSubscription = this.SprintPlanApplnLevelService.putappLevelSpPlanResult(this.listarray).subscribe(res => {
          if (res[0].insert === "success") {                            
              this.incrementSpinner();
              this.UpdateFlag = 1;
              this.dataSource.data = [];
              this.insertsetTimeout();
              setTimeout(() => {
                  this.loadSavedData();
              },3000)
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
  
  updateDate(val, ind, dateFieldName) {      
  
     this.listarray[ind][dateFieldName] = this.datepipe.transform(val.target.value, 'yyyy-MM-dd');
     this.listarray[ind]['modifiedBy'] = this.username;    
     if(dateFieldName ===  'Plan_Start_Date'){
        var today =  this.datepipe.transform(new Date(), 'yyyy-MM-dd');
        var endDT = this.datepipe.transform(new Date(this.listarray[ind][dateFieldName]), 'yyyy-MM-dd');
        if (new Date(today) > new Date(endDT)) {                        
            this.listarray[ind]['colorFlag']='1'
        }else{
            this.listarray[ind]['colorFlag']='0'
        }
    }
    if (dateFieldName === 'Plan_Start_Date') {
        this.validateDates('Plan_Start_Date', 'Plan_End_Date', ind, "G", 'Transition planned Start Date is greater than Transition planned End Date')
      }
      if (dateFieldName === 'Plan_End_Date') {
        this.validateDates('Plan_Start_Date', 'Plan_End_Date', ind, "L", 'Transition planned End Date is less than Transition planned Start Date')
      }
      if (dateFieldName === 'Replan_Start_Date') {
        this.validateDates('Replan_Start_Date', 'RePlan_End_Date', ind, "G", 'Transition Replan Start Date is greater than Transition Replan End Date')
      }
      if (dateFieldName === 'RePlan_End_Date') {
        this.validateDates('Replan_Start_Date', 'RePlan_End_Date', ind, "L", 'Transition Replan End Date is less than Transition Replan Start Date')        
      }
      if (dateFieldName === 'Actual_Start_Date') {
        this.validateDates('Actual_Start_Date', 'Actual_End_Date', ind, "G", 'Transition Actual Start Date is greater than Transition Actual End Date')        
      }
      if (dateFieldName === 'Actual_End_Date') {
        this.validateDates('Actual_Start_Date', 'Actual_End_Date', ind, "L", 'Transition Actual End Date is less than Transition Actual Start Date')        
      }
  }
  
  change(val,ind) {
      
      if (val.isUserInput) {         
         this.listarray[ind]['status'] = val.source.value;    
         this.listarray[ind]['modifiedBy'] = this.username;    
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
  valuechangeCorrection(event,i : number){      
    if((event.target.value.length-1  === 0) && (event.code == "Backspace" || event.code == "Delete")){   
      this.ownerIDValidation = 0; 
      this.listarray[i]['Owner_Name'] = ''   
    }      
  }

  updateOwner(event,i : number){    
    if(event.target.value === "" || event.target.value.length-1===0 ){
        this.ownerIDValidation = 0 ;
    }else {
            this.ownerIDValidation = 1 ;
    }
    this.ownerfield  = '';
    this.ownerfield = event.target.value; 
    this.listarray[i]['Owner_Name'] = ''
    this.listarray[i]['Owner_Name'] =  this.ownerfield     
}

ownerlist(name,obj:any,ind:number){        
   
    this.listarray[ind]['Owner_Name'] = ''
    this.listarray[ind]['Owner_Name'] = name
    this.ownerIDValidation = 0;
    this.myJSON = null
    this.nameField.nativeElement.focus();
}

getEmployeeName(obj:any,index) {
  this.matchID = index;
  let Name : string;
  Name = this.ownerfield;

    this.Employee_Name = [];
    this.SprintPlanApplnLevelService.getEmployeeDirectory(Name).subscribe(res => {
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
        this.setFocus('#SPALOwnName'+this.matchID);
  });
  }
  
  onBaseline() {    
    if (confirm('Do you want to Baseline the scope Stream Level Tracking plan ?')) {  
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
      this.BaselineSubscription = this.SprintPlanApplnLevelService.Baseline(this.listarray).subscribe(res => {
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
exportATSchSummary(){
    var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
    this.SprintPlanApplnLevelService.getexportATSchSummary(this.username,this.IntegrationID,this.TransitionAccName+'-'+Ttoday);
    window.open(this.baseURL+'/getexportATSchSummary/'+this.username+"/"+this.IntegrationID+"/"+this.TransitionAccName+'-'+Ttoday);
}

exportOverallTranDash(){
    var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
       this.SprintPlanApplnLevelService.getexportOverallTranDash(this.username,this.IntegrationID,this.TransitionAccName+'-'+Ttoday);
       window.open(this.baseURL+'/getexportOverallTranDash/'+this.username+"/"+this.IntegrationID+"/"+this.TransitionAccName+'-'+Ttoday);
       //var url = this.baseURL+'/getexportOverallTranDash/'+this.username+"/"+this.IntegrationID;
       //window.location.href = url;
}

TranSchExpPPT(){
    var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
    this.SprintPlanApplnLevelService.TranSchExpPPT(this.username,this.IntegrationID,'TransitionSchedule-PlanView-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
    //var url = this.baseURL+'/TranSchExpPPT/'+this.username+"/"+this.IntegrationID+"/"+this.TransitionAccName+'.pptx';
    //window.location.href = url;
   window.open(this.baseURL+'/TranSchExpPPT/'+this.username+"/"+this.IntegrationID+"/"+'TransitionSchedule-PlanView-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
}

TranSchExpProgressPPT(){
    var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
    this.SprintPlanApplnLevelService.TranSchExpProgressPPT(this.username,this.IntegrationID,'TransitionSchedule-ProgressView-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
    //var url = this.baseURL+'/TranSchExpProgressPPT/'+this.username+"/"+this.IntegrationID+'.pptx';
    //window.location.href = url;
   window.open(this.baseURL+'/TranSchExpProgressPPT/'+this.username+"/"+this.IntegrationID+"/"+'TransitionSchedule-ProgressView-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
}

  ngOnDestroy() {
    if(this.loadparamFlag === 1){  
        this.loadparamsSubscription.unsubscribe();  
    }
      if(this.accountExistFlag === 1){
      this.accountExistCheckSubscription.unsubscribe();  
      }
      if(this.saveFlag === 1){
          this.saveSubscription.unsubscribe();
      }
      if (this.UpdateFlag === 1) {
          this.UpdateSubscription.unsubscribe();
      }
      if (this.baseLineFlag === 1) {
          this.BaselineSubscription.unsubscribe();
      }
      if (this.epicFlag === 1) {
        this.getEpicSubscription.unsubscribe();
    }
    if (this.sprintFlag === 1) {
        this.getSprintSubscription.unsubscribe();
    }
    if(this.sprintstatusFlag ===1){
        this.getSprintstatusSubscription.unsubscribe();
    }
    if(this.profileStartandEndDateSubscriptionFlag === 1) {
        this.profileStartandEndDateSubscription.unsubscribe();
    }
  }

}
