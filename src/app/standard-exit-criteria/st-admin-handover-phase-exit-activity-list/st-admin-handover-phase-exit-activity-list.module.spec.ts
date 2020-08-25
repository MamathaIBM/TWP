import { StAdminHandoverPhaseExitActivityListModule } from './st-admin-handover-phase-exit-activity-list.module';

describe('StAdminHandoverPhaseExitActivityListModule', () => {
  let stAdminHandoverPhaseExitActivityListModule: StAdminHandoverPhaseExitActivityListModule;

  beforeEach(() => {
    stAdminHandoverPhaseExitActivityListModule = new StAdminHandoverPhaseExitActivityListModule();
  });

  it('should create an instance', () => {
    expect(stAdminHandoverPhaseExitActivityListModule).toBeTruthy();
  });
});
