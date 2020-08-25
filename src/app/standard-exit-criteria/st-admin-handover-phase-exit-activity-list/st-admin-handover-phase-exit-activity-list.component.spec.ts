import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StAdminHandoverPhaseExitActivityListComponent } from './st-admin-handover-phase-exit-activity-list.component';

describe('StAdminHandoverPhaseExitActivityListComponent', () => {
  let component: StAdminHandoverPhaseExitActivityListComponent;
  let fixture: ComponentFixture<StAdminHandoverPhaseExitActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StAdminHandoverPhaseExitActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StAdminHandoverPhaseExitActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
