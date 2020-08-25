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
import { DeliverableCompletionService } from './deliverable-completion/deliverable-completion.service';


@Component({
  selector: 'app-deliverable-completion',
  templateUrl: './deliverable-completion.component.html',
  styleUrls: ['./deliverable-completion.component.css']
})
export class DeliverableCompletionComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  selectedRow: number;
  private displayedColumns: string[] = ['DeliverableName', 'DeliverableValues', 'ContractDoc_OwnerNM', 'ContractDeliver_Status', 'ContractDeliver_Comments'];  
  private getSprintstatusSubscription: Subscription
  private loadparamsSubscription: Subscription  
  private loadparamsSubscription1: Subscription  
  private saveSubscription: Subscription;
  private UpdateSubscription: Subscription;
  private deleteSubscription: Subscription;
  private epicNameSubscription : Subscription;
  FlagHide: string;
  username: any;
  IntegrationID: string;
  CDStatus: any;
  localcd: any;
  progress: number;
    CDStatusval: any;
    localcdval: any;

  constructor(private _CDSer: DeliverableCompletionService,
    private fb: FormBuilder,
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private navigation: NavtntService,
    private toaster: ToastrService) {
    
      this.dataLength = 0;
      this.selectedRow = 0;
      this.dataLength = 0;
    
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
          this.loadgetECstatusKeywords();         
        }
  });
  }

  loadgetECstatusKeywords(){
    this.getSprintstatusSubscription = this._CDSer.getCDStatusKeywords().subscribe(res=>{
        this.CDStatusval = res;
    },(err:HttpErrorResponse)=>{
        if(err.error instanceof Error){
            console.log("Client Side Error")
        }else{
            console.log("server Side Error")
        }
    },()=>{
        this.CDStatus = this.CDStatusval;
    })
}

loadData() {
  this.loadparamsSubscription = this._CDSer.getCDforAccount(this.IntegrationID).subscribe(res => {
      this.localcdval = res;
  }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
          console.log("Client Sider Error.");
      } else {
          console.log("Server Sider Error.");
      }

  }, () => {
      this.dataSource.data = this.localcdval;
      this.localcd = this.localcdval;
      this.dataLength = this.dataSource.data.length;
  });
}

onUpdate() {
        
  this.UpdateSubscription = this._CDSer.putCDAccount(this.localcd).subscribe(res => {
      if (res.insert === "success") {
          this.dataSource.data = [];
          this.incrementSpinner();
          // this.UpdateFlag = 1;
          setTimeout(() => {
              if (this.progress > 100) {
                  this.progress = 0;
                  this.loadData()
                  this.toaster.success('Inserted Succcessfully', 'Deliverable Completion')
              } else {
                  this.toaster.error('Insert Fail', 'Deliverable Completion')
              }
          }, 3000)
      }
      console.log(res)
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

onKey(event,obj:any){
    for (var i = 0; i < this.localcd.length; i++) {
        if (this.localcd[i]['CDUNID'] == obj.CDUNID) { 
          // this.localtes[i]['EXIT_CRITERIA'] = ''
          this.localcd[i]['ContractDeliver_Comments'] = event.target.value
            // console.log(this.listarray)
            // event.srcElement.value
            break;
        }
    }    
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

}
