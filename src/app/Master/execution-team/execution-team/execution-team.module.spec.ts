import { ExecutionTeamModule } from './execution-team.module';

describe('ExecutionTeamModule', () => {
  let executionTeamModule: ExecutionTeamModule;

  beforeEach(() => {
    executionTeamModule = new ExecutionTeamModule();
  });

  it('should create an instance', () => {
    expect(executionTeamModule).toBeTruthy();
  });
});
