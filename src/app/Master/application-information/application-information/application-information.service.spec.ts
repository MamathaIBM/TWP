import { TestBed } from '@angular/core/testing';

import { ApplicationInformationService } from './application-information.service';

describe('ApplicationInformationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationInformationService = TestBed.get(ApplicationInformationService);
    expect(service).toBeTruthy();
  });
});
