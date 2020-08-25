import { StAdminPlanPhaseExitActivityListModule } from './st-admin-plan-phase-exit-activity-list.module';

describe('StAdminPlanPhaseExitActivityListModule', () => {
  let stAdminPlanPhaseExitActivityListModule: StAdminPlanPhaseExitActivityListModule;

  beforeEach(() => {
    stAdminPlanPhaseExitActivityListModule = new StAdminPlanPhaseExitActivityListModule();
  });

  it('should create an instance', () => {
    expect(stAdminPlanPhaseExitActivityListModule).toBeTruthy();
  });
});
