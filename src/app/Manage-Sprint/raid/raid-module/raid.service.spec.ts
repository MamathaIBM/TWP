import { TestBed, async, inject  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule}from '@angular/common/http';
import { RaidService } from './raid.service';

describe('RaidService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientTestingModule,
      HttpClientModule
    ],providers: [
      RaidService,
    ],
  }));

  it('should be created', () => {
    const service: RaidService = TestBed.get(RaidService);
    expect(service).toBeTruthy();
  });
  it(`should create`, async(inject([HttpTestingController, RaidService],
    (httpClient: HttpTestingController, raidService: RaidService) => {
      expect(raidService).toBeTruthy();
  })));
});
