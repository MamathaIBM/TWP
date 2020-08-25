import { ApplicationServersModule } from './application-servers.module';

describe('ApplicationServersModule', () => {
  let applicationServersModule: ApplicationServersModule;

  beforeEach(() => {
    applicationServersModule = new ApplicationServersModule();
  });

  it('should create an instance', () => {
    expect(applicationServersModule).toBeTruthy();
  });
});
