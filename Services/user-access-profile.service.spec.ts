import { TestBed, inject } from '@angular/core/testing';

import { UserAccessProfileService } from './user-access-profile.service';

describe('UserAccessProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserAccessProfileService]
    });
  });

  it('should be created', inject([UserAccessProfileService], (service: UserAccessProfileService) => {
    expect(service).toBeTruthy();
  }));
});
