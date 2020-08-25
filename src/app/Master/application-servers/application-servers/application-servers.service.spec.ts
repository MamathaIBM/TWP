import { TestBed } from '@angular/core/testing';

import { ApplicationServersService } from './application-servers.service';

describe('ApplicationServersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ApplicationServersService = TestBed.get(ApplicationServersService);
    expect(service).toBeTruthy();
  });
});
