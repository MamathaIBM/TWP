import { ContractualDeliverablesModule } from './contractual-deliverables.module';

describe('ContractualDeliverablesModule', () => {
  let contractualDeliverablesModule: ContractualDeliverablesModule;

  beforeEach(() => {
    contractualDeliverablesModule = new ContractualDeliverablesModule();
  });

  it('should create an instance', () => {
    expect(contractualDeliverablesModule).toBeTruthy();
  });
});
