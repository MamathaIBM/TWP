import { TestBed } from '@angular/core/testing';

import { DeliverableCompletionService } from './deliverable-completion.service';

describe('DeliverableCompletionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliverableCompletionService = TestBed.get(DeliverableCompletionService);
    expect(service).toBeTruthy();
  });
});
