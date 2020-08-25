import { TailoredWBSModule } from './tailored-wbs.module';

describe('TailoredWBSModule', () => {
  let tailoredWBSModule: TailoredWBSModule;

  beforeEach(() => {
    tailoredWBSModule = new TailoredWBSModule();
  });

  it('should create an instance', () => {
    expect(tailoredWBSModule).toBeTruthy();
  });
});
