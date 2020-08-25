import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StAdminPlanPhaseActivityListComponent } from './st-admin-plan-phase-activity-list.component';

describe('StAdminPlanPhaseActivityListComponent', () => {
  let component: StAdminPlanPhaseActivityListComponent;
  let fixture: ComponentFixture<StAdminPlanPhaseActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StAdminPlanPhaseActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StAdminPlanPhaseActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
