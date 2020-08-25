import { DefineEpicModule } from './define-epic.module';

describe('DefineEpicModule', () => {
  let defineEpicModule: DefineEpicModule;

  beforeEach(() => {
    defineEpicModule = new DefineEpicModule();
  });

  it('should create an instance', () => {
    expect(defineEpicModule).toBeTruthy();
  });
});
