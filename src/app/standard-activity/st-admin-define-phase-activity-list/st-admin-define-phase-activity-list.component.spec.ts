import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StAdminDefinePhaseActivityListComponent } from './st-admin-define-phase-activity-list.component';

describe('StAdminDefinePhaseActivityListComponent', () => {
  let component: StAdminDefinePhaseActivityListComponent;
  let fixture: ComponentFixture<StAdminDefinePhaseActivityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StAdminDefinePhaseActivityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StAdminDefinePhaseActivityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
