import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StAdminImplementPhaseActivityListComponent } from './st-admin-implement-phase-activity-list.component';

describe('StAdminImplementPhaseActivityListComponent', () => {
  let component: StAdminImplementPhaseActivityListComponent;
  let fixture: ComponentFixture<StAdminImplementPhaseActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StAdminImplementPhaseActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StAdminImplementPhaseActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
