import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input , ViewChild, ViewEncapsulation,OnDestroy } from '@angular/core';
import { Subscription, of, Observable } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import {FormControl} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SprintScopeService } from './sprint-scope/sprint-scope.service';
import { NavtntService } from 'src/app/navtnt.service';

import { filter, map, catchError, toArray } from 'rxjs/operators'; 

export interface ContDeliverables {
  // MatPaginator Output
  pageEvent: PageEvent;
}

@Component({
  selector: 'app-sprint-scope',
  templateUrl: './sprint-scope.component.html',
  styleUrls: ['./sprint-scope.component.css']
})

export class SprintScopeComponent implements OnInit,OnDestroy {
  private sprintlist: any;
  SprintScopeForm: FormGroup;
  editFlag: number;
  FlagHide: any;
  username: any;
   displayedColumns: string[]= ['EpicName', 'Sprint','Level']
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  private saveSubscription: Subscription;
  private saveSubscriptionFlag : number;
  private UpdateSubscription: Subscription;
  private UpdateSubscriptionFlag : number;
  private deleteSubscription: Subscription;
  private deleteSubscriptionFlag : number;
  private duplicateSubscription : Subscription;
  CreateFalg: string;
  AppIDData: any;
  AppIDData1: any;
  scopeIntegrationID: string;
  deleteFlag: number;
  dupFlag : number;
  appval = [];  
  private SprintNames: any;
  private Levelarray = [];
  unique: {};
  distinct: any[];
  private epicNameList : any;
  private appUNID=[];
  private selectedEpic : number;
  private selectedSprint : number;
  scopedApplicationList: any;
  STInfoData: any;
  ScopeLevelArray: any;
  Scope_Level = [];
   constructor(private _Ser: SprintScopeService,
    private fb: FormBuilder,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private navigation: NavtntService,
    private toaster: ToastrService) {
      this.SprintScopeForm =  this.fb.group ({
        Scope_IntegrationID: [''],
        Scope_CreatedBy: [''],
        Scope_ModifiedBy: [''],
        Scope_UNID: [''],
        Scope_EpicID: ['', Validators.required],
        Scope_SprintName: ['', Validators.required],        
        Scope_AppID: [''],
        Scope_NameOfApp: [''],
        Scope_NameOfApp1: [''],
        Scope_MVS_Description: ['', Validators.required],
        duplicateAPPUNID : [''],
        Scope_Level: ['', Validators.required],
        Scope_STInfoLevelAdd:['', Validators.required],
        Scope_STInfoLevelMod:['', Validators.required],
        Scope_BackLog:['', Validators.required]
      });
      this.selectedEpic = null;
      this.selectedSprint = null;
      this.editFlag = 0;
      this.dataLength = 0;
      this.selectedRow = 0;
      this.dataLength = 0;
      this.dupFlag =0;
      this.saveSubscriptionFlag = 0;
      this.UpdateSubscriptionFlag = 0;
      this.deleteSubscriptionFlag = 0;           
     }

