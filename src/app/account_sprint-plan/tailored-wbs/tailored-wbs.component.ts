import { NavtntService,KeyValue } from './../../navtnt.service';
import { twbs } from './class/twbs.model';
import { TailoredWBSService } from './Tailored-WBS/tailored-wbs.service';
import { Component, inject,ViewChild,OnInit,OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { HttpErrorResponse } from "@angular/common/http";
import { Validators, FormGroup, FormControl, FormBuilder, FormArray } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';



export interface stakeholderpage {
  // MatPaginator Output 
  pageEvent: PageEvent;} 

@Component({
  selector: 'app-tailored-wbs',
  templateUrl: './tailored-wbs.component.html',
  styleUrls: ['./tailored-wbs.component.css']
})  
export class TailoredWBSComponent implements OnInit,OnDestroy {
  
  private tailoredWBSForm: FormGroup;
  private editFlag: number; // check whether user is going for edit or new row add
  private UpdateFlag :number; // check the delete subscription used or not
  private displayedColumns: string[] = ['STANDARD_ACTIVITY_NAME', 'MILESTONE_OR_TASK','twbsChecked'];  
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;   
  dataSource = new MatTableDataSource<any>();
  dataLength: number; 
  selectedRow: number;   
  private loadparamsSubscription: Subscription;
  private loadparamsSubscriptionFlag : number;
  private loadparamsSubscription1: Subscription;
  private loadparamsSubscription1Flag : number;
  private loadparamsSubscription2: Subscription;
  private saveSubscription: Subscription;
  private addSubscription : Subscription;
  private addFlag: number;
  private UpdateSubscription : Subscription;
  private UpdateSubscriptionFlag : number;
  private savedFlag : boolean = false;
  private IntegrationID : string;
  private createdBy : string;
  private modifiedBy :string;
  private FlagHide: any;
  private localtwbs =[];  
  private listarray : twbs[] = [];  
  private tailoredValues;  
  private tailoredSelectedValue ; 
  private accountData;
  private accountExistLength;
  private progress =0;
  private updateFlag;  
  private MilestoneORTasks : any = [{ value : 'M'},{value : 'T'} ] 
  private Baselined : number;
  private username: any;
  private s_dFlag : number;
  private emptyFlag : number;
    tailoredValuesval: any;
    localtwbsval: twbs[];

  constructor(private twbsService: TailoredWBSService,
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private navigation: NavtntService) {
    this.dataLength = 0;
    this.selectedRow = 0;
    this.editFlag = 0;
    this.UpdateFlag = 0;
    this.Baselined = 0;
    this.addFlag = 0 ;
    this.s_dFlag = 0;
    this.emptyFlag = 0;
    this.UpdateSubscriptionFlag = 0;
    this.loadparamsSubscription1Flag = 0;
    this.loadparamsSubscriptionFlag =0;
    this.tailoredWBSForm =  this.fb.group ({
        STANDARD_ACTIVITY_NAME :  ['',Validators.required],
        MILESTONE_OR_TASK : ['',Validators.required] ,
        PHASE_NAME: [''],
        STANDARD_ACTIVITY_CREATED_BY:[''],        
        IntegrationID :[''] ,
        CheckedValue :['']      
      });

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
            this.createdBy = this.username
            this.modifiedBy = this.username
            this.loadtailoredValues();
        }
    });
}                     
select_deselect(){
  if(this.s_dFlag === 0 ){    
    this.s_dFlag = 1    
  }else{      
    this.s_dFlag = 0;
  }

  for (var i = 0; i < this.listarray.length; i++) { 
    this.listarray[i]['CheckedValue'] = this.s_dFlag;           
  }
  console.log(this.listarray)

}

loadtailoredValues() {
    this.loadparamsSubscription2 = this.twbsService.getTWBSKeywords().subscribe(res => {        
        this.tailoredValuesval =res;
    }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
            console.log("Client Sider Error.");
        } else {
            console.log("Server Sider Error.");

        }
    }, () => {
        this.tailoredValues = this.tailoredValuesval;
        this.tailoredSelectedValue = this.tailoredValues[0].PHASE_NAME        
    })
}

