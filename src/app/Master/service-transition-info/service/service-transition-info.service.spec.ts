import { TestBed } from '@angular/core/testing';

import { ServiceTransitionInfoService } from './service-transition-info.service';

describe('ServiceTransitionInfoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServiceTransitionInfoService = TestBed.get(ServiceTransitionInfoService);
    expect(service).toBeTruthy();
  });
});
