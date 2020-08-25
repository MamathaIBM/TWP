import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import { Component, Inject, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription,of, Observable } from 'rxjs';
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NavtntService } from '../navtnt.service';
import { tap, startWith, debounceTime, switchMap, map } from 'rxjs/operators';
import { RiskAnalyzer_Account } from './class/transition-risk-analyzer-account.model';
import { TransitionRiskAnalyzerAccountService } from './transition-risk-analyzer-account/transition-risk-analyzer-account.service';
import { join } from 'path';
import { MatDialog } from '@angular/material';
import { TransitionRiskAnalyzerAddAccountComponent } from './transition-risk-analyzer-add-account/transition-risk-analyzer-add-account.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-transition-risk-analyzer-account',
  templateUrl: './transition-risk-analyzer-account.component.html',
  styleUrls: ['./transition-risk-analyzer-account.component.css']
})
export class TransitionRiskAnalyzerAccountComponent implements OnInit {
  private localtwbs = [];
  editFlag: number; // check whether user is going for edit or new row add
  deleteFlag: number; // check the delete subscription used or not
  displayedColumns: string[] = ['Risk_ID', 'Risk_Attribute', 
  'Planned_Mitigation_Action','Acc_specific_risk',
  'Risk_Impact','Risk_Probability','Risk_Exposure','Risk_Score','Risk_Level','Risk_Type','Tracked'];
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  RAUpdateeForm: FormGroup;
  private listarray: RiskAnalyzer_Account[] = [];
  private Overall_calculation : number;
  private loadparamsSubscription: Subscription;  
  private saveSubscription: Subscription;
  private updateSubscription : Subscription;
  private Finalize_and_Submit_AnalysisSubscription : Subscription;
  private conditionCheckSubscription : Subscription;
  private deleteSubscription: Subscription;
  private savedFlag = false;
  private toasterMessageHeader : string;  
  private RCategory :any;
  private addButtonFlag : number;
  private IntegrationID: string;
  baseURL = environment.baseUrl
  TransitionAccName: any;
  username: any;    
  categoryFlag : number =0;
  private SOURCE : string;
  private saveFlag:number;
  private progress = 0;
  // getTRA_AdminListresult: any;  
  myControl = new FormControl();
  options : RiskAnalyzer_Account [] = [];
  filteredOptions: Observable<RiskAnalyzer_Account[]>;
  getRisk_Categoryresult: any;  
  RiskTypes: any;
  RiskValues: any;
  private FlagHide: any;
  private fieldPress: string;
  Nill_Records: number;
  private Risk_count : number;
  private Risk_count1 : number;
  Overall_calculation_percent: number;
  Overall_calculation_percent1: number;
  private _filterStates(value: string): RiskAnalyzer_Account[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(state => state.Risk_Category.toLowerCase().indexOf(filterValue) === 0);
  }

  constructor(private service: TransitionRiskAnalyzerAccountService,

    public dialog: MatDialog,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
     private toastr: ToastrService,
     private navigation: NavtntService) { 
      this.fieldPress="No";
      this.Overall_calculation = 0;
      this.saveFlag = 0;  
      this.Nill_Records =0;
      this.Risk_count = 0;
      this.Risk_count1 =0;
      
     }

     
  openDialog(): void {
    let dialogRef = this.dialog.open(TransitionRiskAnalyzerAddAccountComponent, {
      width: '900px'
      ,
       data: { IntegrationID : this.IntegrationID}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
      this.loadData();                           
    });
  }
  ngOnInit() {
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);

