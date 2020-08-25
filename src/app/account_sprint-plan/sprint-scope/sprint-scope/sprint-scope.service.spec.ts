import { TestBed } from '@angular/core/testing';

import { SprintScopeService } from './sprint-scope.service';

describe('SprintScopeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SprintScopeService = TestBed.get(SprintScopeService);
    expect(service).toBeTruthy();
  });
});
