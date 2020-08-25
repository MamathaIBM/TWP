import { TransitionClosureModule } from './transition-closure.module';

describe('TransitionClosureModule', () => {
  let transitionClosureModule: TransitionClosureModule;

  beforeEach(() => {
    transitionClosureModule = new TransitionClosureModule();
  });

  it('should create an instance', () => {
    expect(transitionClosureModule).toBeTruthy();
  });
});
