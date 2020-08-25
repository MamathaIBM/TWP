import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input , ViewChild, ViewEncapsulation} from '@angular/core';
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
import { NavtntService } from 'src/app/navtnt.service';
import { TailoredExitcriteriaService } from './tailored-exitcriteria/tailored-exitcriteria.service';

export interface TEC {
  // MatPaginator Output
  pageEvent: PageEvent;
}

@Component({
  selector: 'app-tailored-exitcriteria',
  templateUrl: './tailored-exitcriteria.component.html',
  styleUrls: ['./tailored-exitcriteria.component.css']
})
export class TailoredExitcriteriaComponent implements OnInit {

  TailorECForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  private displayedColumns: string[] = ['TEC_STANDARD_ACTIVITY_NAME', 'TECChecked'];  
  private loadparamsSubscription2: Subscription
  private loadparamsSubscription: Subscription 
  private loadparamsSubscriptionFlag : number; 
  private loadparamsSubscription1: Subscription  
  private loadparamsSubscription1Flag : number;
  private saveSubscription: Subscription;
  private UpdateSubscription: Subscription;
  private addSubscription : Subscription;
  private addFlag : number;
  private deleteSubscription: Subscription;
  private epicNameSubscription : Subscription;
  private UpdateFlag : number
  private saveFlag : number;
  private s_dFlag : number;
  editFlag: number;
  username: any;
  TECIntegrationID: string;
  FlagHide: string;
  TECPhaseNames: any;
  private TECSelectedValue; 
  ECaccountExistLength: number;
  IntegrationID: string;
  createdBy: any;
  modifiedBy: any;
  ECaccountData: any;
  private progress =0;
  private listarray = [];  
  private localtwbs =[];  
  localtes: any;
  savedFlag: boolean;
  updateFlg: boolean;
  TECPhaseNamesval: any;
  localtesval: any;

  constructor(private _TECSer: TailoredExitcriteriaService,
    private fb: FormBuilder,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private navigation: NavtntService,
    private toaster: ToastrService) {
      this.TailorECForm =  this.fb.group ({
        EXIT_CRITERIA: [''],
        PHASE_NAME: [''],
        EXIT_CRITERIA_CREATED_BY:[''],        
        IntegrationID :[''] ,
        CheckedValue :[''] 
      });
      this.editFlag = 0;
      this.dataLength = 0;
      this.selectedRow = 0;
      this.dataLength = 0;
      this.updateFlg = false;
      this.savedFlag =  false;
      this.ECaccountExistLength = 0;
      this.UpdateFlag = 0;
      this.saveFlag = 0
      this.addFlag =0
      this.s_dFlag = 0;
      this.loadparamsSubscription1Flag = 0;
      this.loadparamsSubscriptionFlag = 0;
    }

