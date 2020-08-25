import { TestBed } from '@angular/core/testing';

import { AllTransitionAccountsService } from './all-transition-accounts.service';

describe('AllTransitionAccountsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AllTransitionAccountsService = TestBed.get(AllTransitionAccountsService);
    expect(service).toBeTruthy();
  });
});
