import { TestBed } from '@angular/core/testing';

import { TransitionTeamService } from './transition-team.service';

describe('TransitionTeamService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransitionTeamService = TestBed.get(TransitionTeamService);
    expect(service).toBeTruthy();
  });
});
