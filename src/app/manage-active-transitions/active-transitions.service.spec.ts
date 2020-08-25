import { TestBed } from '@angular/core/testing';

import { ActiveTransitionsService } from './active-transitions.service';

describe('ActiveTransitionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ActiveTransitionsService = TestBed.get(ActiveTransitionsService);
    expect(service).toBeTruthy();
  });
});