    this.TransitionAccName = JSON.parse(sessionStorage.getItem('ACCOUNTClientName'));
    this.TransitionAccName = decodeURIComponent(this.TransitionAccName._value);

    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res.filter) {    
        if (this.navigation.getParameterValue(res.filter, 'ViewFlag') === 'Yes') {
          this.FlagHide = 'Yes';
      } else {
          this.FlagHide = 'No';
      }       
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;   
          this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id')       
          this.loadData();                           
      }
    });
  }

  TRAExportExcel(){
    this.service.getTRAExportExcel(this.username,this.IntegrationID,this.TransitionAccName+".xls");
    window.open(this.baseURL+'/TRAExportExcel/'+this.username+"/"+this.IntegrationID+"/"+this.TransitionAccName+".xls");
  }

  
  loadData() {     
    this.listarray = [];   
    this.loadparamsSubscription = forkJoin([ 
      this.service.getTRA_AccountList(this.IntegrationID),
      this.service.getTRA_RiskTypes(),
      this.service.getTRA_RiskValues()
    ])

   .subscribe(res=>{
        // this.getTRA_AdminListresult = res ;  
        this.localtwbs = res[0]; 
        this.RiskTypes = res[1];
        this.RiskValues = res[2];              
        
    }, (err: HttpErrorResponse) => {
            if (err.error instanceof Error ) {
              console.log('Client Sider Error.');
            } else {
              console.log('Server Sider Error.');
          }
    },
    ()=>{
      // console.log( this.localtwbs)
      // console.log( "this.localtwbs");
      this.listarray = [];     
      this.addButtonFlag = this.localtwbs[0].acFlag;  
      this.Risk_count =  this.localtwbs.length;
      console.log(this.Risk_count)
      for (var i=0; i<this.localtwbs.length;i++ ){        
            if (i === 0){  
              this.addEmptyHeaderRow(JSON.parse(JSON.stringify(this.localtwbs[i])) );  
              this.addTableRow(JSON.parse(JSON.stringify(this.localtwbs[i]))) 
            }
            else if (i>0 && i < this.localtwbs.length-1){                               
                if (this.localtwbs[i-1].Risk_Category === this.localtwbs[i].Risk_Category) {                      
                    this.addTableRow(JSON.parse(JSON.stringify(this.localtwbs[i])))
                  }else{
                    this.addEmptyHeaderRow(JSON.parse(JSON.stringify(this.localtwbs[i])) );                                   
                    this.addTableRow(JSON.parse(JSON.stringify(this.localtwbs[i]))) 
                  }
            }
            else if (i+1 === this.localtwbs.length){
                if (this.localtwbs[i-1].Risk_Category === this.localtwbs[i].Risk_Category) {
                  this.addTableRow(JSON.parse(JSON.stringify(this.localtwbs[i])))                          
                } else   {
                  this.addEmptyHeaderRow(JSON.parse(JSON.stringify(this.localtwbs[i])) );                               
                  this.addTableRow(JSON.parse(JSON.stringify(this.localtwbs[i])))                        
                }
          }
      }
       this.Overall_Transition_Risk_RAG_Status_calculation();
       this.sourceName();
        console.log(this.listarray)
      this.dataSource.data = this.listarray  ;     //this.getTRA_AdminListresult ;
      this.dataLength = this.dataSource.data.length;
      });
  
}

sourceName(){
    if(this.listarray[1]["acFlag"] === 0 ){
      this.SOURCE = "Admin"
    } else  if(this.listarray[1]["acFlag"] === 1 ){
      this.SOURCE = "Execution" 
    }else{
      this.SOURCE = "Engagement"
    }  
}

addTableRow(jObj : any){
 
  var  obj =  jObj;
  obj["Risk_Score"]=""
  obj["Risk_Level"]=""
  obj["LAST_UPDATED_BY"]=this.username
  // obj["currentUser"] = this.username;
  if(jObj.acFlag !== 1){
    obj["RiskLog_Flag"] =""
    obj["CREATED_BY"]=this.username
    
  }

  if(jObj.acFlag === 0){               
      obj["Risk_Type"]="";
      obj["Risk_Probability"]="";
      obj["Risk_Impact"] = "";   
      obj["Acc_specific_risk"] = jObj.Risk_Attribute; 
      obj["Integration_ID"] = this.IntegrationID;      
     
  } 
  else{   
   
    obj["Risk_Probability"] =jObj.Risk_Probability;
    obj["Risk_Type"] = jObj.Risk_Type;
    obj["Risk_Impact"] = jObj.Risk_Impact;  
    obj["Acc_specific_risk"] = jObj.Acc_specific_risk;  
    obj["Integration_ID"] = jObj.Integration_ID;
  }

  // if(jObj.acFlag === 2){ 
  //   obj[" TRA_UNID"] = jObj.TRA_Eng_UNID
  // }
  obj["flag"] = 0;
  this.listarray.push(obj)
  this.risk_exposure_Calculation(obj, this.listarray.length-1 ); 
  this.Risk_Score_calculation(obj,this.listarray.length-1) ;
  this.Risk_Level_Calculation(obj,this.listarray.length-1);  
}

