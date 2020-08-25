import { AllTransitionAccountsService } from './service/all-transition-accounts.service';
import { Component, OnInit , ViewChild} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { Router } from '@angular/router';
import { NewExecutionService } from '../new-execution/service/new-execution.service';
import { NavtntService } from '../navtnt.service';

export interface AllExecution {
  // MatPaginator Output
  pageEvent: PageEvent;
  IntegrationID:  string;
  ClientName:  string;
  AccountName:  string;
  Sector:  string;
  Industry:  string;
  ProjectID:  string;
  SiebelNumber:  string;
  TranPlannedStartDate:  string;
  TranPlannedEndDate:  string;
  TranActualStartDate:  string;
  TranActualEndDate:  string;
  NoofFTE:  string;
  NoofApps:  string;
  OverallTranRiskRAG:  string;
  TranMgrName:  string;
  TCV:  string;
  TransitionStatus: string;
  CreateFalg: any;
}

@Component({
  selector: 'app-all-transition-accounts',
  templateUrl: './all-transition-accounts.component.html',
  styleUrls: ['./all-transition-accounts.component.css']
})
export class AllTransitionAccountsComponent implements OnInit {

  ActiveTran: any;
  displayedColumns: string[] = ['ClientName', 'IntegrationID', 'SiebelOppNo', 'Sector', 'Industry', 'TransitionStatus', 'USER_FULLNAME', 'View'];

  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  Edit_Account: string;
  isPreviousButtonDisabled: boolean;
  isNextButtonDisabled: boolean;
 selectedRow: number;
  CreateFalg: string;
  SelectedData: any;
  private SolOwnTTS = [];
  USER_ORG: any;

  constructor(private _Ser: AllTransitionAccountsService,
    private _SerNew: NewExecutionService,
    private navigation: NavtntService,
    private route: Router) {
    this.dataLength = 0;
    this.selectedRow = 0;
    this.dataLength = 0;
  }

  ngOnInit() {
    this.CreateFalg = 'No' ;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.USER_ORG = JSON.parse(sessionStorage.getItem('USER_TRAN_ORG'));
       
    this._Ser.getAllTransitionRecords(this.USER_ORG._value).subscribe(res => {

      // this.ActiveTran = res;
      this.dataSource.data = res;
      console.log(this.dataSource.data);
      this.dataLength = res.length;
      this.dataLength = this.dataSource.data.length;
     }, ( err: HttpErrorResponse) => {
       if ( err.error instanceof Error) {
         console.log('Client Sider Error.');
       } else {
         console.log('Server Sider Error.');
     }
     });
     }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  setClickedRow(index: number, rowdata: any): void {
    if(index === 0){
      this.selectedRow = 0;
    }else {
      if (index === this.selectedRow) {
        this.selectedRow = 0;
      } else {
        this.selectedRow = index;                
      }
    }      
  }
  
    EditCreateTransition(obj:any) {      
      this._SerNew.TranVal = obj;
      const sourceComponentPath = '/AllTransitionAccountsComponent';
      const destinationComponentPath = '/transition-Main';
      const destinationComponentParameterArray = [{ id: 'Id', param: this._SerNew.TranVal.IntegrationID },
                                                { id: 'ClientName', param: this._SerNew.TranVal.ClientName },
                                                { id: 'Sector', param: this._SerNew.TranVal.Sector },
                                                { id: 'Industry', param: this._SerNew.TranVal.Industry },
                                                { id: 'ViewFlag', param: 'Yes'}  ];
   // this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);
   var transitionOrg = this._SerNew.TranVal.Geo;  // Owning organization
   this.navigation.enterNewTransition(sourceComponentPath, 
                               destinationComponentPath,
                               this._SerNew.TranVal.IntegrationID,
                               transitionOrg,
                               destinationComponentParameterArray); 
}
   }
  // }
