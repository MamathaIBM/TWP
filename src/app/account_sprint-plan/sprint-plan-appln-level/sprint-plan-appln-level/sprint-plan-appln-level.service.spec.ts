import { TestBed } from '@angular/core/testing';

import { SprintPlanApplnLevelService } from './sprint-plan-appln-level.service';

describe('SprintPlanApplnLevelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SprintPlanApplnLevelService = TestBed.get(SprintPlanApplnLevelService);
    expect(service).toBeTruthy();
  });
});
