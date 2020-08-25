import { TransitionRiskAnalyzerAdminModule } from './transition-risk-analyzer-admin.module';

describe('TransitionRiskAnalyzerAdminModule', () => {
  let transitionRiskAnalyzerAdminModule: TransitionRiskAnalyzerAdminModule;

  beforeEach(() => {
    transitionRiskAnalyzerAdminModule = new TransitionRiskAnalyzerAdminModule();
  });

  it('should create an instance', () => {
    expect(transitionRiskAnalyzerAdminModule).toBeTruthy();
  });
});
