import { ApplicationInformationModule } from './application-information.module';

describe('ApplicationInformationModule', () => {
  let applicationInformationModule: ApplicationInformationModule;

  beforeEach(() => {
    applicationInformationModule = new ApplicationInformationModule();
  });

  it('should create an instance', () => {
    expect(applicationInformationModule).toBeTruthy();
  });
});
