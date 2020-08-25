import { TestBed, inject } from '@angular/core/testing';

import { DataandparamService } from './dataandparam.service';

describe('UtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataandparamService]
    });
  });

  it('should be created', inject([DataandparamService], (service: DataandparamService) => {
    expect(service).toBeTruthy();
  }));
});
