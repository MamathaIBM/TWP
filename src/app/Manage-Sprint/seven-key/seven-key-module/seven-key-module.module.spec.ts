import { SevenKeyModuleModule } from './seven-key-module.module';
 
describe('SevenKeyModuleModule', () => {
  let sevenKeyModuleModule: SevenKeyModuleModule;

  beforeEach(() => {
    sevenKeyModuleModule = new SevenKeyModuleModule();
  });

  it('should create an instance', () => {
    expect(sevenKeyModuleModule).toBeTruthy();
  });
});
