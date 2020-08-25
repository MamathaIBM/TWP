import { FormControl } from '@angular/forms';
import { NavtntService } from '../navtnt.service';
import { Component, OnInit, Input , ViewChild} from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { ActiveTransitionsService } from 'src/app/manage-active-transitions/active-transitions.service';
import { Router } from '@angular/router';
import { NewExecutionService } from '../new-execution/service/new-execution.service';

export interface Execution {
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
}

@Component({
  selector: 'app-manage-active-transitions',
  templateUrl: './manage-active-transitions.component.html',
  styleUrls: ['./manage-active-transitions.component.css']
})
export class ManageActiveTransitionsComponent implements OnInit {


  ActiveTran: any;
  displayedColumns: string[] = ['ClientName', 'IntegrationID', 'SiebelOppNo', 'Sector', 'Industry', 'Edit'];

  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;
  Edit_Account: string;
  selectedRow: number;
  CreateFalg: string;
  TransitionArray: any;
  userID: any;
    constructor(private _Ser: ActiveTransitionsService,
      private _SerNew: NewExecutionService,
      private navigation: NavtntService,
      private route: Router) {
    this.dataLength = 0;
  }

  ngOnInit() {
    this.CreateFalg = 'No' ;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    this.userID = JSON.parse(sessionStorage.getItem('USER_ID'));
    this.userID = decodeURIComponent(this.userID._value);

    this._Ser.getActiveTransitionRecords(this.userID).subscribe(res => {

      // this.ActiveTran = res;
      this.dataSource.data = res;
      this.dataLength = res.length;
      this.dataLength = this.dataSource.data.length;
console.log(this.dataLength);

     }, (err: HttpErrorResponse) => {
       if (err.error instanceof Error) {
         console.log('Client Sider Error.');
       } else {console.log('Server Sider Error.');
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
  // this.route.navigate(['/transition-Main'], { queryParams: {'Status': 'Active' } });

  const sourceComponentPath = '/transition-Main';
  const destinationComponentPath = '/transition-Main';
  const destinationComponentParameterArray = [{ id: 'Id', param: this._SerNew.TranVal.IntegrationID },
                                            { id: 'ClientName', param: this._SerNew.TranVal.ClientName },
                                            { id: 'Sector', param: this._SerNew.TranVal.Sector },
                                            { id: 'Industry', param: this._SerNew.TranVal.Industry }, 
                                            { id: 'OwningTTS', param: this._SerNew.TranVal.Geo },
                                            { id: 'ViewFlag', param: 'No'} 
                                          ];
 // this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameterArray);

 var transitionOrg = this._SerNew.TranVal.Geo;  // Owning organization
   this.navigation.enterNewTransition(sourceComponentPath, 
                               destinationComponentPath,
                               this._SerNew.TranVal.IntegrationID,
                               transitionOrg,
                               destinationComponentParameterArray  ); 
}

}
