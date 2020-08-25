import { TestBed } from '@angular/core/testing';

import { ControllerServiceService } from './controller-service.service';

describe('ControllerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ControllerServiceService = TestBed.get(ControllerServiceService);
    expect(service).toBeTruthy();
  });
});
