import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionRiskAnalyzerAddAccountComponent } from './transition-risk-analyzer-add-account.component';

describe('TransitionRiskAnalyzerAddAccountComponent', () => {
  let component: TransitionRiskAnalyzerAddAccountComponent;
  let fixture: ComponentFixture<TransitionRiskAnalyzerAddAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionRiskAnalyzerAddAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionRiskAnalyzerAddAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
