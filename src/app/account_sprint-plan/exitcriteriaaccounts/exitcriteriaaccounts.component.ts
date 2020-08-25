import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Component, OnInit, Input , ViewChild, ViewEncapsulation,OnDestroy} from '@angular/core';
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
import { ExitcriteriaaccountsService } from './exitcriteriaaccounts/exitcriteriaaccounts.service';

@Component({
  selector: 'app-exitcriteriaaccounts',
  templateUrl: './exitcriteriaaccounts.component.html',
  styleUrls: ['./exitcriteriaaccounts.component.css']
})
export class ExitcriteriaaccountsComponent implements OnInit,OnDestroy {

  AccExitCriteriaForm: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  private displayedColumns: string[] = ['Phase_Name', 'Exit_Criteria_NAME', 'Exit_Criteria_Status', 'Exit_Criteria_Comments', 'EXIT_CRITERIA_URL'];  
  private getSprintstatusSubscription: Subscription
  private loadparamsSubscription: Subscription      
  private UpdateSubscription: Subscription;    
  FlagHide: string;
  IntegrationID: string;
  username: any;
  ECStatus: any;
  progress: number;
  localec: any;
  ECStatusval: any;
  localecval: any;
  private UpdateFlag : number;

  constructor(private _ECSer: ExitcriteriaaccountsService,
    private fb: FormBuilder,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private navigation: NavtntService,
    private toaster: ToastrService) {
    
      this.dataLength = 0;
      this.selectedRow = 0;
      this.dataLength = 0;
      this.UpdateFlag = 0
    
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
          this.loadData();
          this.loadgetECstatusKeywords();            }
  });

  }

loadgetECstatusKeywords(){
    this.getSprintstatusSubscription = this._ECSer.getECStatusKeywords().subscribe(res=>{
        this.ECStatusval = res;
    },(err:HttpErrorResponse)=>{
        if(err.error instanceof Error){
            console.log("Client Side Error")
        }else{
            console.log("server Side Error")
        }
    },()=>{
        this.ECStatus = this.ECStatusval;
    })
}

loadData() {
  this.loadparamsSubscription = this._ECSer.getExitCriteriaforAccount(this.IntegrationID).subscribe(res => {
      this.localecval = res;
  }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
          console.log("Client Sider Error.");
      } else {
          console.log("Server Sider Error.");
      }

  }, () => {
      this.dataSource.data = this.localecval;
      this.localec = this.localecval;
      this.dataLength = this.dataSource.data.length;
  });
}

onKey(event,obj:any){
    for (var i = 0; i < this.localec.length; i++) {
        if (this.localec[i]['EXIT_CRITERIA_ID'] == obj.EXIT_CRITERIA_ID) { 
          // this.localtes[i]['EXIT_CRITERIA'] = ''
          this.localec[i]['EXIT_CRITERIA_Comments'] = event.target.value
            // console.log(this.listarray)
            // event.srcElement.value
            break;
        }
    }    
  }

  onKeyURL(event,obj:any){

    for (var i = 0; i < this.localec.length; i++) {
        if (this.localec[i]['EXIT_CRITERIA_ID'] == obj.EXIT_CRITERIA_ID) { 
          // this.localtes[i]['EXIT_CRITERIA'] = ''
          this.localec[i]['EXIT_CRITERIA_URL'] = event.target.value
          break;
        }
    }    
  }

onUpdate() {
    this.UpdateSubscription = this._ECSer.putExitCriteriaAccount(this.localec).subscribe(res => {
        if (res.insert === "success") {
            this.dataSource.data = [];
            this.incrementSpinner();
             this.UpdateFlag = 1;
            setTimeout(() => {
                if (this.progress > 100) {
                    this.progress = 0;
                    this.loadData()
                    this.toaster.success('Inserted Succcessfully', 'Exit Criteria')
                } else {
                    this.toaster.error('Insert Fail', 'Exit Criteria')
                }
            }, 3000)
        }
       
    }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
            console.log("Client Side Error.");
            this.toaster.error('Client side Add new record Error', 'ttstoolssupport@in.ibm.com')
        } else {
            this.toaster.error('Server Insert Add new record Error', 'ttstoolssupport@in.ibm.com')
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

ngOnDestroy() {
    this.loadparamsSubscription.unsubscribe();
    this.getSprintstatusSubscription.unsubscribe();
    if(this.UpdateFlag === 1){  
        this.UpdateSubscription.unsubscribe();  
    }
}

}
