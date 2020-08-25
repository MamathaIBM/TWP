import { ExitcriteriaaccountsModule } from './exitcriteriaaccounts.module';

describe('ExitcriteriaaccountsModule', () => {
  let exitcriteriaaccountsModule: ExitcriteriaaccountsModule;

  beforeEach(() => {
    exitcriteriaaccountsModule = new ExitcriteriaaccountsModule();
  });

  it('should create an instance', () => {
    expect(exitcriteriaaccountsModule).toBeTruthy();
  });
});
