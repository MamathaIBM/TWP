import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintLevelPlanComponent } from './sprint-level-plan.component';

describe('SprintLevelPlanComponent', () => {
  let component: SprintLevelPlanComponent;
  let fixture: ComponentFixture<SprintLevelPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SprintLevelPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprintLevelPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