  ngOnInit() {   
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);
       this.activatedRoute.queryParams.subscribe((respar: any) => {
         this.scopeIntegrationID = this.navigation.getParameterValue(respar.filter, 'Id')
        this.SprintScopeForm.controls['Scope_IntegrationID'].setValue(this.navigation.getParameterValue(respar.filter, 'Id'));
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
    this.appval = [];
    this.loadData();        
     return forkJoin([
       this._Ser.getAppIDResult(this.scopeIntegrationID),
                      this._Ser.getEpicsName(this.scopeIntegrationID),
                       this._Ser.getSTInfoResult(this.scopeIntegrationID),
                       this._Ser.getScopeLvels()                    
                    ])
      .subscribe(res => {
         this.AppIDData = res[0];
         this.epicNameList = res[1];
         this.STInfoData = res[2];
         this.Scope_Level=res[3];
      }, (err: HttpErrorResponse) => {
       if (err.error instanceof Error) {
         console.log('Client Sider Error.');
       } else {console.log('Server Sider Error.');
     }
     });   
  }
 
onSubmit() {    
}

// multiFilter(array, filters) {
//   return array.filter(o =>
//       Object.keys(filters).every(k =>
//           [].concat(filters[k]).some(v => o[k].includes(v))));
// }

loadData() {
  this.Levelarray = [];
  this.dataSource.data = [];  
  this.dataLength=0;
  this.activatedRoute.queryParams.subscribe((res: any) => {
  if (res.filter) {
    this.SprintScopeForm.controls['Scope_IntegrationID'].setValue(this.navigation.getParameterValue(res.filter, 'Id'));
   
    let obj: any;
    obj = {'Scope_IntegrationID': this.SprintScopeForm.controls['Scope_IntegrationID'].value };

    let filterval: string;
    let filtervalAT: string;

    if(this.SprintScopeForm.controls['Scope_Level'].value ==='AT'){
      filterval = null;
      filtervalAT = 'AT';
    }else if(this.SprintScopeForm.controls['Scope_Level'].value ==='ST'){
      filterval = 'ST';
      filtervalAT = 'ST';
    }else if(this.SprintScopeForm.controls['Scope_Level'].value ==='Others'){
      filterval = 'Others';
      filtervalAT = 'Others';
    }

    this._Ser.getSprintScopeDataResult(obj.Scope_IntegrationID)
    .flatMap((res) => res)
    .filter((level) => ( (level.Scope_Level === filterval) || (level.Scope_Level === filtervalAT)))
    .map((level) => level)
    .subscribe((res) => {
      this.Levelarray.push(res);
      this.dataSource.data = this.Levelarray;
      this.dataLength = this.dataSource.data.length;
    });   

//     this._Ser.getSprintScopeDataResult(obj.Scope_IntegrationID).subscribe(res => { 
//       filtered = res;;
// if (this.SprintScopeForm.controls['Scope_Level'].value !== ''){
//    var filters = { Scope_Level: [this.SprintScopeForm.controls['Scope_Level'].value] },
//   results = res,
//   filtered = this.multiFilter(results, filters);
//  }
//              this.dataSource.data = filtered;
              
//           this.dataLength = this.dataSource.data.length;
//           }, (errgetSprintScopeDataResult: HttpErrorResponse) => {
//            if (errgetSprintScopeDataResult.error instanceof Error) {
//              console.log('Client Sider Error.');
//            } else {
//              console.log('Server Sider Error.');
//          }
//     });
  }
  });
}

setSprintUNID(sprintUNID : number){  
    this.selectedSprint = sprintUNID;
  this.scopedApplication()
}

getSprints(Scope_EpicID: number){
   this.SprintScopeForm.controls['Scope_SprintName'].setValue('');    
  this.selectedEpic = Scope_EpicID;
   this._Ser.getSprintNamesData(this.scopeIntegrationID, Scope_EpicID, this.SprintScopeForm.controls['Scope_Level'].value ).subscribe(res => {
    this.sprintlist = res;
  }, (errgetSprintNamesData: HttpErrorResponse) => {
     if (errgetSprintNamesData.error instanceof Error) {
       console.log('Client Sider Error.');
     } else {
       console.log('Server Sider Error.');
     }
  });  
}

scopedApplication(){
   this._Ser.scopedApplication(this.selectedEpic,this.selectedSprint,this.scopeIntegrationID).subscribe(scopedApplicationres=>{
     this.scopedApplicationList = scopedApplicationres; 
    
   }, (errscopedApplication: HttpErrorResponse) => {
    if (errscopedApplication.error instanceof Error) {
      console.log('Client Sider Error.');
    } else {
      console.log('Server Sider Error.');
    }

 },()=>{
        if (this.AppIDData !== 0){
            this.AppIDData1 =  JSON.parse(JSON.stringify( this.AppIDData));        
        }else{
          this.AppIDData1 = null;
        }
        if (this.scopedApplicationList !== 0){        
             for(let j =0 ; j<this.scopedApplicationList.length;j++){
              for (let i = 0; i < this.AppIDData1.length; i++) {   
                  if (this.AppIDData1[i].AppUNID === this.scopedApplicationList[j].AppUNID ){         
                    this.AppIDData1.splice(i,1)                   
                  }
               }
            }
      }
 })
 
}

change(e, AppName: string){
  if((e.isUserInput) && (e.source.selected)) {
     this.appval.push(AppName)
  }else {
    var index = this.appval.indexOf(AppName);
    if (index >= 0) {
      this.appval.splice( index, 1 );
    }
  }   
   this.SprintScopeForm.controls['Scope_NameOfApp'].setValue(this.appval);
}

applyFilter(filterValue: string) {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

setClickedRow(index: number, rowdata: any): void {  
  console.log(rowdata)
  if (index === this.selectedRow) {
    this.selectedRow = 0;
    this.CreateFalg = 'No';
    this.editFlag = 0;
    this.resetFields();
   } else {   
    if((rowdata.Scope_Level==='') || (rowdata.Scope_Level===null)){
      this.SprintScopeForm.controls['Scope_Level'].setValue('AT');
    }else{
      this.SprintScopeForm.controls['Scope_Level'].setValue(rowdata.Scope_Level);
    } 
    this.selectedRow = index;  
    this.CreateFalg = 'Yes';
    this.editFlag = 1;
    this.SprintScopeForm.controls['Scope_IntegrationID'].setValue(rowdata.Scope_IntegrationID);
    this.SprintScopeForm.controls['Scope_CreatedBy'].setValue(rowdata.Scope_CreatedBy);
    this.SprintScopeForm.controls['Scope_ModifiedBy'].setValue(rowdata.Scope_ModifiedBy);
    this.SprintScopeForm.controls['Scope_UNID'].setValue(rowdata.Scope_UNID);
    this.SprintScopeForm.controls['Scope_EpicID'].setValue(rowdata.epicUNID); 
    this.SprintScopeForm.controls['Scope_SprintName'].setValue(rowdata.sprintName); 
 
    this.getSprints(rowdata.epicUNID);  

    //this.SprintScopeForm.controls['Scope_SprintName'].setValue(rowdata.sprintName); 
   // console.log(rowdata.sprintName)
   // console.log( this.SprintScopeForm.controls['Scope_SprintName'].value)
    this.SprintScopeForm.controls['Scope_SprintName'].setValue(rowdata.sprintUNID);   
    this.SprintScopeForm.controls['Scope_NameOfApp1'].setValue(rowdata.AppUNID);   
    this.SprintScopeForm.controls['duplicateAPPUNID'].setValue(rowdata.duplicateAPPUNID);
    
    this.SprintScopeForm.controls['Scope_MVS_Description'].setValue(rowdata.Scope_MVS_Description);
    if(this.SprintScopeForm.controls['Scope_Level'].value=== 'ST'){
     this.RemoveValidation(["Scope_STInfoLevelAdd"]);
     this.SetValidation(["Scope_STInfoLevelMod"])
    }
    this.SprintScopeForm.controls['Scope_STInfoLevelMod'].setValue(rowdata.MasterSTInfoid);
    this.SprintScopeForm.controls['Scope_BackLog'].setValue(rowdata.Scope_BacklogActivity);

    if ((this.deleteFlag === 1) || (this.deleteFlag === 0) ) {
      this.deleteFlag = null;
      this.editFlag = 0;
      this.selectedRow = 0;
      this.resetFields();
    }
  }
}

RemoveValidation(fieldName: string[]) {
    for(let i =0 ; i<fieldName.length;i++){
      this.SprintScopeForm.get(fieldName[i]).clearValidators();
      this.SprintScopeForm.get(fieldName[i]).updateValueAndValidity();
  }
 
}

SetValidation(fieldName: string[]) {
  for(let i =0 ; i<fieldName.length;i++){
    this.SprintScopeForm.get(fieldName[i]).setValidators(Validators.required);
    this.SprintScopeForm.get(fieldName[i]).updateValueAndValidity();
  }
}

OnchangeRadio(){
  this.selectedRow = 0;
  this.CreateFalg = 'No';
  this.editFlag = 0;
  this.resetFields();
  if(this.SprintScopeForm.controls['Scope_Level'].value=== 'AT'){
   this.displayedColumns= ['EpicName', 'Sprint','Level','AppID', 'AppName', 'MVsDescription', 'Delete'];
  this.RemoveValidation(["Scope_STInfoLevelAdd","Scope_STInfoLevelMod","Scope_BackLog"]);
  this.SetValidation(["Scope_MVS_Description"])
  
   }else if(this.SprintScopeForm.controls['Scope_Level'].value=== 'ST'){
    this.displayedColumns= ['EpicName', 'Sprint','Level', 'STScope', 'Delete'];
   this.RemoveValidation(["Scope_BackLog","Scope_MVS_Description","Scope_STInfoLevelMod"]);
   this.SetValidation(["Scope_STInfoLevelAdd"])
    
     }else if(this.SprintScopeForm.controls['Scope_Level'].value=== 'Others'){
    this.displayedColumns= ['EpicName', 'Sprint','Level', 'BacklogActivity', 'Delete'];
    this.RemoveValidation(["Scope_MVS_Description","Scope_STInfoLevelAdd","Scope_STInfoLevelMod"]);
    this.SetValidation(["Scope_BackLog"])
    
  }  
  this.loadData();
}

resetFields() {
  this.SprintScopeForm.controls['Scope_EpicID'].setValue('');
  this.SprintScopeForm.controls['Scope_SprintName'].setValue('');
  this.SprintScopeForm.controls['Scope_AppID'].setValue('');
  this.SprintScopeForm.controls['Scope_NameOfApp'].setValue('');
  this.SprintScopeForm.controls['Scope_NameOfApp1'].setValue('');  
  this.SprintScopeForm.controls['Scope_MVS_Description'].setValue('');
  this.SprintScopeForm.controls['Scope_STInfoLevelAdd'].setValue('');
  this.SprintScopeForm.controls['Scope_STInfoLevelMod'].setValue('');
  this.SprintScopeForm.controls['Scope_BackLog'].setValue('');
  if(this.SprintScopeForm.controls['Scope_Level'].value=== 'ST'){
    this.RemoveValidation(["Scope_STInfoLevelMod"]);
    this.SetValidation(["Scope_STInfoLevelAdd"])
   }
}

Add(obj: any) {

  if((this.SprintScopeForm.controls['Scope_Level'].value=== 'AT') 
  && (this.SprintScopeForm.controls['Scope_MVS_Description'].value.trim().length === 0)){
      this.toaster.warning('MVS Description value should not be blank.','Sprint Scope')
      return false;
    
  }else if((this.SprintScopeForm.controls['Scope_Level'].value=== 'Others')
  && (this.SprintScopeForm.controls['Scope_BackLog'].value.trim().length === 0)){
      this.toaster.warning('Backlog Activity value should not be blank.','Sprint Scope')
      return false;
  }  

  this.SprintScopeForm.controls['Scope_CreatedBy'].setValue(this.username);
  this.SprintScopeForm.controls['Scope_ModifiedBy'].setValue(this.username);

  if(this.SprintScopeForm.controls['Scope_Level'].value=== 'AT'){
    this.SprintScopeForm.controls['Scope_MVS_Description'].setValue(this.SprintScopeForm.controls['Scope_MVS_Description'].value.trim());
  }

  if(this.SprintScopeForm.controls['Scope_Level'].value=== 'Others'){
    this.SprintScopeForm.controls['Scope_BackLog'].setValue(this.SprintScopeForm.controls['Scope_BackLog'].value.trim());
  }
    
  this.duplicateSubscription = this._Ser.duplicateSprintScope(this.SprintScopeForm.value).subscribe(dupres=>{
     if(dupres.Result === 0){
       this.saveSubscription = this._Ser.postAddSprintScope(this.SprintScopeForm.value).subscribe(res => {  
         this.saveSubscriptionFlag = 1;  
          if (res.insert === 'success') {
            this.loadData();
            this.resetFields();
            this.toaster.success('Sprint Scope Details have added successfully.');
          } else {
            this.toaster.error('Insert Fail', 'Epic');
          }
        }, (errpostAddSprintScope: HttpErrorResponse) => {
        if (errpostAddSprintScope.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {
          console.log('Server Sider Error.');
        }
        });
     }else{
     this.toaster.error('Duplicate Sprint Scope exists.');
     }
  },(errduplicateSprintScope:HttpErrorResponse) =>{
   if (errduplicateSprintScope.error instanceof Error) {
     console.log('Client Sider Error.');
   } else {
     console.log('Server Sider Error.');
   }
  })
  
 
}

Update(obj: any) {

  if((this.SprintScopeForm.controls['Scope_Level'].value=== 'AT') 
  && (this.SprintScopeForm.controls['Scope_MVS_Description'].value.trim().length === 0)){
      this.toaster.warning('MVS Description value should not be blank.','Sprint Scope')
      return false;
    
  }else if((this.SprintScopeForm.controls['Scope_Level'].value=== 'Others')
  && (this.SprintScopeForm.controls['Scope_BackLog'].value.trim().length === 0)){
      this.toaster.warning('Backlog Activity value should not be blank.','Sprint Scope')
      return false;
  }  
  
  this.SprintScopeForm.controls['Scope_ModifiedBy'].setValue(this.username);

  if(this.SprintScopeForm.controls['Scope_Level'].value=== 'AT'){
    this.SprintScopeForm.controls['Scope_MVS_Description'].setValue(this.SprintScopeForm.controls['Scope_MVS_Description'].value.trim());
  }

  if(this.SprintScopeForm.controls['Scope_Level'].value=== 'Others'){
    this.SprintScopeForm.controls['Scope_BackLog'].setValue(this.SprintScopeForm.controls['Scope_BackLog'].value.trim());
  }
  
    this.UpdateSubscription =  this._Ser.putUpdateSprintScope(this.SprintScopeForm.value).subscribe(res => {
      this.UpdateSubscriptionFlag = 1;      
      
      if (res.duplicate === 'success') {
        
        this.toaster.error('Duplicate Sprint Scope exists.', 'Sprint Scope');            
       } else if (res.save === 'success') {
          this.toaster.success('Sprint Scope Details have updated Succcessfully', 'Sprint Scope');
          this.editFlag = 0;
          this.loadData();
          this.resetFields();
      } else {
          this.toaster.error('Update Fail', 'Sprint Scope');
         
      }

    }, (errputUpdateSprintScope: HttpErrorResponse) => {
  if (errputUpdateSprintScope.error instanceof Error) {
   console.log('Client side error.') ;
  } else {console.log('Server side error.') ; }
 });
}

onDelete(obj: any) {
var deletionUNID='';
var param_Scope_Level;
  var deletetext ='';
  if(this.SprintScopeForm.controls['Scope_Level'].value=== 'AT'){
    deletetext = obj.AppName;
    deletionUNID = obj.AppUNID;
    param_Scope_Level = 'AT'
  }else if(this.SprintScopeForm.controls['Scope_Level'].value=== 'ST'){
    deletetext = obj.STScopeData;
    deletionUNID = obj.STUNID;
    param_Scope_Level = 'ST'
  }else if(this.SprintScopeForm.controls['Scope_Level'].value=== 'Others'){
    deletetext = obj.Scope_BacklogActivity;
    deletionUNID = obj.Scope_UNID;
    param_Scope_Level = 'Others'
  }  

  if (confirm('Are you sure want to delete ' + deletetext + ' ?')) {
      this.deleteSubscription = this._Ser.DeleteSprintScope(obj.Scope_UNID,param_Scope_Level,deletionUNID).subscribe(res => {
          this.deleteSubscriptionFlag = 1 ;
         this.loadData();
         this.resetFields();
           if (res.Delete === 'success') { 
             this.toaster.success('Deleted Succcessfully', 'Sprint Scope');
          } else {
           this.toaster.error(res.Delete, 'Sprint Scope');
          window.alert(res.Delete.join('\n'));
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
       }
      
}

ngOnDestroy() {  
  if (this.saveSubscriptionFlag === 1) {
      this.saveSubscription.unsubscribe();
  }
  if (this.UpdateSubscriptionFlag === 1) {
      this.UpdateSubscription.unsubscribe();
  }
  if (this.deleteSubscriptionFlag === 1) {
    this.deleteSubscription.unsubscribe();
}

}


}
