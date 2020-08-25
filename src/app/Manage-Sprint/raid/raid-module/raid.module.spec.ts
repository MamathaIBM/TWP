import { RaidModule } from './raid.module';

describe('RaidModule', () => {
  let raidModule: RaidModule;

  beforeEach(() => {
    raidModule = new RaidModule();
  });

  it('should create an instance', () => {
    expect(raidModule).toBeTruthy();
  });
});
