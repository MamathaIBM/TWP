import { TestBed } from '@angular/core/testing';

import { TransitionRiskAnalyzerAccountService } from './transition-risk-analyzer-account.service';

describe('TransitionRiskAnalyzerAccountService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransitionRiskAnalyzerAccountService = TestBed.get(TransitionRiskAnalyzerAccountService);
    expect(service).toBeTruthy();
  });
});
