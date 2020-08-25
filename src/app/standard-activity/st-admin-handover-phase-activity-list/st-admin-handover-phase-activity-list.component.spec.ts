import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StAdminHandoverPhaseActivityListComponent } from './st-admin-handover-phase-activity-list.component';

describe('StAdminHandoverPhaseActivityListComponent', () => {
  let component: StAdminHandoverPhaseActivityListComponent;
  let fixture: ComponentFixture<StAdminHandoverPhaseActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StAdminHandoverPhaseActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StAdminHandoverPhaseActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
