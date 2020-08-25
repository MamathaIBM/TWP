import { TransitionTeamModule } from './transition-team.module';

describe('TransitionTeamModule', () => {
  let transitionTeamModule: TransitionTeamModule;

  beforeEach(() => {
    transitionTeamModule = new TransitionTeamModule();
  });

  it('should create an instance', () => {
    expect(transitionTeamModule).toBeTruthy();
  });
});
