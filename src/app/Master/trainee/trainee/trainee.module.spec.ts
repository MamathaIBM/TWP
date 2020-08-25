import { TraineeModule } from './trainee.module';

describe('TraineeModule', () => {
  let traineeModule: TraineeModule;

  beforeEach(() => {
    traineeModule = new TraineeModule();
  });

  it('should create an instance', () => {
    expect(traineeModule).toBeTruthy();
  });
});
