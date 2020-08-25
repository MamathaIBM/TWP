import { StAdminPlanPhaseActivityListModule } from './st-admin-plan-phase-activity-list.module';

describe('StAdminPlanPhaseActivityListModule', () => {
  let stAdminPlanPhaseActivityListModule: StAdminPlanPhaseActivityListModule;

  beforeEach(() => {
    stAdminPlanPhaseActivityListModule = new StAdminPlanPhaseActivityListModule();
  });

  it('should create an instance', () => {
    expect(stAdminPlanPhaseActivityListModule).toBeTruthy();
  });
});
