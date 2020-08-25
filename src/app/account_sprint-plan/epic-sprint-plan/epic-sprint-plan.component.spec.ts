import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpicSprintPlanComponent } from './epic-sprint-plan.component';

describe('EpicSprintPlanComponent', () => {
  let component: EpicSprintPlanComponent;
  let fixture: ComponentFixture<EpicSprintPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpicSprintPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpicSprintPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
