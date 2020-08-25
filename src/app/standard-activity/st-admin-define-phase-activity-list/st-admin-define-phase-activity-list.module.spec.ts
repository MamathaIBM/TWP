import { StAdminDefinePhaseActivityListModule } from './st-admin-define-phase-activity-list.module';

describe('StAdminDefinePhaseActivityListModule', () => {
  let stAdminDefinePhaseActivityListModule: StAdminDefinePhaseActivityListModule;

  beforeEach(() => {
    stAdminDefinePhaseActivityListModule = new StAdminDefinePhaseActivityListModule();
  });

  it('should create an instance', () => {
    expect(stAdminDefinePhaseActivityListModule).toBeTruthy();
  });
});
