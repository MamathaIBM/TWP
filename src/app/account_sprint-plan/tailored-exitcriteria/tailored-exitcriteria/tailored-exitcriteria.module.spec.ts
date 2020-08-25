import { TailoredExitcriteriaModule } from './tailored-exitcriteria.module';

describe('TailoredExitcriteriaModule', () => {
  let tailoredExitcriteriaModule: TailoredExitcriteriaModule;

  beforeEach(() => {
    tailoredExitcriteriaModule = new TailoredExitcriteriaModule();
  });

  it('should create an instance', () => {
    expect(tailoredExitcriteriaModule).toBeTruthy();
  });
});
