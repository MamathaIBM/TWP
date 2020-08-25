import { DeliverableCompletionModule } from './deliverable-completion.module';

describe('DeliverableCompletionModule', () => {
  let deliverableCompletionModule: DeliverableCompletionModule;

  beforeEach(() => {
    deliverableCompletionModule = new DeliverableCompletionModule();
  });

  it('should create an instance', () => {
    expect(deliverableCompletionModule).toBeTruthy();
  });
});
