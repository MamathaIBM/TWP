import { TestBed } from '@angular/core/testing';

import { ExecutionTeamService } from './execution-team.service';

describe('ExecutionTeamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExecutionTeamService = TestBed.get(ExecutionTeamService);
    expect(service).toBeTruthy();
  });
});
