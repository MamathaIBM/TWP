import { EpicSprintPlanAddUpdateModule } from './epic-sprint-plan-add-update.module';

describe('EpicSprintPlanAddUpdateModule', () => {
  let epicSprintPlanAddUpdateModule: EpicSprintPlanAddUpdateModule;

  beforeEach(() => {
    epicSprintPlanAddUpdateModule = new EpicSprintPlanAddUpdateModule();
  });

  it('should create an instance', () => {
    expect(epicSprintPlanAddUpdateModule).toBeTruthy();
  });
});
