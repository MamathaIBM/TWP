import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StAdminImplementPhaseExitActivityListComponent } from './st-admin-implement-phase-exit-activity-list.component';

describe('StAdminImplementPhaseExitActivityListComponent', () => {
  let component: StAdminImplementPhaseExitActivityListComponent;
  let fixture: ComponentFixture<StAdminImplementPhaseExitActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StAdminImplementPhaseExitActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StAdminImplementPhaseExitActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