addEmptyHeaderRow(jObj : any){
  var  obj1 =  jObj; 
  obj1["flag"] = 1;
  obj1["TRA_UNID"] =""
  obj1["TRA_EX_UNID"] = ""
  obj1["Risk_ID"] = obj1.Risk_Category
  obj1["Risk_Attribute"] = ""
  obj1["Planned_Mitigation_Action"]=""
  obj1["LAST_UPDATED_BY"]=""
  obj1["LAST_UPDATED_AT"]=""
  obj1["CREATED_BY"]=""
  obj1["CREATED_AT"]=""
  obj1["Risk_Exposure"]=""
  obj1["Risk_Score"]=""
  obj1["Risk_Level"]=""
  this.listarray.push(obj1); 
}  

updatei(val,rowData,ind,fldName){
  if (val.isUserInput) {         
    this.listarray[ind][fldName] =val.source.value    
    // console.log    (this.listarray)
 } 
}


change(val,rowData,ind,fldName) {      
  if (val.isUserInput) {         
     this.listarray[ind][fldName] =val.source.value
     this.risk_exposure_Calculation(rowData,ind); 
     this.Risk_Score_calculation(rowData,ind) ;
     this.Risk_Level_Calculation(rowData,ind) ;
     this.Overall_Transition_Risk_RAG_Status_calculation();
    //  console.log    (this.listarray)
  }    
}

risk_exposure_Calculation(jObj,ind){
  if(jObj.Risk_Impact === 'NA'|| jObj.Risk_Probability === 'NA' ){
    this.listarray[ind]["Risk_Exposure"] ='NA'
  }else if (jObj.Risk_Impact === ""|| jObj.Risk_Probability === "" ){
    this.listarray[ind]["Risk_Exposure"] = "";
  }else{
    this.listarray[ind]["Risk_Exposure"] = jObj.Risk_Impact *jObj.Risk_Probability
  }
  
}

Risk_Score_calculation(jObj,ind){
  if(jObj.Risk_Exposure === 'NA' ){
    this.listarray[ind]["Risk_Score"] ='NA'
  }else if (jObj.Risk_Exposure === ""){
    this.listarray[ind]["Risk_Score"] = "";
  }else if (jObj.Risk_Exposure >=1 && jObj.Risk_Exposure <=3){
    this.listarray[ind]["Risk_Score"] =   (jObj.Risk_Exposure/100)*20
  }else if (jObj.Risk_Exposure >=4 && jObj.Risk_Exposure <=6){
    this.listarray[ind]["Risk_Score"] = (jObj.Risk_Exposure/100)*30
  }else if (jObj.Risk_Exposure >=7 && jObj.Risk_Exposure <=9){
    this.listarray[ind]["Risk_Score"] = (jObj.Risk_Exposure/100)*50
  }
}

Risk_Level_Calculation(jObj,ind){
  if(jObj.Risk_Score === 'NA' ){
    this.listarray[ind]["Risk_Level"] ='NA'
  }else if (jObj.Risk_Score === ""){
    this.listarray[ind]["Risk_Level"] = "";
  }else if (jObj.Risk_Score <=1 ){
    this.listarray[ind]["Risk_Level"] =  1
  }else if (jObj.Risk_Score > 1 && jObj.Risk_Score <= 1.5){
    this.listarray[ind]["Risk_Level"] = 2
  }else if (jObj.Risk_Score >1.5){
    this.listarray[ind]["Risk_Level"] = 3
  }
}

Overall_Transition_Risk_RAG_Status_calculation(){
  let num : number;
  num =0;
  this.Risk_count1 = 0
  this.Overall_calculation_percent1 =0
    for(var i=0;i<this.listarray.length;i++ ){
    if((this.listarray[i]["Risk_Score"] !== "" && this.listarray[i]["Risk_Score"] !== "NA") && this.listarray[i]["flag"] == 0 ){      
        num =  num +this.listarray[i]["Risk_Score"]; 
        this.Risk_count1 = this.Risk_count1 +1
    }    
  }
  this.Overall_calculation = num;
  setTimeout(()=>{
    console.log(this.Risk_count1)
    this.Overall_calculation_percent = num/(this.Risk_count*4.5) ;
    if(this.Risk_count1 !== 0) {
      this.Overall_calculation_percent1 = num/(this.Risk_count1*4.5) ;
    }    
  },1000)
 
}

