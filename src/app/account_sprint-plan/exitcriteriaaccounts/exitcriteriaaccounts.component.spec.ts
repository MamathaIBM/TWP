import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitcriteriaaccountsComponent } from './exitcriteriaaccounts.component';

describe('ExitcriteriaaccountsComponent', () => {
  let component: ExitcriteriaaccountsComponent;
  let fixture: ComponentFixture<ExitcriteriaaccountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitcriteriaaccountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitcriteriaaccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
