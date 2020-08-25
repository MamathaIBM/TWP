import { TestBed } from '@angular/core/testing';

import { TailoredServiceBacklogService } from './tailored-service-backlog.service';

describe('TailoredServiceBacklogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TailoredServiceBacklogService = TestBed.get(TailoredServiceBacklogService);
    expect(service).toBeTruthy();
  });
});
