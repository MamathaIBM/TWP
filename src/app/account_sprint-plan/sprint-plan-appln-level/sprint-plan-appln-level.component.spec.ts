import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintPlanApplnLevelComponent } from './sprint-plan-appln-level.component';

describe('SprintPlanApplnLevelComponent', () => {
  let component: SprintPlanApplnLevelComponent;
  let fixture: ComponentFixture<SprintPlanApplnLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintPlanApplnLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintPlanApplnLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
