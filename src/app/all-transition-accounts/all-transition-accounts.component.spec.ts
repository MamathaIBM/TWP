import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { AllTransitionAccountsComponent } from './all-transition-accounts.component';
import { NavtntService } from '../navtnt.service';
import { NewExecutionService } from '../new-execution/service/new-execution.service';
import { AllTransitionAccountsService } from './service/all-transition-accounts.service';
import {  HttpClientModule } from '@angular/common/http';
import {  Routes, RouterModule } from '@angular/router';
import { CommonModule, APP_BASE_HREF } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule, MatRadioModule, MatPaginatorModule, MatSortModule, MatButtonModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
 import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


const testConfig = {
  getAllTransitionRecords: {
    positive: [{
      ClientName: "TWP18Mar2020",
      Industry: "Energy and Utility",
      IntegrationID: "",
      Sector: "Communication",
      SiebelOppNo: "S123",
TRANSITION_ID: "",
TransitionStatus: ""​​​,
USER_FULLNAME: "MAMATHA AMARANENI"​​​,
USER_NAME: "amaranenimamatha@in.ibm.com"
    },
    {
      ClientName: "TWP18Mar2020",
      Industry: "Energy and Utility",
      IntegrationID: "",
      Sector: "Communication",
      SiebelOppNo: "S123",
TRANSITION_ID: "",
TransitionStatus: ""​​​,
USER_FULLNAME: "SAHITYA SANAGAPATI"​​​,
USER_NAME: "sahitya.sanagapati@in.ibm.com"
    }
    ],
    negative: []
  }
};

describe('AllTransitionAccountsComponent', () => {
  let component: AllTransitionAccountsComponent;
  let fixture: ComponentFixture<AllTransitionAccountsComponent>;
  let allTranService: AllTransitionAccountsService;
  let positiveResponse: any;
  let spyGetNotes: any;
  let negativeResponse: any;

  const routes: Routes = [
    { path: 'AllTransitionAccountsComponent', component: AllTransitionAccountsComponent },
    ];
    
  beforeEach((() => {
    window.sessionStorage.setItem('USER_TRAN_ORG', JSON.stringify({USER_NAME : {_expired: 0, _value: "China,Egypt,India,Korea"} }));
    TestBed.resetTestEnvironment();
 TestBed.initTestEnvironment(BrowserDynamicTestingModule,
    platformBrowserDynamicTesting());    
    TestBed.configureTestingModule({
      declarations: [ AllTransitionAccountsComponent,
         ],
      imports:[ CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatRadioModule,
        BrowserAnimationsModule,
        MatPaginatorModule,
        MatSortModule,
        MatButtonModule,
        RouterTestingModule ,
        HttpClientTestingModule,
        HttpClientModule,
        
            ],
      providers:[NavtntService,
        NewExecutionService,
        AllTransitionAccountsService,

        { provide: APP_BASE_HREF, useValue: '/' }],
        schemas: [NO_ERRORS_SCHEMA  ]
      })
    .compileComponents();
  }));

  beforeEach(() => {    
    fixture = TestBed.createComponent(AllTransitionAccountsComponent);
    component = fixture.componentInstance;
    allTranService = fixture.debugElement.injector.get(AllTransitionAccountsService);
   });


  it('should create the All Transition View', (() => {    
    expect(component).toBeTruthy();        
  }));
  
  

  it('should handle if no accounts are created for user organization', (() => {
    negativeResponse = testConfig.getAllTransitionRecords.negative;
    spyGetNotes = spyOn(allTranService, 'getAllTransitionRecords').and.returnValue(Observable.of(negativeResponse));
    fixture.detectChanges();
    expect(component.dataSource.data.length).toBe(0, `'notStartedNotes' should be 0 length if no note is created `);
     }));

     it('should handle get all Transition Accounts', (() => {
      positiveResponse = testConfig.getAllTransitionRecords.positive;
      spyGetNotes = spyOn(allTranService, 'getAllTransitionRecords').and.returnValue(Observable.of(positiveResponse));
      fixture.detectChanges();
        expect(component.dataSource.data.length).toBe(2, `should populate 'notStartedNotes'`);
      }));
     
});
