import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentFormComponent } from './consent-form.component';
import { NavtntService } from '../navtnt.service';
import { RouterModule, Routes } from '@angular/router';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ConsentFormComponent', () => {
  let component: ConsentFormComponent;
  let fixture: ComponentFixture<ConsentFormComponent>;
  const routes: Routes = [
    { path : 'ViewConsentformComponent',
    loadChildren : './view-consentform/view-consentform/view-consentform.module#ViewConsentformModule' },
    ];
    beforeEach((() => {
      TestBed.resetTestEnvironment();
 TestBed.initTestEnvironment(BrowserDynamicTestingModule,
    platformBrowserDynamicTesting());
    
    TestBed.configureTestingModule({
      declarations: [ ConsentFormComponent ],
      imports:[RouterModule.forRoot(routes),
        HttpClientTestingModule
        ],
      providers:[NavtntService,
      { provide: APP_BASE_HREF, useValue: '/' }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
        expect(component).toBeTruthy();
  });
});
