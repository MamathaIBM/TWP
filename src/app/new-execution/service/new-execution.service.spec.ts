import { TestBed } from '@angular/core/testing';

import { NewExecutionService } from './new-execution.service';

describe('NewExecutionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NewExecutionService = TestBed.get(NewExecutionService);
    expect(service).toBeTruthy();
  });
});
