import { TestBed } from '@angular/core/testing';

import { NavtntService } from './navtnt.service';

describe('NavtntService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NavtntService = TestBed.get(NavtntService);
    expect(service).toBeTruthy();
  });
});
