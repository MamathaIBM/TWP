import { TestBed } from '@angular/core/testing';

import { RaidAddUpdateService } from './raid-add-update.service';

describe('RaidAddUpdateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RaidAddUpdateService = TestBed.get(RaidAddUpdateService);
    expect(service).toBeTruthy();
  });
  it('testing getShowstopper', () => {
    const service: RaidAddUpdateService = TestBed.get(RaidAddUpdateService);
    expect(service).toBeTruthy();
    service.getShowstopper();
    //expect(service.quoteList.length).toBeGreaterThanOrEqual(1);
  });
});