  ngOnInit() {
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);
       this.activatedRoute.queryParams.subscribe((respar: any) => {
         this.TECIntegrationID = this.navigation.getParameterValue(respar.filter, 'Id')      
      if (respar.filter) {
        if (this.navigation.getParameterValue(respar.filter, 'ViewFlag') === 'Yes') {
        this.FlagHide = 'Yes';
        } else {
          this.FlagHide = 'No';
        }

        this.IntegrationID = this.navigation.getParameterValue(respar.filter, 'Id')
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.createdBy = this.username
        this.modifiedBy = this.username
        this.loadtailoredValues();
      }
    });
  }

  loadtailoredValues() {
    this.loadparamsSubscription2 = this._TECSer.getECPhaseResult().subscribe(res => {        
      this.TECPhaseNamesval =res;
      }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
          console.log("Client Sider Error.");
      } else {
          console.log("Server Sider Error.");
      }
    }, () => {
      this.TECPhaseNames = this.TECPhaseNamesval;
      this.TECSelectedValue = this.TECPhaseNames[0].PHASE_NAME        
    })
  }
  
  accountCheck() {
    this.loadparamsSubscription1 = this._TECSer.getTailoredECAccountResult(this.TECSelectedValue, this.IntegrationID)
        .subscribe(ECAccountData => {
          this.loadparamsSubscription1Flag =1;
            this.ECaccountData = ECAccountData;
            if (this.ECaccountData.length > 0) {
              this.ECaccountExistLength = 1;
              this.loadSavedData()
          } else {
              this.ECaccountExistLength = 0;
              this.loadData()
          }
        }, (errgetTailoredECAccountResult: HttpErrorResponse) => {
            if (errgetTailoredECAccountResult.error instanceof Error) {
                console.log("Client Sider Error.");
            } else {
                console.log("Server Sider Error.");
            }
        }, () => {
            if (this.ECaccountData.length > 0) {
                this.ECaccountExistLength = 1;
                // this.savedFlag = false;
                this.updateFlg = true;
            } else {
                this.ECaccountExistLength = 0;
                this.savedFlag = true;
                // this.updateFlg = false;
            }
        });
  }

  incrementSpinner() {
    this.progress=1;
    setTimeout(() => {
    if (this.progress < 100) {        
            for (var i = this.progress; i <= 100; i++) {
                this.progress += 1;                
            }            
        }
    }, 3000)
  }

  select_deselect(){
    if(this.s_dFlag === 0 ){    
      this.s_dFlag = 1    
    }else{      
      this.s_dFlag = 0;
    }
  
    for (var i = 0; i < this.localtes.length; i++) { 
      this.localtes[i]['CheckedValue'] = this.s_dFlag;           
    }  
  }

  onKey(event,obj:any){
    for (var i = 0; i < this.localtes.length; i++) {
        if (this.localtes[i]['EXIT_CRITERIA_ID'] == obj.EXIT_CRITERIA_ID) { 
          // this.localtes[i]['EXIT_CRITERIA'] = ''
          this.localtes[i]['EXIT_CRITERIA'] = event.target.value
            // console.log(this.listarray)
            // event.srcElement.value
            break;
        }
    }    
  }

  onChange(event, obj: any) {
    for (var i = 0; i < this.localtes.length; i++) {
        if (this.localtes[i]['EXIT_CRITERIA_ID'] === obj.EXIT_CRITERIA_ID) {
            if (event.checked === true) {
                this.localtes[i]['CheckedValue'] = 1;
            } else {
                this.localtes[i]['CheckedValue'] = 0;
            }
            this.localtes[i]['EXIT_CRITERIA_LAST_UPDATED_BY'] = this.modifiedBy
            break;
        }
    }
  }
  loadSavedData(){
    this.loadparamsSubscription = this._TECSer.getTailoredECforAccountSpecific(this.TECSelectedValue, this.IntegrationID).subscribe(res => {
        this.loadparamsSubscriptionFlag =1;        
        this.localtesval = res;
        //  this.localtwbsval = res;
     }, (errgetTailoredWBSSB: HttpErrorResponse) => {
         if (errgetTailoredWBSSB.error instanceof Error) {
             console.log("Client Sider Error.");
         } else {
             console.log("Server Sider Error.");
         }
 
     }, () => {                    
             this.localtwbs = this.localtesval;            
             this.listarray = [];
             for (var i = 0; i < this.localtwbs.length; i++) {
                 var obj = this.localtwbs[i];                           
                 if (this.localtwbs[i]['CheckedValue'] === null){
                    obj['CheckedValue'] =1
                    obj['EXIT_CRITERIA']=this.localtwbs[i]['ADName']
                    obj['Baselined']=this.localtwbs[0]['Baselined']
                    obj['IntegrationID'] = this.IntegrationID
                    obj['EXIT_CRITERIA_CREATED_BY']=this.username;                    
                 }                 
                 obj['EXIT_CRITERIA_LAST_UPDATED_BY'] = this.createdBy;        
                 this.listarray.push(obj);
             }
             this.localtes = this.listarray;
          this.dataSource.data = this.listarray;      
          this.dataLength = this.dataSource.data.length;
     });
}
  loadData() {
    this.s_dFlag = 1 ;
    this.loadparamsSubscription = this._TECSer.getTailoredECResult(this.TECSelectedValue, this.IntegrationID).subscribe(res => {
        this.loadparamsSubscriptionFlag = 1;
        this.localtesval = res;
       
    }, (errgetTailoredECResult: HttpErrorResponse) => {
        if (errgetTailoredECResult.error instanceof Error) {
            console.log("Client Sider Error.");
        } else {
            console.log("Server Sider Error.");
        }

    }, () => {
        // setTimeout(() => {
            this.dataSource.data = this.localtesval;
            this.localtes = this.localtesval;
            this.dataLength = this.dataSource.data.length;
            // this.listarray = [];
            // for (var i = 0; i < this.localtes.length; i++) {
            //     this.listarray.push(this.localtes[i]);
            //     this.listarray[i]['IntegrationID'] = this.IntegrationID;
            //     this.listarray[i]['STANDARD_ACTIVITY_CREATED_BY'] = this.createdBy
            // }
            // console.log(this.listarray)
            // }, 4100)
    });
}

