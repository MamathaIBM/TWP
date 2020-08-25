import { StAdminHandoverPhaseActivityListModule } from './st-admin-handover-phase-activity-list.module';

describe('StAdminHandoverPhaseActivityListModule', () => {
  let stAdminHandoverPhaseActivityListModule: StAdminHandoverPhaseActivityListModule;

  beforeEach(() => {
    stAdminHandoverPhaseActivityListModule = new StAdminHandoverPhaseActivityListModule();
  });

  it('should create an instance', () => {
    expect(stAdminHandoverPhaseActivityListModule).toBeTruthy();
  });
});
