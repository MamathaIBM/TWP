import { ViewConsentformModule } from './view-consentform.module';

describe('ViewConsentformModule', () => {
  let viewConsentformModule: ViewConsentformModule;

  beforeEach(() => {
    viewConsentformModule = new ViewConsentformModule();
  });

  it('should create an instance', () => {
    expect(viewConsentformModule).toBeTruthy();
  });
});
