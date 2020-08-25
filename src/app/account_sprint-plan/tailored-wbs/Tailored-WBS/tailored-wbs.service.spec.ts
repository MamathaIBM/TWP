import { TestBed } from '@angular/core/testing';

import { TailoredWBSService } from './tailored-wbs.service';

describe('TailoredWBSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TailoredWBSService = TestBed.get(TailoredWBSService);
    expect(service).toBeTruthy();
  });
});
