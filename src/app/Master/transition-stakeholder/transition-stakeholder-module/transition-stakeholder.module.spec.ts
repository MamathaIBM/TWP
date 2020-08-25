import { TransitionStakeholderModule } from './transition-stakeholder.module';

describe('TransitionStakeholderModule', () => {
  let transitionStakeholderModule: TransitionStakeholderModule;

  beforeEach(() => {
    transitionStakeholderModule = new TransitionStakeholderModule();
  });

  it('should create an instance', () => {
    expect(transitionStakeholderModule).toBeTruthy();
  });
});
