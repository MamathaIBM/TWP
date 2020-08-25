import { SprintScopeModule } from './sprint-scope.module';

describe('SprintScopeModule', () => {
  let sprintScopeModule: SprintScopeModule;

  beforeEach(() => {
    sprintScopeModule = new SprintScopeModule();
  });

  it('should create an instance', () => {
    expect(sprintScopeModule).toBeTruthy();
  });
});
