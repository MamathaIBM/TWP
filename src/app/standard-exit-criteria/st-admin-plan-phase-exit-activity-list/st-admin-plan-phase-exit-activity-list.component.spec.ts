import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StAdminPlanPhaseExitActivityListComponent } from './st-admin-plan-phase-exit-activity-list.component';

describe('StAdminPlanPhaseExitActivityListComponent', () => {
  let component: StAdminPlanPhaseExitActivityListComponent;
  let fixture: ComponentFixture<StAdminPlanPhaseExitActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StAdminPlanPhaseExitActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StAdminPlanPhaseExitActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
