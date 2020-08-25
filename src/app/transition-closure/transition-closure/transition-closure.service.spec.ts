import { TestBed } from '@angular/core/testing';

import { TransitionClosureService } from './transition-closure.service';

describe('TransitionClosureService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransitionClosureService = TestBed.get(TransitionClosureService);
    expect(service).toBeTruthy();
  });
});
