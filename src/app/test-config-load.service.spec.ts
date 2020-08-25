import { TestBed } from '@angular/core/testing';

import { TestConfigLoadService } from './test-config-load.service';

describe('TestConfigLoadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TestConfigLoadService = TestBed.get(TestConfigLoadService);
    expect(service).toBeTruthy();
  });
});
