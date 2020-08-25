import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StAdminDefinePhaseExitActivityListComponent } from './st-admin-define-phase-exit-activity-list.component';

describe('StAdminDefinePhaseExitActivityListComponent', () => {
  let component: StAdminDefinePhaseExitActivityListComponent;
  let fixture: ComponentFixture<StAdminDefinePhaseExitActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StAdminDefinePhaseExitActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StAdminDefinePhaseExitActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
