import { TestBed } from '@angular/core/testing';

import { ExitcriteriaaccountsService } from './exitcriteriaaccounts.service';

describe('ExitcriteriaaccountsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExitcriteriaaccountsService = TestBed.get(ExitcriteriaaccountsService);
    expect(service).toBeTruthy();
  });
});
