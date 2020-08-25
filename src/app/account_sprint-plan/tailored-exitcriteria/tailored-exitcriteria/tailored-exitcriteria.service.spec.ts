import { TestBed } from '@angular/core/testing';

import { TailoredExitcriteriaService } from './tailored-exitcriteria.service';

describe('TailoredExitcriteriaService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TailoredExitcriteriaService = TestBed.get(TailoredExitcriteriaService);
    expect(service).toBeTruthy();
  });
});
