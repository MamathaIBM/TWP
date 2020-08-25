import { EpicAddUpdateModule } from './epic-add-update.module';

describe('EpicAddUpdateModule', () => {
  let epicAddUpdateModule: EpicAddUpdateModule;

  beforeEach(() => {
    epicAddUpdateModule = new EpicAddUpdateModule();
  });

  it('should create an instance', () => {
    expect(epicAddUpdateModule).toBeTruthy();
  });
});
