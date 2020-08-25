import { RaidAddUpdateModule } from './raid-add-update.module';

describe('RaidAddUpdateModule', () => {
  let raidAddUpdateModule: RaidAddUpdateModule;

  beforeEach(() => {
    raidAddUpdateModule = new RaidAddUpdateModule();
  });

  it('should create an instance', () => {
    expect(raidAddUpdateModule).toBeTruthy();
  });
});
