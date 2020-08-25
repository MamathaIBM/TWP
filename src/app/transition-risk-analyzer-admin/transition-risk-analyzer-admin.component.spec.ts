import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransitionRiskAnalyzerAdminComponent } from './transition-risk-analyzer-admin.component';

describe('TransitionRiskAnalyzerAdminComponent', () => {
  let component: TransitionRiskAnalyzerAdminComponent;
  let fixture: ComponentFixture<TransitionRiskAnalyzerAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransitionRiskAnalyzerAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransitionRiskAnalyzerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