addActivities(){  
  if(this.TailorECForm.controls['EXIT_CRITERIA'].value.trim().length === 0){
    this.toaster.warning('New Exit Criteria value should not be blank.','Tailor Exit Criteria')
    return false;
  }
  this.TailorECForm.controls['EXIT_CRITERIA_CREATED_BY'].setValue(this.createdBy);
  this.TailorECForm.controls['PHASE_NAME'].setValue(this.TECSelectedValue);
  this.TailorECForm.controls['CheckedValue'].setValue(1);
  this.TailorECForm.controls['IntegrationID'].setValue(this.IntegrationID);
  // console.log(this.TailorECForm.value)
  this.addSubscription = this._TECSer.postTailoredECAdd(this.TailorECForm.value).subscribe(res => {   
      this.addFlag = 1;
      if (res.save === "success") {
          this.dataSource.data = [];
          this.incrementSpinner();
          this.savedFlag = true;
          setTimeout(() => {                
              this.updateFlg = true;
              if (this.progress > 100) {
                  this.progress = 0;
                  // this.loadData();
                  this.accountCheck();
                  this.toaster.success('Inserted Succcessfully','Tailor Exit Criteria')
              }else
              {
                this.toaster.error('Insert Fail','Tailor Exit Criteria')
              } 
          }, 3000)
      }
  
  }, (errpostTailoredECAdd : HttpErrorResponse)=>{
      if(errpostTailoredECAdd.error instanceof Error ){
        console.log("Client Side Error.");
        this.toaster.error('Client side Add new record Error','ttstoolssupport@in.ibm.com')
      }
      else{
        this.toaster.error('Server Insert Add new record Error','ttstoolssupport@in.ibm.com')
        console.log("Server Side Error.");
    }
    })

    this.TailorECForm.controls['EXIT_CRITERIA'].setValue('');    
}

onSave() {
  for (var i = 0; i < this.localtes.length; i++) {
    this.localtes[i]['EXIT_CRITERIA_CREATED_BY'] = this.createdBy    
    this.localtes[i]['EXIT_CRITERIA_LAST_UPDATED_BY'] = this.modifiedBy
    this.localtes[i]['IntegrationID'] = this.IntegrationID
  }
  this.saveSubscription = this._TECSer.postTailoredEC(this.localtes).subscribe(res => {          
    this.saveFlag = 1 ;    
        if (res.save === "success") {
            this.updateFlg = true;
            this.ECaccountExistLength = 1
            this.dataSource.data = [];
            this.incrementSpinner();          
            setTimeout(() => {      
               //this.savedFlag = true;                
                if (this.progress > 100) {
                    this.progress = 0;
                    // this.loadData();
                    this.accountCheck()
                    this.toaster.success('Inserted Succcessfully','Tailor Exit Criteria')
                }else
                {
                  this.toaster.error('Insert Fail','Tailor Exit Criteria')
                } 
            }, 3000)
        }    
    }, (errpostTailoredEC : HttpErrorResponse)=>{
        if(errpostTailoredEC.error instanceof Error ){
          console.log("Client Side Error.");
          this.toaster.error('Client side Add new record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toaster.error('Server Insert Add new record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
      }
      })
}

onUpdate() {
  for (var i = 0; i < this.localtes.length; i++) {   
    this.localtes[i]['EXIT_CRITERIA_LAST_UPDATED_BY'] = this.modifiedBy
  }
  
  this.UpdateSubscription=this._TECSer.putTailoredEC(this.localtes).subscribe(res => {
    this.UpdateFlag = 1;
      if (res.insert === "success") {
          this.dataSource.data = [];
          this.incrementSpinner();
          this.updateFlg = true;
          setTimeout(() => {
              if (this.progress > 100) {
                  this.progress = 0;
                  // this.loadData()
                  this.accountCheck();
                  this.toaster.success('Inserted Succcessfully','Tailor Exit Criteria')
              }else
              {
                this.toaster.error('Insert Fail','Tailor Exit Criteria')
              } 
          }, 3000)
      }
  }, (errputTailoredEC : HttpErrorResponse)=>{
      if(errputTailoredEC.error instanceof Error ){
        console.log("Client Side Error.");
        this.toaster.error('Client side Add new record Error','ttstoolssupport@in.ibm.com')
      }
      else{
        this.toaster.error('Server Insert Add new record Error','ttstoolssupport@in.ibm.com')
        console.log("Server Side Error.");
    }
    })
}

  change(event) {    
    if ((event.isUserInput)) {
        this.TECSelectedValue = event.source.value
        this.savedFlag = true;
        this.updateFlg = false;
        this.ECaccountExistLength = 0;
        this.loadData()
        this.accountCheck();
    }else{
      this.dataSource.data = [];
      this.savedFlag = false;
        this.updateFlg = false;
    }
  }

  // changenull(event) {
  //   console.log("changenull")
    
  // }
  ngOnDestroy() {
    if(this.loadparamsSubscriptionFlag === 1 ){
      this.loadparamsSubscription.unsubscribe();  
    }
    if(this.loadparamsSubscription1Flag === 1){
      this.loadparamsSubscription1.unsubscribe(); 
    }
    this.loadparamsSubscription2.unsubscribe(); 
    if (this.saveFlag === 1 ){
      this.saveSubscription.unsubscribe();
    }
    if(this.addFlag === 1){
      this.addSubscription.unsubscribe();    
    }
    if(this.UpdateFlag ===1 ){
      this.UpdateSubscription.unsubscribe();
    }
}

}
