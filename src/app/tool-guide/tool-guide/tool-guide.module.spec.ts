import { ToolGuideModule } from './tool-guide.module';

describe('ToolGuideModule', () => {
  let toolGuideModule: ToolGuideModule;

  beforeEach(() => {
    toolGuideModule = new ToolGuideModule();
  });

  it('should create an instance', () => {
    expect(toolGuideModule).toBeTruthy();
  });
});