accountCheck() {
    this.loadparamsSubscription1 = this.twbsService.getTailoredWBSSBForAccount(this.tailoredSelectedValue, this.IntegrationID)
        .subscribe(AccountData => {
            this.loadparamsSubscription1Flag = 1;
            this.accountData = AccountData;
        }, (errgetTailoredWBSSBForAccount: HttpErrorResponse) => {
            if (errgetTailoredWBSSBForAccount.error instanceof Error) {
                console.log("Client Sider Error.");
            } else {
                console.log("Server Sider Error.");
            }
        }, () => {
            if (this.accountData.length > 0) {
                this.accountExistLength = 1;
                this.loadSavedData()
            } else {
                this.accountExistLength = 0;
                this.loadData()
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

onKey(event,obj:any){
    console.log(event.target.value)
    for (var i = 0; i < this.listarray.length; i++) {
        if (this.listarray[i]['STANDARD_ACTIVITY_ID'] == obj.STANDARD_ACTIVITY_ID) {           
            this.listarray[i]['STANDARD_ACTIVITY_NAME'] = ''
            this.listarray[i]['STANDARD_ACTIVITY_NAME'] = event.target.value
            console.log(this.listarray)
            break;
        }
    }
    
}
loadSavedData(){
    this.loadparamsSubscription = this.twbsService.getTailoredWBSSBforAccountSpecific(this.tailoredSelectedValue, this.IntegrationID).subscribe(res => {
        this.loadparamsSubscriptionFlag =1;
         this.localtwbsval = res;
     }, (errgetTailoredWBSSB: HttpErrorResponse) => {
         if (errgetTailoredWBSSB.error instanceof Error) {
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
                 var obj = this.localtwbs[i];     
                      
                 if (this.localtwbs[i]['CheckedValue'] === null){
                    obj['CheckedValue'] =1
                    obj['STANDARD_ACTIVITY_NAME']=this.localtwbs[i]['ADName']
                    obj['Baselined']=this.localtwbs[0]['Baselined']
                    obj['IntegrationID'] = this.IntegrationID
                    obj['STANDARD_ACTIVITY_CREATED_BY']=this.username;
                    // obj['admin_id'] =this.localtwbs[i]['AdID']
                 }
                 
                 obj['STANDARD_ACTIVITY_LAST_UPDATED_BY'] = this.createdBy;        
                 this.listarray.push(obj);
             }
             console.log(this.listarray)
        
     });
}
loadData() {
    this.s_dFlag = 1 ;
    this.loadparamsSubscription = this.twbsService.getTailoredWBSSB(this.tailoredSelectedValue, this.IntegrationID).subscribe(res => {
       this.loadparamsSubscriptionFlag =1;
        this.localtwbsval = res;
        console.log(this.localtwbs)

    }, (errgetTailoredWBSSB: HttpErrorResponse) => {
        if (errgetTailoredWBSSB.error instanceof Error) {
            console.log("Client Sider Error.");
        } else {
            console.log("Server Sider Error.");
        }

    }, () => {
        // setTimeout(() => {
            this.dataSource.data = this.localtwbsval;
            this.localtwbs = this.localtwbsval;
            this.dataLength = this.dataSource.data.length;
            this.listarray = [];
            for (var i = 0; i < this.localtwbs.length; i++) {
                var obj = this.localtwbs[i];
                obj['IntegrationID'] = this.IntegrationID;
                obj['CheckedValue']= 1
                obj['STANDARD_ACTIVITY_CREATED_BY'] = this.createdBy;
                // this.listarray.push(this.localtwbs[i]);
                this.listarray.push(obj);
                // this.listarray[i]['IntegrationID'] = this.IntegrationID;
                // this.listarray[i]['STANDARD_ACTIVITY_CREATED_BY'] = this.createdBy
            }
            console.log(this.listarray)
            // }, 4100)
    });
}


applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
}


change(event) {
    if (event.isUserInput) {
        this.tailoredSelectedValue = event.source.value
        this.updateFlag = 0;
        this.accountExistLength = 0;
        this.accountCheck();
        // this.loadData()
        
    }
}

onChange(event, obj: any) {
    console.log(event.checked)
    for (var i = 0; i < this.listarray.length; i++) {
        if (this.listarray[i]['STANDARD_ACTIVITY_ID'] === obj.STANDARD_ACTIVITY_ID) {
            if (event.checked === true) {
                this.listarray[i]['CheckedValue'] = 1;
            } else {
                this.listarray[i]['CheckedValue'] = 0;
            }
            this.listarray[i]['STANDARD_ACTIVITY_LAST_UPDATED_BY'] = this.modifiedBy
            console.log(this.listarray)
            break;
        }
    }
}
addActivities(){    
    if( this.tailoredWBSForm.controls['STANDARD_ACTIVITY_NAME'].value.trim().length === 0 || 
       this.tailoredWBSForm.controls['MILESTONE_OR_TASK'].value.trim().length === 0 ){
        this.toastr.warning(' New Standard Activity / MILESTONE OR TASK value should not be blank.','Tailor WBS')
        return false;
      }
    this.tailoredWBSForm.controls['STANDARD_ACTIVITY_CREATED_BY'].setValue(this.createdBy);
    this.tailoredWBSForm.controls['PHASE_NAME'].setValue(this.tailoredSelectedValue);
    this.tailoredWBSForm.controls['CheckedValue'].setValue(1);
    this.tailoredWBSForm.controls['IntegrationID'].setValue(this.IntegrationID);
    console.log(this.tailoredWBSForm.value)
    this.addSubscription = this.twbsService.postTailoredWBSSBAdd(this.tailoredWBSForm.value).subscribe(res => {  
        this.addFlag = 1 ;      
        if (res[0].save === "success") {
            this.dataSource.data = [];
            this.incrementSpinner();
            
            setTimeout(() => {                
                this.updateFlag = 1
                if (this.progress > 100) {
                    this.progress = 0;
                    // this.loadData();
                    this.accountCheck();
                    this.resetFields()
                    this.toastr.success('Inserted Succcessfully','Tailor WBS')
                }else
                {
                  this.toastr.error('Insert Fail','Tailor WBS')
                } 
            }, 3000)
        }
    
    }, (err : HttpErrorResponse)=>{
        if(err.error instanceof Error ){
          console.log("Client Side Error.");
          this.toastr.error('Client side Add new record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toastr.error('Server Insert Add new record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
      }
      })
}
resetFields(){
    this.tailoredWBSForm.controls['STANDARD_ACTIVITY_NAME'].setValue('');
    this.tailoredWBSForm.controls['MILESTONE_OR_TASK'].setValue('');
}
onSave() {
    this.emptyFlag = 0;
    for (var i = 0; i < this.listarray.length; i++) {
        if (this.listarray[i]['STANDARD_ACTIVITY_NAME'] === '' || this.listarray[i]['MILESTONE_OR_TASK'] === '' ){
            this.emptyFlag = 1;            
            break;
        }        
    }

    if(this.emptyFlag === 1 ){
        this.emptyFlag = 0;
        this.toastr.warning('Standard Activity  / Milestone or Task cannot be blank','Tailor WBS')           
        return false;
    }
    
  this.saveSubscription = this.twbsService.postTailoredWBSSB(this.listarray).subscribe(res => {        
        if (res[0].save === "success") {
            this.dataSource.data = [];
            this.incrementSpinner();
            this.savedFlag = true;
            setTimeout(() => {                
                this.updateFlag = 1
                if (this.progress > 100) {
                    this.progress = 0;
                    // this.loadData();
                    this.accountCheck();
                    this.toastr.success('Inserted Succcessfully','Tailor WBS')
                }else
                {
                  this.toastr.error('Insert Fail','Tailor WBS')
                } 
            }, 3000)
        }
    
    }, (errpostTailoredWBSSB : HttpErrorResponse)=>{
        if(errpostTailoredWBSSB.error instanceof Error ){
          console.log("Client Side Error.");
          this.toastr.error('Client side Add new record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toastr.error('Server Insert Add new record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
      }
      })
}

onUpdate() {
    this.emptyFlag = 0;
    for (var i = 0; i < this.listarray.length; i++) {
        if (this.listarray[i]['STANDARD_ACTIVITY_NAME'] === ''){
            this.emptyFlag = 1;            
            break;
        }        
    }

    if(this.emptyFlag === 1 ){
        this.emptyFlag = 0;
        this.toastr.warning('Standard Activity cannot be blank','Tailor WBS')           
        return false;
    }
    

    this.UpdateSubscription=this.twbsService.putTailoredWBSSB(this.listarray).subscribe(res => {
        this.UpdateSubscriptionFlag = 1;
        if (res[0].insert === "success") {
            this.dataSource.data = [];
            this.incrementSpinner();
            this.UpdateFlag =1;
            setTimeout(() => {
                if (this.progress > 100) {
                    this.progress = 0;
                    // this.loadData()
                    this.accountCheck();
                    this.toastr.success('Inserted Succcessfully','Tailor WBS')
                }else
                {
                  this.toastr.error('Insert Fail','Tailor WBS')
                } 
            }, 3000)
        }
        console.log(res)
    }, (errputTailoredWBSSB : HttpErrorResponse)=>{
        if(errputTailoredWBSSB.error instanceof Error ){
          console.log("Client Side Error.");
          this.toastr.error('Client side Add new record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toastr.error('Server Insert Add new record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
      }
      })
}

ngOnDestroy() {

    if (this.loadparamsSubscriptionFlag ===1){
        this.loadparamsSubscription.unsubscribe();  
    }    
    if (this.loadparamsSubscription1Flag === 1){
        this.loadparamsSubscription1.unsubscribe();
    }
    this.loadparamsSubscription2.unsubscribe(); 
    if (this.savedFlag === true ){
      this.saveSubscription.unsubscribe();
    }
    if(this.UpdateSubscriptionFlag ===1 ){
      this.UpdateSubscription.unsubscribe();
    }
    if( this.addFlag === 1){
        this.addSubscription.unsubscribe()
    }
}
}


