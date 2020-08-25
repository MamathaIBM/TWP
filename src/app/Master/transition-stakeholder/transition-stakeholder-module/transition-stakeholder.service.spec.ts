import { TestBed } from '@angular/core/testing';

import { TransitionStakeholderService } from './transition-stakeholder.service';

describe('TransitionStakeholderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransitionStakeholderService = TestBed.get(TransitionStakeholderService);
    expect(service).toBeTruthy();
  });
});
