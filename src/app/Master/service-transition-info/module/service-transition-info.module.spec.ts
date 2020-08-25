import { ServiceTransitionInfoModule } from './service-transition-info.module';

describe('ServiceTransitionInfoModule', () => {
  let serviceTransitionInfoModule: ServiceTransitionInfoModule;

  beforeEach(() => {
    serviceTransitionInfoModule = new ServiceTransitionInfoModule();
  });

  it('should create an instance', () => {
    expect(serviceTransitionInfoModule).toBeTruthy();
  });
});
