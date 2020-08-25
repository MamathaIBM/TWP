import { TestBed } from '@angular/core/testing';

import { EpicSprintPlanService } from './epic-sprint-plan.service';

describe('EpicSprintPlanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EpicSprintPlanService = TestBed.get(EpicSprintPlanService);
    expect(service).toBeTruthy();
  });
});
