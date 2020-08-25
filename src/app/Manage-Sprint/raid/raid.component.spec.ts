import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import {RaidService} from './raid-module/raid.service';
import {Component} from '@angular/core';
import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {RAIDComponent} from 'src/app/Manage-Sprint/raid/raid.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule ,MatTableDataSource, getMatAutocompleteMissingPanelError } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import {MatButtonModule, MatButton} from '@angular/material/button';
import { NgForm,FormsModule ,ReactiveFormsModule } from '@angular/forms';
import{HttpClientModule}from '@angular/common/http';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import { Validators,FormGroup, FormControl,FormBuilder } from '@angular/forms';
import { NavtntService } from './../../navtnt.service';
import { HttpErrorResponse } from "@angular/common/http";
import {BrowserModule, By} from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { Button } from 'protractor';
import { tick } from '@angular/core/src/render3';

@Component({
  selector: 'app-raid',
  templateUrl: './raid.component.html',
  styleUrls: ['./raid.component.css']
})

class RaidStubComponent{
  dataSource = new MatTableDataSource<any>();  
  RaidData:any;
  
}

describe('RAIDComponent', () => {
  let component: RAIDComponent;
  let fixture: ComponentFixture<RAIDComponent>;
  let service : RaidService;
  const routes : Routes=[
    {
      path : '',
      component : RAIDComponent
    }
  ]
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[CommonModule,
              RouterModule.forChild(routes),
              FormsModule,
              ReactiveFormsModule,
              MatTableModule,
              MatRadioModule,
              MatPaginatorModule,
              MatSortModule,
              MatButtonModule,
              RouterTestingModule ,
              HttpClientTestingModule,
              HttpClientModule],

      declarations: [ RAIDComponent ],

      providers: [ //{provide:RaidService, useClass:MockRaidService},
        RaidService,
        NavtntService,
        FormBuilder
       ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RAIDComponent);
    component = fixture.componentInstance;
  }); 

  it('should create', () => {
    fixture = TestBed.createComponent(RAIDComponent);
    let raid = fixture.debugElement.componentInstance;
    expect(raid).toBeTruthy();
  });
  it('testing button labels',()=>{
    component.ngOnInit();
    const buttonLabel = fixture.debugElement.query(By.css('button.mat-raised-button')).nativeElement;
    expect(buttonLabel.textContent).toContain('ADD');
    expect(buttonLabel.textContent).toContain('UPDATE');
  });
  it('testing header labels1',()=>{
    component.ngOnInit();
    const heading = fixture.debugElement.query(By.css('div.mat-paginator-container')).nativeElement;
    expect(heading.textContent).toBeTruthy;
    
  });
  /*
   it('test heading', fakeAsync(() => {
    fixture = TestBed.createComponent(RAIDComponent);
    //following 3 lines are used instead of tick(). tick can b used in fakeAsync and is a better approach
   // fixture.whenStable().then(()=>{
    //  fixture.detectChanges();
    //  return fixture.whenStable();})
    component.ngOnInit();
    let table = fixture.debugElement.nativeElement;
    spyOn(service,'getRaidData').and.returnValues(){
      Observable.of('EpicName'),
      Observable.of('Risk')
      };
    const heading = fixture.debugElement.query(By.css('div')).nativeElement;
    expect(heading.textContent).toEqual('RAID Information');
    const button = fixture.debugElement.query(By.css('button')).nativeElement;
    button.click();
    tick(10000);
    fixture.detectChanges();

    
    }));
    heroDe  = fixture.debugElement.query(By.css('.hero'));
    heroEl = heroDe.nativeElement;
    
    // mock the hero supplied by the parent component
    expectedHero = { id: 42, name: 'Test Name' };
    
    // simulate the parent setting the input property with that hero
    comp.hero = expectedHero;
    
    // trigger initial data binding
    fixture.detectChanges();
    it('should display hero name in uppercase', () => {
      const expectedPipedName = expectedHero.name.toUpperCase();
      expect(heroEl.textContent).toContain(expectedPipedName);
    });
  it('test heading1', () => {
    const fixture = TestBed.createComponent(RAIDComponent);
    const component = fixture.componentInstance;
    const dataSource=
      {
        epicName: 'Epic',
        Type: 'Risk',
        Description: 'TestKarmaJasmine',
        Status: 'Open',
        TargetDate : '',
        Owner:'Kavitha',
        Priority: 'High'
      }/* ,
      {
        epicName: 'Epic01',
        Type: 'Issue',
        Description: 'TestKarmaJasmine',
        Status: 'Open',
        TargetDate : '',
        Owner:'Kavitha',
        Priority: 'High'
      },
      {
        epicName: 'Epic2',
        Type: 'Action',
        Description: 'TestKarmaJasmine',
        Status: 'Open',
        TargetDate : '',
        Owner:'Kavitha',
        Priority: 'High'
      }    

      spyOn(service, 'getRaidData').and.callFake(()=>{
        return Observable.from([dataSource]);
      });
      tick(5000);
      fixture.detectChanges();
      component.ngOnInit();
      expect(component.dataSource).toBeGreaterThan(1);
}); */


});
