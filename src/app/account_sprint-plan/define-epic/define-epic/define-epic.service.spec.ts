import { TestBed } from '@angular/core/testing';

import { DefineEpicService } from './define-epic.service';

describe('DefineEpicService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefineEpicService = TestBed.get(DefineEpicService);
    expect(service).toBeTruthy();
  });
});
