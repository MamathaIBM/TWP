import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EpicSprintPlanAddUpdateComponent } from './epic-sprint-plan-add-update.component';

describe('EpicSprintPlanAddUpdateComponent', () => {
  let component: EpicSprintPlanAddUpdateComponent;
  let fixture: ComponentFixture<EpicSprintPlanAddUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EpicSprintPlanAddUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EpicSprintPlanAddUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
