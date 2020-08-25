import { TestBed } from '@angular/core/testing';

import { TailoredSprintBacklogService } from './tailored-sprint-backlog.service';

describe('TailoredSprintBacklogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TailoredSprintBacklogService = TestBed.get(TailoredSprintBacklogService);
    expect(service).toBeTruthy();
  });
});
