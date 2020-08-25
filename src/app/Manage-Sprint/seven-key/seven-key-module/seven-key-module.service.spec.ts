import { TestBed } from '@angular/core/testing';
 
import { SevenKeyModuleService } from './seven-key-module.service';

describe('SevenKeyModuleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SevenKeyModuleService = TestBed.get(SevenKeyModuleService);
    expect(service).toBeTruthy();
  });
});
