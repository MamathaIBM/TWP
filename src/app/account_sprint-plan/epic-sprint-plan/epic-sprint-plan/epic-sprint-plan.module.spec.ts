import { EpicSprintPlanModule } from './epic-sprint-plan.module';

describe('EpicSprintPlanModule', () => {
  let epicSprintPlanModule: EpicSprintPlanModule;

  beforeEach(() => {
    epicSprintPlanModule = new EpicSprintPlanModule();
  });

  it('should create an instance', () => {
    expect(epicSprintPlanModule).toBeTruthy();
  });
});
