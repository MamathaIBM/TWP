import { TransitionRiskAnalyzerAccountModule } from './transition-risk-analyzer-account.module';

describe('TransitionRiskAnalyzerAccountModule', () => {
  let transitionRiskAnalyzerAccountModule: TransitionRiskAnalyzerAccountModule;

  beforeEach(() => {
    transitionRiskAnalyzerAccountModule = new TransitionRiskAnalyzerAccountModule();
  });

  it('should create an instance', () => {
    expect(transitionRiskAnalyzerAccountModule).toBeTruthy();
  });
});
