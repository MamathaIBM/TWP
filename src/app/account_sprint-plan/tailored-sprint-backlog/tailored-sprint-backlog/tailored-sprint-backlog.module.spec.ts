import { TailoredSprintBacklogModule } from './tailored-sprint-backlog.module';

describe('TailoredSprintBacklogModule', () => {
  let tailoredSprintBacklogModule: TailoredSprintBacklogModule;

  beforeEach(() => {
    tailoredSprintBacklogModule = new TailoredSprintBacklogModule();
  });

  it('should create an instance', () => {
    expect(tailoredSprintBacklogModule).toBeTruthy();
  });
});
