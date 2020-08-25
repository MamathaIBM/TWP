import { TestBed } from '@angular/core/testing';

import { ContractualDeliverablesService } from './contractual-deliverables.service';

describe('ContractualDeliverablesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ContractualDeliverablesService = TestBed.get(ContractualDeliverablesService);
    expect(service).toBeTruthy();
  });
});
