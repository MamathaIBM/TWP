import { TailoredServiceBacklogModule } from './tailored-service-backlog.module';

describe('TailoredServiceBacklogModule', () => {
  let tailoredServiceBacklogModule: TailoredServiceBacklogModule;

  beforeEach(() => {
    tailoredServiceBacklogModule = new TailoredServiceBacklogModule();
  });

  it('should create an instance', () => {
    expect(tailoredServiceBacklogModule).toBeTruthy();
  });
});
