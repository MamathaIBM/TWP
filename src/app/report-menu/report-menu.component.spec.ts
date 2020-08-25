import { async, ComponentFixture, TestBed, getTestBed } from '@angular/core/testing';
import { ReportMenuComponent, OrgWSRDialog } from './report-menu.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuTopComponent } from '../menu-top/menu-top.component';
import { MenuLeftComponent } from '../menu-left/menu-left.component';
import { Routes, RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { UserNameService } from 'Services/user-name.service';
import { StorageServiceModule } from 'angular-webstorage-service';
import {MatCardModule} from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule, MatInputModule, MatButtonModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { OverlayContainer } from 'ngx-toastr';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularWebStorageModule } from 'angular-web-storage';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { MatDialogModule, MatDialogRef} from '@angular/material';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { LoggerService } from 'Services/logger.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
const testConfig = {
  getAllAccounts: {
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
describe('ReportMenuComponent', () => {
  let component: ReportMenuComponent;
  let fixture: ComponentFixture<ReportMenuComponent>;
  const routes: Routes = [
  { path: 'Reports', component: ReportMenuComponent  },
   { path: 'menu-top', component: MenuTopComponent }, 
  { path: 'menu-left', component: MenuLeftComponent }, 
  ]; 
  beforeEach((() => {
    window.sessionStorage.setItem('USER_NAME', JSON.stringify({USER_NAME : {_expired: 0, _value: "SAHITYA%20SANAGAPATI"} }));
    window.sessionStorage.setItem('USER_TRAN_ORG', JSON.stringify({USER_NAME : {_expired: 0, _value: "China,Egypt,India,Korea"} }));
    TestBed.resetTestEnvironment();
 TestBed.initTestEnvironment(BrowserDynamicTestingModule,
    platformBrowserDynamicTesting());
    TestBed.configureTestingModule({
      declarations: [
        ReportMenuComponent,  
        MenuTopComponent,
        MenuLeftComponent,
        OrgWSRDialog,
      ],
      imports:[RouterModule.forRoot(routes),
        CommonModule,
        HttpClientTestingModule,
        RouterTestingModule,
        RouterModule,
        MatCardModule, 
        MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatRadioModule,
    MatSelectModule,
    BrowserModule,
    HttpClientModule,
    StorageServiceModule,
    BrowserAnimationsModule,
    AngularWebStorageModule,
      ],
      providers:[
        UserNameService,  
        StorageServiceModule, 
        UserAccessProfileService, 
         StorageServiceModule,      
        { provide: APP_BASE_HREF, useValue: '/' },
        { 
          provide: MatDialogRef,
          useValue: []
           }, 
          { 
          provide: MAT_DIALOG_DATA, 
          useValue: [] 
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(ReportMenuComponent);
    component = fixture.componentInstance; 
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

