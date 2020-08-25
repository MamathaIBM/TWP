import { TestBed } from '@angular/core/testing';

import { TransitionRiskAnalyzerAdminService } from './transition-risk-analyzer-admin.service';

describe('TransitionRiskAnalyzerAdminService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TransitionRiskAnalyzerAdminService = TestBed.get(TransitionRiskAnalyzerAdminService);
    expect(service).toBeTruthy();
  });
});
