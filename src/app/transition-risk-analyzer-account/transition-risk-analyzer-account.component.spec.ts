import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionRiskAnalyzerAccountComponent } from './transition-risk-analyzer-account.component';

describe('TransitionRiskAnalyzerAccountComponent', () => {
  let component: TransitionRiskAnalyzerAccountComponent;
  let fixture: ComponentFixture<TransitionRiskAnalyzerAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionRiskAnalyzerAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionRiskAnalyzerAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
