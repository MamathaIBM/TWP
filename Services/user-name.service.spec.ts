import { TestBed } from '@angular/core/testing';

import { UserNameService } from './user-name.service';

describe('UserNameService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserNameService = TestBed.get(UserNameService);
    expect(service).toBeTruthy();
  });
  
});
