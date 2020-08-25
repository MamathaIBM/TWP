import { SprintLevelPlanModule } from './sprint-level-plan.module';

describe('SprintLevelPlanModule', () => {
  let sprintLevelPlanModule: SprintLevelPlanModule;

  beforeEach(() => {
    sprintLevelPlanModule = new SprintLevelPlanModule();
  });

  it('should create an instance', () => {
    expect(sprintLevelPlanModule).toBeTruthy();
  });
});
