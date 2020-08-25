import { TestBed } from '@angular/core/testing';

import { SprintLevelPlanService } from './sprint-level-plan.service';

describe('SprintLevelPlanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SprintLevelPlanService = TestBed.get(SprintLevelPlanService);
    expect(service).toBeTruthy();
  });
});