textUpdate1(val:string){   
  this.fieldPress = val;     
}
textUpdate(fldValue,ind,fldName:string){      
  if (this.fieldPress === "yes"){       
  //  console.log(fldValue.target.value)
   this.fieldPress="No"
   this.listarray[ind][fldName] = fldValue.target.value
   this.listarray[ind]['modifiedBy'] = this.username;       
    // console.log(this.listarray) 
 }    
}

Finalize_and_Submit_Analysis(){  
  this.Finalize_and_Submit_AnalysisSubscription = 
            this.service.Finalize_and_Submit_Analysis(this.listarray)
            .subscribe(Finalize_and_Submit_AnalysisSubscriptionres =>{
              if (Finalize_and_Submit_AnalysisSubscriptionres[0].save === "Nill_Records" ){
                this.Nill_Records = 1;
                this.dataSource.data = [];
                this.incrementSpinner();
                this.saveFlag = 1;
                this.insertsetTimeout();
                setTimeout(() => {            
                    this.loadData();
                },3000) 
              }else
              if(Finalize_and_Submit_AnalysisSubscriptionres[0].save === "success"){
                this.dataSource.data = [];
                this.incrementSpinner();
                this.saveFlag = 1;
                this.insertsetTimeout();
                setTimeout(() => {            
                    this.loadData();
                },3000) 
              }
  },(Finalize_and_Submit_AnalysisSubscriptionres_Error :HttpErrorResponse )=>{
    if(Finalize_and_Submit_AnalysisSubscriptionres_Error instanceof Error ){
      console.log("Client Side Error.");
      this.toastr.error('Client side Error ', 'ttstoolssupport@in.ibm.com')
  } else {
      this.toastr.error('Server side Error', 'ttstoolssupport@in.ibm.com')
      console.log("Server Side Error.");
  }
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

insertsetTimeout(){
  setTimeout(() => {
      if (this.progress > 100) {
          this.progress = 0;      
          if (this.Nill_Records === 1){
            this.toastr.success('No Records to insert', 'Transition Risk Analysis');
            this.Nill_Records = 0;
          } else{
            this.toastr.success('Inserted Succcessfully', 'Transition Risk Analysis');
          }          
          
      } else {
          this.toastr.error('Insert Fail', 'Transition Risk Analysis')
      }
  }, 3000)
}

// categoryCalculation(){ 
//   for(var i=1;i< this.listarray.length;i++ ){
//     if(this.listarray[i]["flag"] == 1 &&  this.categoryFlag === 1 ){
//         break;
//     }
//     if(this.listarray[i]["Risk_Impact"] ==="" || this.listarray[i]["Risk_Probability"] ==="" ){
//       this.categoryFlag = 1
//     }else{
//       this.categoryFlag = 0;
//     }
//   }
  
// }

save(){        
  this.saveSubscription = this.service.postAccount_Data(this.listarray).subscribe(postAccount_Data_Result =>{    
    if(postAccount_Data_Result[0].save === "success" ){  
        this.dataSource.data = [];
        this.incrementSpinner();
        this.saveFlag = 1;
        this.insertsetTimeout();
        setTimeout(() => {            
            this.loadData();
        },3000)   
    }

  },(postAccount_Data_Result_Error :HttpErrorResponse )=>{
    if(postAccount_Data_Result_Error instanceof Error ){
      console.log("Client Side Error.");
      this.toastr.error('Client side Error ', 'ttstoolssupport@in.ibm.com')
  } else {
      this.toastr.error('Server side Error', 'ttstoolssupport@in.ibm.com')
      console.log("Server Side Error.");
  }
  })
}
Update(){
    this.updateSubscription = this.service.putAccount_Data(this.listarray).subscribe(putAccount_Data_result=>{
      if(putAccount_Data_result[0].save === "success" ){  
        this.dataSource.data = [];
        this.incrementSpinner();
        this.saveFlag = 1;
        this.insertsetTimeout();
        setTimeout(() => {            
            this.loadData();
        },3000)   
    }      
    },(putAccount_Data_result_error : HttpErrorResponse )=>{
      if(putAccount_Data_result_error instanceof Error ){
        console.log("Client Side Error.");
        this.toastr.error('Client side Error ', 'ttstoolssupport@in.ibm.com')
    } else {
        this.toastr.error('Server side Error', 'ttstoolssupport@in.ibm.com')
        console.log("Server Side Error.");
    }
    } )
}
Save_Update(){
  if(this.listarray[0].acFlag !== 1){
      this.save();
  }else{
      this.Update();
  }
}



}
